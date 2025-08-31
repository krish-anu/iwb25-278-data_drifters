public type OrderItem record {|
    string productId;
    int quantity;
    float price;
    float lineTotal?;
|};

public type Order record {|
    string orderId?;
    string shopId;
    string mallId;
    string customerName?;
    string date?;
    OrderItem[] items;
    float totalPrice?;
    string status?;
|};

public type OrderCreateResponse record {|
    string status;
    string orderId;
    string insertedId?;
|};
