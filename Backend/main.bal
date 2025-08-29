// ... existing imports
import Backend.db as db;
import Backend.models as models;
import Backend.utils as Utils;
import ballerina/io;
import ballerina/http;
// import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerinax/mongodb;
// import ballerinax/bson;
// import ballerina/crypto;



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


// User types
// Session storage (in-memory for simplicity)
map<models:UserInfo> activeSessions = {};



// Define roles
const string ROLE_ADMIN = "admin";
const string ROLE_SELLER = "seller";
const string ROLE_CUSTOMER = "customer";

// CORS configuration

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080", "http://localhost:8082"],
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

        // 🚨 Block unapproved admins
        if userResult.role == ROLE_ADMIN && !(userResult.accepted ?: false) {
            return errorResponse(403, "Admin account pending approval by Super Admin");
        }

        string token = Utils:generateToken(userResult);

        models:UserInfo userInfo = {
            _id: userResult._id ?: "",
            name: userResult.name,
            email: userResult.email,
            role: userResult.role ?: ROLE_CUSTOMER,
            accepted: userResult.accepted ?: true
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
            returns models:LoginResponse|http:InternalServerError|http:BadRequest|http:Conflict|http:Unauthorized|http:Forbidden {

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
            accepted: (newUser.role == ROLE_ADMIN) ? false : true,
            createdAt: now,
            updatedAt: now
        };

        // io:println("userToCreate",userToCreate);
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
        return {status: "success", message: "Logged out successfully"};
    }


   

    // Get user profile (protected route)
    

    // ================= ADMIN APPROVAL =================
    



    resource function put admin/approve/[string userId](@http:Header string? authorization)
            returns http:Ok|http:InternalServerError|http:Unauthorized|http:Forbidden {
        // Uncomment and implement authorization if needed
        // models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
        // if userOrUnauthorized is http:Unauthorized {
        //     return userOrUnauthorized;
        // }
        // models:UserInfo currentUser = <models:UserInfo>userOrUnauthorized;
        // if currentUser.role != "super_admin" {
        //     return <http:Forbidden>{ body: { status: "error", message: "Access denied: Super Admin only" } };
        // }

        mongodb:UpdateResult|error response = approveAdmin(userId);
        io:println("response", response);

        if response is error {
            io:println("Approve admin error: ", response.message());
            return <http:InternalServerError>{
                body: { status: "error", message: response.message() }
            };
        }
        if response.matchedCount == 0 {
            return <http:InternalServerError>{
                body: { status: "error", message: "No admin found with that ID" }
            };
        }
        return <http:Ok>{
            body: { status: "success", message: "Admin approved successfully" }
        };
    }
  

    // ... (keep existing resources: pendingAdmins, profile, products, shops unchanged)


// ================= HELPER FUNCTIONS =================
// .


    // This service can be used to manage products, similar to the auth service
    // For simplicity, we are not implementing product management in this example
    // You can implement CRUD operations for products here
    // Example: resource function post createProduct(models:Product product) returns models:ProductResponse
    // (Removed duplicate products function - using the authorized one below)

    // ... (keep existing resources: pendingAdmins, profile, products, shops unchanged)


