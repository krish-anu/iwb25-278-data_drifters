import ballerinax/mongodb;

configurable string mongodbConnectionString = ?;
public configurable string databaseName = ?;


mongodb:Client mongoClient;
function init() returns error? {
    mongodb:ConnectionConfig mongoConfig = {
        connection: mongodbConnectionString + databaseName
    };
    mongoClient = check new (mongoConfig);
    return;
}

public function getDatabase(string dbName) returns mongodb:Database|error {
    return check mongoClient->getDatabase(dbName);
}
public function getMongoClient() returns mongodb:Client {
    return mongoClient;
}

public function closeMongoConnection() returns error? {
    return mongoClient->close();
}
