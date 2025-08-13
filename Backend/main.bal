// ... existing imports
import Backend.db as db;
import Backend.models as models;
import Backend.utils as Utils;
// import ballerina/io;
import ballerina/http;
// import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerinax/mongodb;

// Configuration
configurable string mongodbConnectionString = ?;
configurable string databaseName = ?;
configurable string collectionName_users = ?;
configurable string collectionName_products = ?;
configurable string collectionName_shops = ?;

// MongoDB client configuration
mongodb:ConnectionConfig mongoConfig = {
    connection: mongodbConnectionString + databaseName
};
mongodb:Client mongoClient = check new (mongoConfig);

// Session storage (in-memory)
map<models:UserInfo> activeSessions = {};

// Define roles
const string ROLE_ADMIN = "admin";
const string ROLE_SELLER = "seller";
const string ROLE_CUSTOMER = "customer";

// CORS configuration
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://localhost:5173","http://localhost:8080"],
        allowCredentials: true,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}
service / on new http:Listener(9090) {

    // ================= LOGIN =================
    resource function post auth/login(models:LoginRequest loginReq)
            returns models:LoginResponse|http:InternalServerError|http:BadRequest|http:Unauthorized|http:Forbidden|http:Conflict {

        if loginReq.email.trim() == "" || loginReq.password.trim() == "" {
            return errorResponse(400, "Email and password are required");
        }

        models:User|error userResult = findUserByEmail(loginReq.email);
        if userResult is error {
            return errorResponse(401, "Invalid email or password");
        }

        if !Utils:verifyPassword(loginReq.password, userResult.password) {
            return errorResponse(401, "Invalid email or password");
        }

        string token = Utils:generateToken(userResult);

        models:UserInfo userInfo = {
            _id: userResult._id ?: "",
            name: userResult.name,
            email: userResult.email,
            role: userResult.role ?: ROLE_CUSTOMER // default role if not set
        };
        activeSessions[token] = userInfo;

        return {
            status: "success",
            message: "Login successful",
            token: token,
            user: userInfo
        };
    }

    // ================= REGISTER =================
    resource function post auth/register(models:User newUser)
            returns models:LoginResponse|http:InternalServerError|http:BadRequest|http:Conflict | http:Unauthorized |http:Forbidden{

        if newUser.email.trim() == "" || newUser.password.trim() == "" || newUser.name.trim() == "" {
            return errorResponse(400, "Name, email and password are required");
        }

        if findUserByEmail(newUser.email) is models:User {
            return errorResponse(409, "User with this email already exists");
        }

        string hashedPassword = Utils:hashPassword(newUser.password);
        string now = time:utcNow().toString();

        models:User userToCreate = {
            _id: uuid:createType4AsString(),
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword,
            role: newUser.role ?: ROLE_CUSTOMER, // new user role
            createdAt: now,
            updatedAt: now
        };

        if db:insertUser(userToCreate) is error {
            return errorResponse(500, "Failed to create user");
        }

        string token = Utils:generateToken(userToCreate);
        models:UserInfo userInfo = {
            _id: userToCreate._id ?: "",
            name: userToCreate.name,
            email: userToCreate.email,
            role: userToCreate.role ?: ROLE_CUSTOMER
        };
        activeSessions[token] = userInfo;

        return {
            status: "success",
            message: "User registered successfully",
            token: token,
            user: userInfo
        };
    }

    // ================= LOGOUT =================
    resource function post auth/logout(@http:Header string? authorization) returns json {
        if authorization is string {
            string token = authorization.substring(7);
            _ = activeSessions.remove(token);
        }
        return { status: "success", message: "Logged out successfully" };
    }

    // ================= PROFILE =================
    resource function get auth/profile(@http:Header string? authorization)
    returns models:UserInfo|models:LoginResponse|http:InternalServerError|http:BadRequest|http:Conflict|http:Unauthorized|http:Forbidden {

    var result = getUserFromAuthHeader(authorization);
    return result;
}


    // ================= PRODUCTS (Admin & Seller only) =================
   resource function get products(@http:Header string? authorization)
        returns models:ProductResponse|http:Unauthorized|http:Response|http:InternalServerError|error {

    models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
    if userOrUnauthorized is http:Unauthorized {
        return userOrUnauthorized;
    }

    models:UserInfo user = <models:UserInfo>userOrUnauthorized;

    if !checkRole(user, ROLE_ADMIN, ROLE_SELLER) {
    http:Response forbiddenResponse = new;
    forbiddenResponse.statusCode = 403;
    forbiddenResponse.setJsonPayload({
        status: "error",
        message: "Access denied: Admins or Sellers only"
    });
    return forbiddenResponse;
}


    mongodb:Database database;
    error? err = ();
    // Get database connection
    database = check mongoClient->getDatabase(databaseName);

    mongodb:Collection collection = check database->getCollection(collectionName_products);

    stream<models:Product, error?> productStream = check collection->find({}, {}, (), models:Product);

    models:Product[] products = check from models:Product product in productStream select product;

    return { products: products };
}

    // ================= SHOPS (Public) =================
    resource function get [int id]/shops() returns json|error {
        string mallId = "M" + id.toString();
        models:MallDoc? mallDocOptional = check getMallByMallId(mallId, mongoClient);

        if mallDocOptional is models:MallDoc {
            json[] shopsJson = from models:Shop s in mallDocOptional.shops
                select {
                    id: s.id,
                    name: s.name,
                    address: s.address,
                    ownerName: s.ownerName,
                    contactNumber: s.contactNumber,
                    email: s.email,
                    category: s.category,
                    rating: s.rating,
                    reviewCount: s.reviewCount,
                    image: s.imageUrl,
                    discount: s.discount
                };
            return { shops: shopsJson };
        }

        return { status: "error", message: "Mall not found for id " + id.toString() };
    }
}

