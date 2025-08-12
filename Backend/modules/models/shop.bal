public type Shop record {
    string id;
    string name;
    string address;
    string ownerName;
    string contactNumber;
    string email;
    string category?;
    float rating?;
    int reviewCount?;
    string imageUrl?;
    int discount?;
};


public type MallDoc record {
    string mallId;
    Shop[] shops;
};
