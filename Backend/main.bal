import Backend.db as db;
import Backend.models as models;
import Backend.utils as Utils;
import ballerina/io;
import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerinax/mongodb;

// Configuration
configurable string mongodbConnectionString = ?;
configurable string databaseName = ?;
configurable string collectionName_users = ?;
configurable string collectionName_products = ?;
configurable string collectionName_shops = ?;
// configurable string jwtSecret = ?;

// MongoDB client configuration
mongodb:ConnectionConfig mongoConfig = {
    connection: mongodbConnectionString + databaseName
};

mongodb:Client mongoClient = check new (mongoConfig);

// User types

// Session storage (in-memory for simplicity)
map<models:UserInfo> activeSessions = {};

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

    // Login endpoint
    resource function post auth/login(models:LoginRequest loginReq) returns models:LoginResponse|http:InternalServerError|http:BadRequest|http:Unauthorized {

        // Validate input
        if loginReq.email.trim() == "" || loginReq.password.trim() == "" {
            return <http:BadRequest>{
                body: {
                    status: "error",
                    message: "Email and password are required"
                }
            };
        }

        // Find user in database
        models:User|error userResult = findUserByEmail(loginReq.email);

        if userResult is error {
            log:printError("Database error: " + userResult.message());
            return <http:Unauthorized>{
                body: {
                    status: "error",
                    message: "Invalid email or password"
                }
            };
        }

        // Verify password
        boolean isValidPassword = Utils:verifyPassword(loginReq.password, userResult.password);

        if !isValidPassword {
            return <http:Unauthorized>{
                body: {
                    status: "error",
                    message: "Invalid email or password"
                }
            };
        }

        // Generate simple token
        string token = Utils:generateToken(userResult);

        // Store session
        models:UserInfo userInfo = {
            _id: userResult._id ?: "",
            name: userResult.name,
            email: userResult.email
        };
        activeSessions[token] = userInfo;

        // Return successful response
        return {
            status: "success",
            message: "Login successful",
            token: token,
            user: userInfo
        };
    }

    // Register endpoint
    resource function post auth/register(models:User newUser) returns models:LoginResponse|http:InternalServerError|http:BadRequest|http:Conflict {

        // Validate input
        if newUser.email.trim() == "" || newUser.password.trim() == "" || newUser.name.trim() == "" {
            return <http:BadRequest>{
                body: {
                    status: "error",
                    message: "Name, email and password are required"
                }
            };
        }

        // Check if user already exists
        models:User|error existingUser = findUserByEmail(newUser.email);

        if existingUser is models:User {
            return <http:Conflict>{
                body: {
                    status: "error",
                    message: "User with this email already exists"
                }
            };
        }

        // Hash password
        string hashedPassword = Utils:hashPassword(newUser.password);

        // Create user object
        // ISO 8601 string format
        string now = time:utcNow().toString();

        models:User userToCreate = {
            _id: uuid:createType4AsString(),
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword,
            createdAt: now,
            updatedAt: now
        };

        // Insert user into database
        error? insertResult = db:insertUser(userToCreate);

        if insertResult is error {
            log:printError("Database insertion error: " + insertResult.message());
            return <http:InternalServerError>{
                body: {
                    status: "error",
                    message: "Failed to create user"
                }
            };
        }

        // Generate token
        string token = Utils:generateToken(userToCreate);

        // Store session
        models:UserInfo userInfo = {
            _id: userToCreate._id ?: "",
            name: userToCreate.name,
            email: userToCreate.email
        };
        activeSessions[token] = userInfo;

        return {
            status: "success",
            message: "User registered successfully",
            token: token,
            user: userInfo
        };
    }

    // Logout endpoint
    resource function post auth/logout(@http:Header string? authorization) returns json {
        if authorization is string {
            string token = authorization.substring(7); // Remove "Bearer " prefix
            _ = activeSessions.remove(token);
        }
        return {
            status: "success",
            message: "Logged out successfully"
        };
    }

    // Get user profile (protected route)
    resource function get auth/profile(@http:Header string? authorization) returns models:UserInfo|http:Unauthorized {
        if authorization is () {
            return <http:Unauthorized>{
                body: {
                    status: "error",
                    message: "Authorization header required"
                }
            };
        }

        string token = authorization.substring(7); // Remove "Bearer " prefix
        models:UserInfo? userInfo = activeSessions[token];

        if userInfo is () {
            return <http:Unauthorized>{
                body: {
                    status: "error",
                    message: "Invalid or expired token"
                }
            };
        }

        return userInfo;
    }

    // Database functions

    // This service can be used to manage products, similar to the auth service
    // For simplicity, we are not implementing product management in this example   
    // You can implement CRUD operations for products here
    // Example: resource function post createProduct(models:Product product) returns models:ProductResponse
    resource function get products() returns models:ProductResponse|error {
        mongodb:Database database = check mongoClient->getDatabase(databaseName);
        mongodb:Collection collection = check database->getCollection(collectionName_products);

        stream<models:Product, error?> productStream = check collection->find({}, {}, (), models:Product);

        models:Product[] products = check from models:Product product in productStream
            select product;

        return {products: products};
    }

    resource function get [int id]/shops() returns json|error {
        io:println("MyyyyyyyyyyyID",id);
        string mallId = "M" + id.toString();
        io:println("Hellooooooo",mallId);
        models:MallDoc? mallDocOptional = check getMallByMallId(mallId, mongoClient);
        io:println("Hiiiiiiiiiiiiiiiii",mallDocOptional);

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
                    image: s.image,
                    discount: s.discount
                };
            return {shops: shopsJson};
        }

        return {
            status: "error",
            message: "Mall not found for id " + id.toString()
        };
    }

}

function findUserByEmail(string email) returns models:User|error {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName_users);

    map<json> filter = {"email": email};
    stream<models:User, error?> userStream = check collection->find(filter, {}, (), models:User);
    models:User[] users = check from models:User user in userStream
        select user;

    if users.length() > 0 {
        return users[0];
    }

    return error("User not found");
}

function getMallByMallId(string id, mongodb:Client mongoClient) returns models:MallDoc|error {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName_shops);

    map<json> query = {"mallId": id};
    io:println("heyyyyy",query);
    stream<models:MallDoc, error?> mallStream = check collection->find(query, {}, (), models:MallDoc);

    models:MallDoc[] malls = check from models:MallDoc mall in mallStream
        select mall;

    if malls.length() > 0 {
        return malls[0];
    }

    return error("Mall not found");
}
