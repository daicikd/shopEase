 HEAD
# ShopEase - E-commerce Platform

ShopEase is a modern e-commerce platform built with Node.js, Express, and SQLite. It provides a seamless shopping experience with features like user authentication, product browsing, cart management, and secure payment processing.

## Features

- **User Authentication**
  - Secure registration and login system
  - JWT-based authentication
  - Profile management

- **Product Management**
  - Browse products with pagination
  - Search functionality
  - Product categories
  - Detailed product views

- **Shopping Cart**
  - Add/remove items
  - Quantity management
  - Real-time price calculation

- **Checkout Process**
  - Secure payment processing
  - Order summary
  - Purchase history

- **User Profile**
  - View purchase history
  - Track orders
  - Manage personal information

## Tech Stack

- **Backend**
  - Node.js
  - Express.js
  - SQLite3
  - JWT Authentication
  - bcrypt for password hashing

- **Frontend**
  - HTML5
  - CSS3
  - JavaScript
  - Bootstrap 5
  - Bootstrap Icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shopEase.git
   cd shopEase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   node app.js
   ```
   This will create the necessary database tables and seed initial product data.

4. **Start the server**
   ```bash
   node app.js
   ```

5. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
shopEase/
├── app.js              # Main application file
├── data/               # Database files
├── public/             # Static files
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   ├── images/        # Product images
│   └── *.html         # Frontend pages
├── routes/             # API routes
└── views/              # Server-side views
```

## API Endpoints

- **Authentication**
  - POST `/api/register` - User registration
  - POST `/api/login` - User login
  - GET `/api/profile` - Get user profile

- **Products**
  - GET `/products` - Get all products
  - GET `/products/:id` - Get product details
  - GET `/products/search` - Search products

- **Cart**
  - GET `/api/cart` - Get cart items
  - POST `/api/cart/add` - Add item to cart
  - DELETE `/api/cart/:id` - Remove item from cart

- **Purchases**
  - POST `/api/purchases` - Create new purchase
  - GET `/api/profile` - Get purchase history

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Secure session management
- Input validation
- SQL injection prevention

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the CSC 317 Project At SFSU.

## Support

For support, email support@shopease.com or create an issue in the repository. 

# shopEase
This is my CSC 317 Final Project.
 7241fbf9902311620eaed461d990dbd2ba746278
