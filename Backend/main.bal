
import Backend.db as db;
import Backend.models as models;
import Backend.utils as Utils;
import ballerinax/azure_storage_service.blobs as azure_blobs;
import ballerina/io;
import ballerina/http;
// import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerinax/mongodb;
// import ballerina/mime;
// import ballerina/jballerina.java;


// Configuration
configurable string mongodbConnectionString = ?;
configurable string databaseName = ?;
configurable string collectionName_users = ?;
configurable string collectionName_products = ?;
configurable string collectionName_shops = ?;
configurable string collectionName_images = ?;
configurable string STORAGE_ACCOUNT_NAME = ?;
configurable string CONTAINER_NAME = ?;
configurable string BLOB_ACCESS_KEY = ?;
configurable string collectionName_orders = ?;
configurable string collectionName_customers = ?;

// MongoDB client configuration
mongodb:ConnectionConfig mongoConfig = {
    connection: mongodbConnectionString + databaseName
};
mongodb:Client mongoClient = check new (mongoConfig);

// Session storage (in-memory for simplicity)
map<models:UserInfo> activeSessions = {};




// Define roles
const string ROLE_ADMIN = "admin";
const string ROLE_SELLER = "seller";
const string ROLE_CUSTOMER = "customer";

// Loose document type for flexible parsing
type LooseDoc record {|
    json...;
|};

// Loose document type for flexible parsing


// Initialize Azure Blob Storage client
azure_blobs:ConnectionConfig blobConfig = {
    accountName: STORAGE_ACCOUNT_NAME,
    accessKeyOrSAS: BLOB_ACCESS_KEY,
    authorizationMethod: "accessKey"
};
azure_blobs:BlobClient blobClient = check new(blobConfig);
// A record type to represent the structure of image documents in MongoDB
public type ImageMetadata record {|
    
    string fileName;
    string imageUrl;
    string uploadedAt;
|};
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
    // Handle CORS preflight requests
    resource function options .(http:Caller caller, http:Request req) returns error? {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Max-Age", "86400");
        check caller->respond(response);
    }
    
    // Endpoint to upload an image
   // Upload image
//     resource function post images/upload(http:Caller caller, http:Request req) returns error? {
//         mime:Entity[] bodyParts = check req.getBodyParts();
//         string fileName = uuid:createType1AsString() + ".jpg";
//         byte[] imageData = [];

//         // Extract image from multipart/form-data
//         foreach mime:Entity part in bodyParts {
//             string contentType = part.getContentType();
//             if contentType.startsWith("image/") {
//                 imageData = check part.getByteArray();
//                 break;
//             }
//         }

//         if imageData.length() == 0 {
//             check caller->respond(<http:BadRequest>{body: {
//                 status: "error",
//                 message: "No image found in request"
//             }});
//             return;
//         }

//         // Headers for BlockBlob upload


// map<string> headers = {
//     "x-ms-blob-type": "BlockBlob",
//     "Content-Type": "image/jpeg",
//     "x-ms-meta-uploadedBy": "ballerina-service"
// };

// // Convert map to JSON string
// json headerJson = headers.toJson();
// string headerString = headerJson.toJsonString();

// // Convert string to byte[]
// byte[] headerBytes = headerString.toBytes();

//         // Upload to Azure Blob
        
//         azure_blobs:ResponseHeaders|azure_blobs:Error uploadResult =
//             blobClient->putBlob(CONTAINER_NAME, fileName, "BlockBlob", headerBytes);

//         if uploadResult is azure_blobs:Error {
//             io:println("❌ Failed to upload image: ", uploadResult.message());
//             check caller->respond(<http:InternalServerError>{body: {
//                 status: "error",
//                 message: "Failed to upload image: " + uploadResult.message()
//             }});
//             return;
//         }

