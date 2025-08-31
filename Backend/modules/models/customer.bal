public type PreferredStore record {
    string shopId;
    string shopName;
};

public type CustomerOrder record {
    string orderId;
    string totalAmount;
    string status;
    string storeName;
    int itemCount;
};

public type Customer record {
    string customerId;
    string name;
    string email;
    string phone;
    string address;
    int totalOrders;
    float totalSpent;
    float averageOrderValue;
    string lastOrderDate;
    string status;
    PreferredStore[] preferredStores;
    CustomerOrder[] orders;
};