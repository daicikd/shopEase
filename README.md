
# ShopEase - E-commerce Platform

ShopEase is a modern e-commerce platform built with Node.js, Express, and SQLite. It provides a seamless shopping experience with features like user authentication, product browsing, cart management, and secure payment processing.

---

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

---

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

---

## Getting Started

### Prerequisites
- Node.js and npm installed

### Installation

```bash
git clone https://github.com/daicikd/shopEase.git
cd shopEase
npm install
```

### Running the App

```bash
node app.js
```

The app will run at `http://localhost:3000`

---

## Folder Structure

```
├── app.js             # Entry point
├── routes/            # Route handlers
├── data/              # SQLite database
├── public/            # Static frontend (HTML, CSS, JS)
├── package.json
```

---

## License

This project is open-source and available under the MIT License.