//         // Construct SAS URL
//         string baseUrl = string `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${fileName}`;
//         string sasUrl = baseUrl + BLOB_SAS_TOKEN;
//         // Store metadata in MongoDB
//       mongodb:Database database = check mongoClient->getDatabase(databaseName);
// mongodb:Collection collection = check database->getCollection(collectionName_images);

// map<json> imageDoc = {
//     _id: uuid:createType4AsString(),
//     fileName: fileName,
//     sasUrl: sasUrl,
//     createdAt: time:utcNow().toString()
// };

// error? insertResult = collection->insertOne(imageDoc);
// if insertResult is error {
//     io:println("Failed to insert image metadata: ", insertResult.message());
// }


//         if insertResult is error {
//             io:println("⚠️ Failed to store image metadata: ", insertResult.message());
//         }

//         // Return response
//         json response = {
//             status: "success",
//             message: "Image uploaded successfully",
//             url: sasUrl
//         };
//         check caller->respond(response);
//     }

//     // Get image SAS URL by fileName
//     resource function get [string fileName](http:Caller caller) returns error? {
//         // Query MongoDB for the file metadata
// // Get database
// mongodb:Database database = check mongoClient->getDatabase(databaseName);

// // Get collection
// mongodb:Collection collection = check database->getCollection(collectionName_images);

// // Query using find()
// map<json> filter = { "fileName": fileName };
// // Get collection

// // Query filter

// // Use map<anydata> as target type
// // Query MongoDB for the file metadata
// stream<json, error?> resultsStream = check collection->find(filter, {}, (), json);

// // Collect results into an array
// json[] results = check from var doc in resultsStream select doc;
//         if results.length() == 0 {
//             check caller->respond(<http:NotFound>{body: {
//                 status: "error",
//                 message: "Image not found"
//             }});
//             return;
//         }

//         string sasUrl = results[0]["sasUrl"].toString();

//         // Return SAS URL to client
//
        //  json response = {
