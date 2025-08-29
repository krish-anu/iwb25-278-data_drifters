// Define the product and shop records


public type Shop record {
    string id;

    string name;
    string address;
    string ownerName;
    string contactNumber;
    string description;
    Product[] products;
    string email;
    string category?;
    float rating?;
    int reviewCount?;
    string image?;
    int discount?;

};

// Define the MallDoc record to match your MongoDB collection
public type MallDoc record {
    string mallId;
    string mallName;
    string address;
    Shop[] shops; // This array will contain the Shop records
};