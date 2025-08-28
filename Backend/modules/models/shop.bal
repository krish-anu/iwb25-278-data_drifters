// Define the product and shop records


public type Shop record {
    string id;
    string? name;
    string? address;
    string? ownerId;
    string? ownerName;
    string? contactNumber;
    string? email;
    string? category;
    decimal? rating;
    int? reviewCount;
    string? imageUrl;
    int? discount;
    Product[] products; // 🚨 Add this field to the Shop record
};

// Define the MallDoc record to match your MongoDB collection
public type MallDoc record {
    string mallId;
    string mallName;
    string address;
    Shop[] shops; // This array will contain the Shop records
};