//             status: "success",
//             url: sasUrl
//         };
//         check caller->respond(response);
//     }

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

        // Block unapproved admins
        if userResult.role == ROLE_ADMIN && !(userResult.accepted ?: false) {
            return errorResponse(403, "Admin account pending approval by Super Admin");
        }

        string token = Utils:generateToken(userResult);

      models:UserInfo userInfo = {
    _id: userResult?._id ?: "",
    name: userResult.name,          // no fallback needed
    email: userResult.email,        // no fallback needed
    role: userResult?.role ?: ROLE_CUSTOMER,
    accepted: userResult?.accepted ?: true
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
            role: newUser.role ?: ROLE_CUSTOMER,
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
            _id: "",
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

        mongodb:UpdateResult|error response = approveAdmin(userId);
        io:println("response", response);

        if response is error {
            io:println("Approve admin error: ", response.message());
            return <http:InternalServerError>{
                body: {status: "error", message: response.message()}
            };
        }
        if response.matchedCount == 0 {
            return <http:InternalServerError>{
                body: {status: "error", message: "No admin found with that ID"}
            };
        }
        return <http:Ok>{
            body: { status: "success", message: "Admin approved successfully" }
        };
    }
  

    // ================= PENDING ADMINS =================
    resource function get users/pendingAdmins(@http:Header string? authorization)
        returns json|http:Unauthorized|http:Forbidden|http:InternalServerError|error {


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






    // ================= ADMIN APPROVAL =================
    // resource function put admin/approve/[string userId](@http:Header string? authorization)
    //         returns http:Ok|http:InternalServerError|http:Unauthorized|http:Forbidden {
    //     // Uncomment and implement authorization if needed
    //     // models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
    //     // if userOrUnauthorized is http:Unauthorized {
    //     //     return userOrUnauthorized;
    //     // }
    //     // models:UserInfo currentUser = <models:UserInfo>userOrUnauthorized;
    //     // if currentUser.role != "super_admin" {
    //     //     return <http:Forbidden>{ body: { status: "error", message: "Access denied: Super Admin only" } };
    //     // }

    //     mongodb:UpdateResult|error response = approveAdmin(userId);
    //     io:println("response", response);

    //     if response is error {
    //         io:println("Approve admin error: ", response.message());
    //         return <http:InternalServerError>{
    //             body: { status: "error", message: response.message() }
    //         };
    //     }
    //     if response.matchedCount == 0 {
    //         return <http:InternalServerError>{
    //             body: { status: "error", message: "No admin found with that ID" }
    //         };
    //     }
    //     return <http:Ok>{
    //         body: { status: "success", message: "Admin approved successfully" }
    //     };
    // }

    // ================= PENDING ADMINS =================
    // resource function get users/pendingAdmins(@http:Header string? authorization)
    //         returns json|http:Unauthorized|http:Forbidden|http:InternalServerError|error {
    //     // models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
    //     // if userOrUnauthorized is http:Unauthorized {
    //     //     return userOrUnauthorized;
    //     // }

    //     // models:UserInfo currentUser = <models:UserInfo>userOrUnauthorized;
    //     // if currentUser.role != "super_admin" {
    //     //     return <http:Forbidden>{ body: { status: "error", message: "Access denied" } };
    //     // }

    //     mongodb:Database|error dbResult = mongoClient->getDatabase(databaseName);
    //     if dbResult is error {
    //         return <http:InternalServerError>{ body: { status: "error", message: "Database error" } };
    //     }
    //     mongodb:Database database = dbResult;

    //     mongodb:Collection|error colResult = database->getCollection(collectionName_users);
    //     if colResult is error {
    //         return <http:InternalServerError>{ body: { status: "error", message: "Collection error" } };
    //     }
    //     mongodb:Collection collection = colResult;

    //     map<json> filter = { "role": "admin", "accepted": false };
    //     stream<models:User, error?> userStream = check collection->find(filter, {}, (), models:User);

    //     models:User[] users = check from models:User u in userStream select u;

    //     json[] usersJson = from models:User u in users
    //                        select {
    //                            _id: u._id,
    //                            name: u.name,
    //                            email: u.email,
    //                            role: u.role,
    //                            accepted: u.accepted,
    //                            createdAt: u.createdAt,
    //                            updatedAt: u.updatedAt
    //                        };

    //     return <json>{ users: usersJson };
    // }

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

        mongodb:Database database = check mongoClient->getDatabase(databaseName);
        mongodb:Collection collection = check database->getCollection(collectionName_products);

        stream<models:Product, error?> productStream = check collection->find({}, {}, (), models:Product);
        models:Product[] products = check from models:Product product in productStream select product;

        return {products: products};
    }

    // ================= SHOP PRODUCTS =================
    resource function get [string shopId]/products() returns json|http:NotFound|http:InternalServerError|error {
        mongodb:Database database = check mongoClient->getDatabase(databaseName);
        mongodb:Collection mallCollection = check database->getCollection(collectionName_shops);

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

        stream<json, error?> results = check mallCollection->aggregate(pipeline, json);
        json[] documents = check from var doc in results select doc;

        if documents.length() == 0 {
            return <http:NotFound>{
                body: { status: "error", message: "Shop not found: " + shopId }
            };
        }

        map<json> firstDoc = <map<json>>documents[0];
        return <json>{
            shopId: firstDoc["shopId"],
            shopName: firstDoc["shopName"],
            mallId: firstDoc["mallId"],
            mallName: firstDoc["mallName"],
            products: firstDoc["products"]
        };
    }
