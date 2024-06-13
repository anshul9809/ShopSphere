# Shopsphere Backend

Welcome to the Shopsphere Backend repository! This project serves as the backend for the Shopsphere e-commerce platform, providing essential APIs and functionalities for managing the online store.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Product management (CRUD operations)
- Shopping cart management
- Order processing
- Payment integration
- Admin dashboard for managing the platform

## Installation

To get started with the Shopsphere backend, follow these steps:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/anshul9809/shopsphere.git
    cd shopsphere/backend
    ```

2. **Install dependencies:**

    Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then run:

    ```sh
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following environment variables:

    ```env
    PORT=5000
    MONGO_URL=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    GMAIL_EMAIL = your_gmail_email
    GMAIL_PASSWORD = your_gmail_password
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. **Run the server:**

    ```sh
    npm start
    ```

    The backend server will start on the port specified in the `.env` file (default is 5000).

## Configuration

Configure the application by editing the environment variables in the `.env` file. Ensure you have all the required values set up correctly.

## Usage

After setting up and running the server, you can interact with the API using tools like [Postman](https://www.postman.com/) or directly through your frontend application.

## API Endpoints

Here are some of the main API endpoints available in the Shopsphere backend:

- **User Authentication:**
  - `POST /api/v1/users/register` - Register a new user
  - `POST /api/v1/users/login` - Log in a user

- **Product Management:**
  - `GET /api/v1/products` - Get all products
  - `GET /api/v1/products/:id` - Get a single product by ID
  - `POST /api/v1/products` - Create a new product (admin only)
  - `PUT /api/v1/products/:id` - Update a product (admin only)
  - `DELETE /api/v1/products/:id` - Delete a product (admin only)

- **Cart Management:**
  - `GET /api/v1/cart` - Get the user's cart
  - `POST /api/v1/cart` - Add items to the cart
  - `DELETE /api/v1/cart/:id` - Remove items from the cart

- **Order Processing:**
  - `POST /api/v1/orders` - Create a new order
  - `GET /api/v1/orders/:id` - Get order details by ID

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Cloudinary for image upload
- Nodemailer
  

## Contributing

Contributions are welcome! Please fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
