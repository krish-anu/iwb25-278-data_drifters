
public type Product record {|
    string id;
    string productName;
    string category;
    float price;
    int stockQuantity;
    string description?;
    string imageUrl?;
    string status?;
    string store?;
|};




public type ProductResponse record {|
    Product[] products;
|};