// ================= HELPER FUNCTIONS =================
// .


    

    resource function get users/pendingAdmins(@http:Header string? authorization)
        returns json|http:Unauthorized|http:Forbidden|http:InternalServerError|error {

    // models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
    // if userOrUnauthorized is http:Unauthorized {
    //     return userOrUnauthorized;
    // }

    // models:UserInfo currentUser = <models:UserInfo>userOrUnauthorized;
    // if currentUser.role != "super_admin" {
    //     return <http:Forbidden>{ body: { status: "error", message: "Access denied" } };
    // }

        mongodb:Database|error dbResult = mongoClient->getDatabase(databaseName);
        if dbResult is error {
            return <http:InternalServerError>{ body: { status: "error", message: "Database error" } };
        }
        mongodb:Database database = dbResult;

        mongodb:Collection|error colResult = database->getCollection(collectionName_users);
        if colResult is error {
            return <http:InternalServerError>{ body: { status: "error", message: "Collection error" } };
        }
        mongodb:Collection collection = colResult;

        map<json> filter = { "role": "admin", "accepted": false };
        stream<models:User, error?> userStream = check collection->find(filter, {}, (), models:User);

        models:User[] users = check from models:User u in userStream select u;

        // Convert User[] to json[]
        json[] usersJson = from models:User u in users
                        select {
                            _id: u._id,
                            name: u.name,
                            email: u.email,
                            role: u.role,
                            accepted: u.accepted,
                            createdAt: u.createdAt,
                            updatedAt: u.updatedAt
                        };

        return <json>{ users: usersJson };
    }




    // ================= PROFILE =================
    // (Removed duplicate auth/profile function - using the original one above)


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
        // error? err = ();
        // Get database connection
        database = check mongoClient->getDatabase(databaseName);



        mongodb:Collection collection = check database->getCollection(collectionName_products);


        stream<models:Product, error?> productStream = check collection->find({}, {}, (), models:Product);

        models:Product[] products = check from models:Product product in productStream
            select product;

        return {products: products};
    }








    // ================= PROFILE =================
    resource function get auth/profile(@http:Header string? authorization)
        returns models:UserInfo|models:LoginResponse|http:InternalServerError|http:BadRequest|http:Conflict|http:Unauthorized|http:Forbidden {

        var result = getUserFromAuthHeader(authorization);
        return result;
        }


        // ================= PRODUCTS (Admin & Seller only) =================
        // ...
        resource function get [string shopId]/products() returns json|http:NotFound|http:InternalServerError|error {

        // Connect to database and collection
            mongodb:Database database = check mongoClient->getDatabase(databaseName);
            mongodb:Collection mallCollection = check database->getCollection(collectionName_shops);

        // Aggregation pipeline
            map<json>[] pipeline = [
                { "$match": { "shops.id": shopId } },
                { "$unwind": "$shops" },
                { "$match": { "shops.id": shopId } },
                {
                    "$project": {
                    "_id": 0,
                    "products": "$shops.products",
                    "shopId": "$shops.id",
                    "shopName": "$shops.name",
                    "mallId": "$mallId",
                    "mallName": "$mallName"
                    }
                }
        ];

        // Run aggregation
            stream<json, error?> results = check mallCollection->aggregate(pipeline, json);
        // Convert stream to array
        // Convert stream to array
            json[] documents = check from var doc in results select doc;

        // Check if we got any documents
            if documents.length() == 0 {
                return <http:NotFound>{
                    body: { status: "error", message: "Shop not found: " + shopId }
                };
            }

        // Cast the first document to map<json> to access its fields
        map<json> firstDoc = <map<json>>documents[0];

        // Return products
        return <json>{
            shopId: firstDoc["shopId"],
            shopName: firstDoc["shopName"],
            mallId: firstDoc["mallId"],
            mallName: firstDoc["mallName"],
            products: firstDoc["products"]
        };
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
            return {shops: shopsJson};
        }

        return {
            status: "error",
            message: "Mall not found for id " + id.toString()
        };
    }



    // ================= ORDERS =================

    //Create a new order
    resource function post orders(@http:Header string? authorization, @http:Payload models:Order incoming)
            returns models:OrderCreateResponse|http:Unauthorized|http:BadRequest|http:InternalServerError {

        // 1. Authentication
        models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
        if userOrUnauthorized is http:Unauthorized {
            return userOrUnauthorized;
        }
        models:UserInfo user = <models:UserInfo>userOrUnauthorized;

        // 2. Input validation
        if incoming.shopId.trim() == "" || incoming.mallId.trim() == "" {
            return <http:BadRequest>{body: {status: "error", message: "Shop ID and Mall ID are required"}};
        }

        if incoming.items.length() == 0 {
            return <http:BadRequest>{body: {status: "error", message: "Order must contain at least one item"}};
        }

        // 3. Validate order items
        foreach models:OrderItem item in incoming.items {
            if item.productId.trim() == "" || item.quantity <= 0 || item.price <= 0.0 {
                return <http:BadRequest>{body: {status: "error", message: "Invalid order item: productId, quantity, and price must be valid"}};
            }
        }

        // 4. Generate order ID and set metadata
        string orderId = uuid:createType4AsString();
        string currentDate = time:utcNow().toString();

        // 5. Calculate totals
        float totalPrice = 0.0;
        foreach models:OrderItem item in incoming.items {
            float lineTotal = item.price * <float>item.quantity;
            item.lineTotal = lineTotal;
            totalPrice += lineTotal;
        }


        // 6. Create complete order object
        models:Order orderToInsert = {
            _id: (), // Will be auto-generated by MongoDB
            orderId: orderId,
            shopId: incoming.shopId,
            mallId: incoming.mallId,
            customerName: user.name,
            date: currentDate,
            items: incoming.items,
            totalPrice: totalPrice
        };

        // 7. Insert order
        error? insertResult = db:insertOrder(orderToInsert);
        if insertResult is error {
            return <http:InternalServerError>{body: {status: "error", message: "Failed to create order"}};
        }

        // 8. Return success response
        return {
            status: "success",
            orderId: orderId,
            insertedId: orderId // Using orderId as insertedId for consistency
        };
    }

    // List orders
    resource function get orders(@http:Header string? authorization, string? shopId, string? mallId)
            returns json|http:Unauthorized|http:InternalServerError {
        // Will build a filter and query orders from Mongo
    }

    // Get one order by ID
    // resource function get orders/[string orderId](@http:Header string? authorization)
    //         returns json|http:Unauthorized|http:NotFound|http:InternalServerError {
    //     // Will return  one order by orderId
    // }


       
    //     return { status: "error", message: "Mall not found for id " + id.toString() };
    // }



    // ================= CHANGE PASSWORD =================

    resource function post admin/changePassword(models:ChangePasswordRequest req, @http:Header string? authorization)
            returns http:Unauthorized|map<json>|models:LoginResponse|http:InternalServerError|http:BadRequest|http:Conflict|http:Unauthorized|http:Forbidden|error {

        // 1. Extract user from Authorization header
        models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
        if userOrUnauthorized is http:Unauthorized {
            return userOrUnauthorized;
        }

        models:UserInfo user = <models:UserInfo>userOrUnauthorized;

        // 2. Validate new password match
        if req.newPassword != req.confirmPassword {
            return errorResponse(400, "New passwords do not match");
        }

        // 4. Verify current password
        models:User|error dbUser = findUserByEmail(user.email);
        if dbUser is error {
            return errorResponse(500, "Error fetching user data");
        }
        string hashedCurrent = Utils:hashPassword(req.currentPassword);
        if dbUser.password != hashedCurrent {
            return errorResponse(401, "Current password is incorrect");
        }

        // 5. Hash and update with new password
        string hashedNew = Utils:hashPassword(req.newPassword);

        mongodb:Database database = check mongoClient->getDatabase(databaseName);
        mongodb:Collection collection = check database->getCollection(collectionName_users);

        _ = check collection->updateOne({ "email": user.email }, 
                                    { set: { "password": hashedNew } });

        return <map<json>>{ status: "success", message: "Password updated successfully" };

    }


    // ================= OBTAINING PROFILE =================

    resource function get admin/profile(@http:Header string? authorization) 
            returns json|http:Unauthorized|error {

        models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
        if userOrUnauthorized is http:Unauthorized {
            return userOrUnauthorized;
        }

        models:UserInfo userInfo = <models:UserInfo>userOrUnauthorized;

        // 2. Find user in DB by email
        models:User|error user = findUserByEmail(userInfo.email);
        if user is error {
            return { status: "error", message: "User not found" };
        }

        // 3. Return only the fields you want (e.g., name, email, role)
        return {
            status: "success",
            name: user.name,
            email: user.email,
            role: user.role
        };
    }


}

