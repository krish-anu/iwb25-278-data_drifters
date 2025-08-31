# Project Name

## Description
This project is a full-stack web application with separate Admin and User interfaces. Users can browse products, place orders, and manage their accounts, while admins can manage inventory and monitor orders. The backend is built with **Ballerina**, the frontend with **React + TypeScript (TSX)**, **MongoDB** is used as the database, and the application is deployed on **Microsoft Azure**.

## Features
- User authentication and authorization
- Product catalog browsing
- Shopping cart and checkout functionality
- Admin panel for inventory management
- PDF invoice generation
- Responsive UI for both Admin and User

## Tech Stack
- **Frontend:** React, TypeScript (TSX), TailwindCSS
- **Backend:** Ballerina
- **Database:** MongoDB
- **Cloud:** Microsoft Azure

## Project Structure


## Installation & Setup

### Backend
1. Navigate to the `Backend` folder:
   ```bash
   cd Backend

### Create a Config.toml file based on your environment configuration in root of Backend folder  
[Backend]
collectionName_users = "users"
collectionName_products = "products"
collectionName_shops = "shops"
collectionName_images = "images"
mongodbConnectionString = "<your_mongodb_connection_string>"
databaseName = "<your_database_name>"
STORAGE_ACCOUNT_NAME = "<your_azure_storage_account>"
CONTAINER_NAME = "<your_container_name>"
BLOB_ACCESS_KEY = "<your_blob_access_key>"
collectionName_orders = "orders"
collectionName_customers = "customers"

[Backend.utils]
mongodbConnectionString = "<your_mongodb_connection_string>"
databaseName = "<your_database_name>"
jwtSecret = "<your_jwt_secret>"

[Backend.db]
collectionName_users = "users"
collectionName_orders = "orders"
collectionName_customers = "customers"
collectionName_shops = "shops"
 
Run the backend 
bal run


bal run

Admin Frontend

Navigate to the Admin folder:

cd Admin


Install dependencies:

npm install


Run the admin frontend:

npm run dev

User Frontend

Navigate to the User folder:

cd User


Install dependencies:

npm install


Run the user frontend:

npm run dev