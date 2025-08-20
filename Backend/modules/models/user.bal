// import ballerina/time;

public type User record {
    string _id?;
    string name;
    string email;
    string password;
    string? role;
    boolean accepted?;
    string createdAt?;
    string updatedAt?;
};

public type LoginRequest record {
    string email;
    string password;
};

public type LoginResponse record {
    string status;
    string message?;
    string token?;
    UserInfo user?;
};

public type UserInfo record {
    string _id;
    string name;
    string email;
    string role;
    boolean accepted?;
};