// ================= HELPER FUNCTIONS =================
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

    // Ensure mallId is correct
    string mallId = id.startsWith("M") ? id : "M" + id;
    io:println("Searching mallId: ", mallId);

    map<json> query = { "mallId": mallId };

    // Use typedesc safely
    stream<models:MallDoc, error?> mallStream = check collection->find(query, {}, (), models:MallDoc);
    io:println("Malls found: ", mallStream);

    models:MallDoc[] malls = check from models:MallDoc mall in mallStream
        select mall;

    if malls.length() > 0 {
        return malls[0];
    }
    return error("Mall not found");
}


// ================= AUTH HELPERS =================
function getUserFromAuthHeader(string? authorization)
    returns models:UserInfo|http:Unauthorized {

    if authorization is () {
        return <http:Unauthorized>{body: {status: "error", message: "Authorization header required"}};
    }

    string token = authorization.substring(7);

    // Check for mock token (for testing purposes)
    if token == "mock-jwt-token-for-testing" {
        return {
            _id: "mock-user-id",
            name: "Test User",
            email: "test@example.com",
            role: "customer"
        };
    }

    models:UserInfo? userInfo = activeSessions[token];

    if userInfo is () {
        return <http:Unauthorized>{body: {status: "error", message: "Invalid or expired token"}};
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

    json res = {status: "error", message: msg};

    if statusCode == 400 {
        return <http:BadRequest>{body: res};
    } else if statusCode == 401 {
        return <http:Unauthorized>{body: res};
    } else if statusCode == 403 {
        return <http:Forbidden>{body: res};
    } else if statusCode == 409 {
        return <http:Conflict>{body: res};
    } else if statusCode == 500 {
        return <http:InternalServerError>{body: res};
    }

    // fallback to LoginResponse
    return {
        status: "error",
        message: msg
    };
}






function approveAdmin(string userId) returns mongodb:UpdateResult|error {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName_users);

    map<json> filter = { "_id": userId };

    // Use Unicode escape for "$set"
    mongodb:Update updateDoc = { set: { "accepted": true } };

    mongodb:UpdateOptions options = { upsert: false };
    mongodb:UpdateResult|error response = collection->updateOne(filter, updateDoc, options);

    if response is error {
        io:println("Update error: ", response.message());
        return error(response.message());
    }

    return response;

}




