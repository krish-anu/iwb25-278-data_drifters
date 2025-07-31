import ballerina/crypto;
import ballerina/time;
// import ballerina/uuid;
import Backend.models as models;

configurable string jwtSecret = ?;

public function hashPassword(string password) returns string {
    byte[] hashedBytes = crypto:hashSha256(password.toBytes());
    return hashedBytes.toBase64();
}

public function verifyPassword(string password, string hashedPassword) returns boolean {
    string hashedInput = hashPassword(password);
    return hashedInput == hashedPassword;
}

public function generateToken(models:User user) returns string {
    string data = user.email + ":" + time:utcNow()[0].toString() + ":" + jwtSecret;
    byte[] tokenBytes = crypto:hashSha256(data.toBytes());
    return tokenBytes.toBase64();
}

public function validateToken(string token, map<models:UserInfo> activeSessions) returns models:UserInfo|error {
    models:UserInfo? userInfo = activeSessions[token];
    if userInfo is () {
        return error("Invalid token");
    }
    return userInfo;
}