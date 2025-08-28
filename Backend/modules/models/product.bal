

public type ProductResponse record {|
    Product[] products;
|};
public type Product record {
    string id;
    string? name;
    string? category;
    string? description;
    string? price;
    string? stockQuantity;
    string? status;
    string? imageUrl;
};
