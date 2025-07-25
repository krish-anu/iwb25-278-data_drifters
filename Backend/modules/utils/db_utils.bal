import ballerinax/mongodb;
// import ballerina/log;
import ecommerce/Backend.models as models;

configurable string mongodbConnectionString = ?;
configurable string databaseName = ?;
configurable string collectionName = ?;

mongodb:ConnectionConfig mongoConfig = {
    connection: mongodbConnectionString + databaseName
};

mongodb:Client mongoClient = check new (mongoConfig);

public function findUserByEmail(string email) returns models:User|error {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName);

    map<json> filter = {"email": email};
    stream<models:User, error?> userStream = check collection->find(filter, {}, (), models:User);
    models:User[] users = check from models:User user in userStream
        select user;

    if users.length() > 0 {
        return users[0];
    }

    return error("User not found");
}

public function insertUser(models:User user) returns error? {
    mongodb:Database database = check mongoClient->getDatabase(databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName);

    check collection->insertOne(user);
}