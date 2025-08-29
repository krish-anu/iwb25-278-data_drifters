
public type Product record {|
    string id;
    string name;
    string category;
    float price;
    int quantity;
    string description?;
    string imageUrl?;
    string status?;
|};




public type ProductResponse record {|
    Product[] products;
|};

