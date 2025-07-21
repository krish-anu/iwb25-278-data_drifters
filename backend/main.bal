import ballerina/crypto;
import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerinax/mongodb;

// Configuration
configurable string mongodbConnectionString = ?;
configurable string databaseName = ?;
configurable string collectionName = ?;
configurable string jwtSecret = ?;

// MongoDB client configuration
mongodb:ConnectionConfig mongoConfig = {
    connection: mongodbConnectionString + databaseName
};

mongodb:Client mongoClient = check new (mongoConfig);

// User types
public type User record {
    string _id?;
    string name;
    string email;
    string password;
    string createdAt?;
    string updatedAt?;
};

public type LoginRequest record {
    string email;
    string password;
};

public type LoginResponse record {
    string status;
    string message?;
    string token?;
    UserInfo user?;
};

public type UserInfo record {
    string _id;
    string name;
    string email;
};

// Session storage (in-memory for simplicity)
map<UserInfo> activeSessions = {};

// CORS configuration
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://localhost:5173"],
        allowCredentials: true,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}
service /auth on new http:Listener(9090) {

    // Login endpoint
    resource function post login(LoginRequest loginReq) returns LoginResponse|http:InternalServerError|http:BadRequest|http:Unauthorized {

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
        User|error userResult = findUserByEmail(loginReq.email);

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
        boolean isValidPassword = verifyPassword(loginReq.password, userResult.password);

        if !isValidPassword {
            return <http:Unauthorized>{
                body: {
                    status: "error",
                    message: "Invalid email or password"
                }
            };
        }

        // Generate simple token
        string token = generateToken(userResult);

        // Store session
        UserInfo userInfo = {
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
    resource function post register(User newUser) returns LoginResponse|http:InternalServerError|http:BadRequest|http:Conflict {

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
        User|error existingUser = findUserByEmail(newUser.email);

        if existingUser is User {
            return <http:Conflict>{
                body: {
                    status: "error",
                    message: "User with this email already exists"
                }
            };
        }

        // Hash password
        string hashedPassword = hashPassword(newUser.password);

        // Create user object
        // ISO 8601 string format
        string now = time:utcNow().toString();

        User userToCreate = {
            _id: uuid:createType4AsString(),
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword,
            createdAt: now,
            updatedAt: now
        };

        // Insert user into database
        error? insertResult = insertUser(userToCreate);

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
        string token = generateToken(userToCreate);

        // Store session
        UserInfo userInfo = {
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
    resource function post logout(@http:Header string? authorization) returns json {
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
    resource function get profile(@http:Header string? authorization) returns UserInfo|http:Unauthorized {
        if authorization is () {
            return <http:Unauthorized>{
                body: {
                    status: "error",
                    message: "Authorization header required"
                }
            };
        }

        string token = authorization.substring(7); // Remove "Bearer " prefix
        UserInfo? userInfo = activeSessions[token];

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
}

// Database functions
function findUserByEmail(string email) returns User|error {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName);

    map<json> filter = {"email": email};
    stream<User, error?> userStream = check collection->find(filter, {}, (), User);
    User[] users = check from User user in userStream
        select user;

    if users.length() > 0 {
        return users[0];
    }

    return error("User not found");
}

function insertUser(User user) returns error? {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName);

    check collection->insertOne(user);
}

// Password hashing functions
function hashPassword(string password) returns string {
    byte[] hashedBytes = crypto:hashSha256(password.toBytes());
    return hashedBytes.toBase64();
}

function verifyPassword(string password, string hashedPassword) returns boolean {
    string hashedInput = hashPassword(password);
    return hashedInput == hashedPassword;
}

// Simple token generation
function generateToken(User user) returns string {
    string data = user.email + ":" + time:utcNow()[0].toString() + ":" + jwtSecret;
    byte[] tokenBytes = crypto:hashSha256(data.toBytes());
    return tokenBytes.toBase64();
}

// Token validation
function validateToken(string token) returns UserInfo|error {
    UserInfo? userInfo = activeSessions[token];
    if userInfo is () {
        return error("Invalid token");
    }
    return userInfo;
}
