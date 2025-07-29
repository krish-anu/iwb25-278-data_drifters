public type Product record {|
    string id;
    string name;
    string category;
    float price;
    int quantity;
    string description?;
    string imageUrl?;
|};

public type ProductResponse record {|
    Product[] products;
|};
