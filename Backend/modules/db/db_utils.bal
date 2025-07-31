import ballerinax/mongodb;
import Backend.utils as MongoDBUtils;
import Backend.models as models;

configurable string collectionName = ?;


public function findUserByEmail(string email) returns models:User|error {
    mongodb:Database database = check MongoDBUtils:getDatabase(MongoDBUtils:databaseName);
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
    mongodb:Database database = check MongoDBUtils:getDatabase(MongoDBUtils:databaseName);
    mongodb:Collection collection = check database->getCollection(collectionName);

    check collection->insertOne(user);
}

