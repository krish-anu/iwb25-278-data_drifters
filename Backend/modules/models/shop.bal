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

public type MallDoc record {
    string mallId;
    Shop[] shops;
};