// This resource function handles POST requests to upload an image.
    // The request should be a POST to http://localhost:8080/storage/upload?fileName=myimage.jpg
    resource function post storage/upload(@http:Payload byte[] payload, string fileName) returns http:Created|error {
         mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName_images);

        // Step 1: Upload the image to Azure Blob Storage.
        io:println("Starting upload to Azure Blob Storage...");
        var uploadResult = blobClient->putBlob(CONTAINER_NAME, fileName, "BlockBlob", payload);
        if uploadResult is error {
            io:println("Failed to upload file to Azure Blob Storage: " + uploadResult.message());
            return error("Failed to upload file to Azure Blob Storage: " + uploadResult.message());
        }

        // Step 2: Construct the public URL of the uploaded image.
        // The URL format is: https://<storageAccountName>.blob.core.windows.net/<containerName>/<fileName>
        string imageUrl = string `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${fileName}`;
        io:println("Image uploaded successfully. URL: " + imageUrl);

        // Step 3: Create a document to store in MongoDB.
        map<json> imageDocument = {
    "fileName": fileName,
    "imageUrl": imageUrl,
    "uploadedAt": time:utcNow().toString()
};
        // Step 4: Insert the document into the MongoDB collection.
        io:println("Inserting document into MongoDB...");
        mongodb:Error? insertError = collection->insertOne(imageDocument);
        if insertError is error {
            io:println("Failed to insert document into MongoDB: " + insertError.message());
            // You might want to handle this failure differently, e.g., by deleting the uploaded blob.
            return error("Failed to insert document into MongoDB: " + insertError.message());
        }

        io:println("Document inserted successfully.");
        // Step 5: Return a success response.
        return http:CREATED;
    }

    // This resource function handles GET requests to retrieve image URLs from MongoDB.
    // The request can be a GET to http://localhost:8080/storage/images
resource function get images() returns json[]|error {
        io:println("Retrieving all image URLs from MongoDB...");
        mongodb:Database database = check mongoClient->getDatabase(databaseName);
        mongodb:Collection collection = check database->getCollection(collectionName_images);

        // Corrected 'find' method call
        stream<ImageMetadata, error?> streamResult = check collection->find({}, {}, (), ImageMetadata);

        json[] imageUrls = [];
        // Iterate through the stream of documents.
        check from var doc in streamResult
            do {
                imageUrls.push(doc.imageUrl);
            };

        if imageUrls.length() == 0 {
            return error("No image URLs found.");
        }

        return imageUrls;
    }
    // ================= ORDERS =================
    resource function post orders(@http:Header string? authorization, @http:Payload models:Order incoming)
            returns models:OrderCreateResponse|http:Unauthorized|http:BadRequest|http:InternalServerError {
        models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
        if userOrUnauthorized is http:Unauthorized {
            return userOrUnauthorized;
        }
        models:UserInfo user = <models:UserInfo>userOrUnauthorized;

        if incoming.shopId.trim() == "" || incoming.mallId.trim() == "" {
            return <http:BadRequest>{body: {status: "error", message: "Shop ID and Mall ID are required"}};
        }

        if incoming.items.length() == 0 {
            return <http:BadRequest>{body: {status: "error", message: "Order must contain at least one item"}};
        }

        foreach models:OrderItem item in incoming.items {
            if item.productId.trim() == "" || item.quantity <= 0 || item.price <= 0.0 {
                return <http:BadRequest>{body: {status: "error", message: "Invalid order item: productId, quantity, and price must be valid"}};
            }
        }

        string orderId = uuid:createType4AsString();
        string currentDate = time:utcNow().toString();

        float totalPrice = 0.0;
        foreach models:OrderItem item in incoming.items {
            float lineTotal = item.price * <float>item.quantity;
            item.lineTotal = lineTotal;
            totalPrice += lineTotal;
        }

        models:Order orderToInsert = {
            // _id: (),
            orderId: orderId,
            shopId: incoming.shopId,
            mallId: incoming.mallId,
            customerName: user.name,
            date: currentDate,
            items: incoming.items,
            totalPrice: totalPrice
        };

        error? insertResult = db:insertOrder(orderToInsert);
        if insertResult is error {
            return <http:InternalServerError>{body: {status: "error", message: "Failed to create order"}};
        }

        return {
            status: "success",
            orderId: orderId,
            insertedId: orderId
        };
    }

    // List orders
    resource function get orders(@http:Header string? authorization, string? shopId, string? mallId)
            returns json|http:Unauthorized|http:InternalServerError {
        return {status: "error", message: "Not implemented"};
    }

    // ================= CHANGE PASSWORD =================
    resource function post admin/changePassword(models:ChangePasswordRequest req, @http:Header string? authorization)
            returns http:Unauthorized|map<json>|models:LoginResponse|http:InternalServerError|http:BadRequest|http:Conflict|http:Forbidden|error {
        models:UserInfo|http:Unauthorized userOrUnauthorized = getUserFromAuthHeader(authorization);
        if userOrUnauthorized is http:Unauthorized {
            return userOrUnauthorized;
        }

        models:UserInfo user = <models:UserInfo>userOrUnauthorized;

        if req.newPassword != req.confirmPassword {
            return errorResponse(400, "New passwords do not match");
        }

        models:User|error dbUser = findUserByEmail(user.email);
        if dbUser is error {
            return errorResponse(500, "Error fetching user data");
        }
        string hashedCurrent = Utils:hashPassword(req.currentPassword);
        if dbUser.password != hashedCurrent {
            return errorResponse(401, "Current password is incorrect");
        }

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
        models:User|error user = findUserByEmail(userInfo.email);
        if user is error {
            return { status: "error", message: "User not found" };
        }

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

    string mallId = id.startsWith("M") ? id : "M" + id;
    io:println("Searching mallId: ", mallId);

    map<json> query = { "mallId": mallId };
    stream<models:MallDoc, error?> mallStream = check collection->find(query, {}, (), models:MallDoc);
    models:MallDoc[] malls = check from models:MallDoc mall in mallStream select mall;

    if malls.length() > 0 {
        return malls[0];
    }
    return error("Mall not found");

}