// ================= HELPER FUNCTIONS =================
function findUserByEmail(string email) returns models:User|error {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName_users);

    map<json> filter = { "email": email };
    stream<models:User, error?> userStream = check collection->find(filter, {}, (), models:User);
    models:User[] users = check from models:User user in userStream select user;

    if users.length() > 0 {
        return users[0];
    }
    return error("User not found");
}

function getMallByMallId(string id, mongodb:Client mongoClient) returns models:MallDoc|error {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName_shops);

    map<json> query = { "mallId": id };
    stream<models:MallDoc, error?> mallStream = check collection->find(query, {}, (), models:MallDoc);

    models:MallDoc[] malls = check from models:MallDoc mall in mallStream select mall;
    if malls.length() > 0 {
        return malls[0];
}
    return error("Mall not found");
}

// ================= AUTH HELPERS =================
function getUserFromAuthHeader(string? authorization) 
    returns models:UserInfo|http:Unauthorized {
    
    if authorization is () {
        return <http:Unauthorized>{ body: { status: "error", message: "Authorization header required" } };
    }

    string token = authorization.substring(7);
    models:UserInfo? userInfo = activeSessions[token];

    if userInfo is () {
        return <http:Unauthorized>{ body: { status: "error", message: "Invalid or expired token" } };
    }

    return userInfo;
}



function checkRole(models:UserInfo user, string... allowedRoles) returns boolean {
    foreach string role in allowedRoles {
        if user.role == role {
            return true;
        }
    }
    return false;
}

function errorResponse(int statusCode, string msg)
    returns models:LoginResponse|http:InternalServerError|http:BadRequest|http:Conflict|http:Unauthorized|http:Forbidden {
    
    json res = { status: "error", message: msg };

    if statusCode == 400 {
        return <http:BadRequest>{ body: res };
    } else if statusCode == 401 {
        return <http:Unauthorized>{ body: res };
    } else if statusCode == 403 {
        return <http:Forbidden>{ body: res };
    } else if statusCode == 409 {
        return <http:Conflict>{ body: res };
    } else if statusCode == 500 {
        return <http:InternalServerError>{ body: res };
    }

    // fallback to LoginResponse
    return {
        status: "error",
        message: msg
    };
}
