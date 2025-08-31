import Backend.models as models;
import Backend.utils as MongoDBUtils;

import ballerinax/mongodb;

// Set explicit collection names in Config.toml
configurable string collectionName_users = ?;
configurable string collectionName_orders = ?;
configurable string collectionName_shops = ?;

// Small helper to fetch a collection by name (keeps code tidy)
function getCollection(string collName) returns mongodb:Collection|error {
    mongodb:Database database = check MongoDBUtils:getDatabase(MongoDBUtils:databaseName);
    return check database->getCollection(collName);
}

// ================= USERS =================

public function findUserByEmail(string email) returns models:User|error {
    mongodb:Collection collection = check getCollection(collectionName_users);

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
    mongodb:Collection collection = check getCollection(collectionName_users);
    check collection->insertOne(user);
}

public function insertOrder(models:Order orderObj) returns error? {
    mongodb:Collection collection = check getCollection(collectionName_orders);
    check collection->insertOne(orderObj);
    // No insertedId is returned; just return nil on success
    return;
}

public function findOrders(map<json> filter) returns stream<models:Order, error?>|error {
    mongodb:Collection collection = check getCollection(collectionName_orders);
    return collection->find(filter, {}, (), models:Order);
}

public function findOrderByOrderId(string orderId) returns models:Order|error {
    mongodb:Collection collection = check getCollection(collectionName_orders);

    map<json> filter = {"orderId": orderId};
    stream<models:Order, error?> s = check collection->find(filter, {}, (), models:Order);
    models:Order[] arr = check from models:Order o in s
        select o;

    if arr.length() == 0 {
        return error("Order not found");
    }
    return arr[0];
}

// ================= MALLS =================

public function findMallByMallId(string mallId) returns models:MallDoc|error {
    mongodb:Collection collection = check getCollection(collectionName_shops);

    map<json> filter = {"mallId": mallId};
    stream<models:MallDoc, error?> mallStream = check collection->find(filter, {}, (), models:MallDoc);
    models:MallDoc[] malls = check from models:MallDoc mall in mallStream
        select mall;

    if malls.length() > 0 {
        return malls[0];
    }
    return error("Mall not found");
}