function getUserFromAuthHeader(string? authorization)
        returns models:UserInfo|http:Unauthorized {
    if authorization is () {
        return <http:Unauthorized>{body: {status: "error", message: "Authorization header required"}};
    }

    string token = authorization.substring(7);
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

    return {
        status: "error",
        message: msg
    };
}

function approveAdmin(string userId) returns mongodb:UpdateResult|error {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName_users);

    map<json> filter = { "_id": userId };
    mongodb:Update updateDoc = { set: { "accepted": true } };
    mongodb:UpdateOptions options = { upsert: false };
    mongodb:UpdateResult|error response = collection->updateOne(filter, updateDoc, options);

    if response is error {
        io:println("Update error: ", response.message());
        return error(response.message());
    }

    return response;
}

function makeSafeFileName(string shopId, string productName) returns string {
    string name = shopId.toLowerAscii() + "-" + productName.toLowerAscii();
    string temp = "";
    foreach int i in 0 ..< name.length() {
        string c = name.substring(i, i + 1);
        if (c == " ") {
            temp += "-";
        } else {
            temp += c;
        }
    }
    name = temp;

    string safeName = "";
    foreach int i in 0 ..< name.length() {
        string c = name.substring(i, i + 1);
        boolean isValid = false;
        if (c >= "a" && c <= "z") {
            isValid = true;
        } else if (c >= "0" && c <= "9") {
            isValid = true;
        } else if (c == "-") {
            isValid = true;
        }
        if (isValid) {
            safeName += c;
        }
    }

    [int, decimal] now = time:utcNow();
    int ts = now[0];
    safeName += "-" + ts.toString() + ".jpg";

    return safeName;
}
function stringsReplace(string s, string old, string newStr) returns string {
    string result = "";
    int i = 0;
    while i < s.length() {
        if (s.substring(i, i + old.length()) == old) {
            result += newStr;
            i += old.length();
        } else {
            result += s.substring(i, i + 1);
            i += 1;
        }
    }
    return result;
}
public function insertImageMetadata(map<json> imageDoc, mongodb:Client mongoClient) returns error? {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName_images);

    var result = collection->insertOne(imageDoc);
    if result is error {
        return result;
    }
    return;
}
