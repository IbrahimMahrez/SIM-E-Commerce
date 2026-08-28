🛍️ SIM MARKET

A full-featured and modern E-Commerce platform built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

SIM MARKET provides a complete and interactive online shopping experience for customers, while offering powerful tools for merchants and administrators to manage products, orders, categories, discounts, coupons, payments, and business analytics.

The platform also includes an AI Assistant that can communicate with users, provide shopping advice, and recommend suitable products based on their needs.

⸻

✨ Features

👤 User Features

* 🔐 Sign Up & Login
* 🛡️ JWT Authentication & Authorization
* 🛍️ Browse available products
* 🔎 Search for products
* 📂 Browse products by categories
* 📄 Product pagination
* 🛒 Add products to cart
* 🗑️ Remove products from cart
* ➕➖ Update product quantities
* 💳 Choose from multiple payment methods
* 🎟️ Apply discount coupons
* 🏷️ Get product discounts and offers
* ⭐ Loyalty and rewards system
* 📦 Place orders
* 🚚 Track order status
* 📜 View order history
* 🧾 View invoices for orders
* 📊 View detailed order information

⸻

🏪 Merchant System

SIM MARKET supports a dedicated Merchant system, allowing sellers to manage their products and monitor their business activities.

Merchant Features

* 🏪 Register as a Merchant
* 📦 Add products
* ✏️ Update products
* 🗑️ Delete products
* 📂 Select and manage product categories
* 💰 Create and manage discounts
* 🎟️ Create and manage discount coupons
* 📦 Manage merchant orders
* 🚚 Track order status
* 🧾 Manage order invoices
* 📊 Analyze orders and sales
* 📈 Monitor business performance

Merchants can focus on specific product categories and manage their own products and related orders.

⸻

🛡️ Admin Features

The Admin has advanced control over the entire platform.

* 👥 Manage users
* 🏪 Manage merchants
* 🔑 Manage user roles and permissions
* 📦 Manage all products
* 📂 Manage categories
* 🛒 Manage orders
* 💳 Monitor payments
* 🎟️ Manage coupons
* 🏷️ Manage discounts
* 🧾 Monitor invoices
* 📊 View platform analytics

⸻

🤖 AI Assistant

SIM MARKET includes an intelligent AI Assistant that interacts with users and helps them throughout their shopping journey.

AI Features

* 💬 Chat with the AI Assistant
* 🛍️ Recommend suitable products
* 💡 Provide personalized shopping advice
* 🔍 Answer questions about products
* 🎯 Help users choose the right products
* 🧠 Interactive conversational experience
* 💭 Provide suggestions based on user needs
* 🆘 Assist users during the shopping process

The AI Assistant makes the shopping experience more interactive, personalized, and user-friendly by allowing customers to communicate naturally and receive useful recommendations.

⸻

🎟️ Coupons & Discounts

SIM MARKET includes a complete promotional system for managing discounts and coupons.

Coupon Features

* 🎟️ Create discount coupons
* ✅ Apply coupons during checkout
* 🔢 Validate coupon codes
* 📅 Set coupon expiration dates
* 💰 Percentage-based discounts
* 💵 Fixed-amount discounts
* 🚫 Handle invalid or expired coupons

Discount Features

* 🏷️ Product discounts
* 🔥 Special offers
* 💰 Promotional prices
* 📦 Discounts on selected products
* 🎯 Targeted offers

⸻

⭐ Loyalty System

SIM MARKET includes a Loyalty & Rewards System designed to encourage customers to continue shopping.

Loyalty Features

* ⭐ Earn loyalty points/rewards
* 🎁 Receive rewards
* 💰 Use loyalty benefits
* 🏷️ Get special discounts
* 📊 Track loyalty activity

The loyalty system helps improve customer engagement and encourages repeat purchases.

⸻

💳 Payment System

SIM MARKET supports multiple payment methods to provide users with a flexible checkout experience.

Payment Features

* 💵 Multiple payment methods
* 💳 Online payment
* 📋 Payment status tracking
* ✅ Payment confirmation
* 🧾 Invoice generation
* 🔐 Secure checkout process

⸻

📦 Order Management

The platform provides a complete order management system covering the entire order lifecycle.

Order Features

* 🛒 Create orders
* 📦 Manage order items
* 💳 Track payment status
* 🚚 Track shipping status
* 🔄 Update order status
* 📜 View order history
* 🔎 View detailed order information
* 🧾 Generate invoices
* 📊 Analyze order data

Order Status

Orders can move through different stages such as:

Pending
   ↓
Confirmed
   ↓
Processing
   ↓
Shipped
   ↓
Delivered

Orders can also be cancelled when applicable.

⸻

🚚 Order Tracking

Users can track their orders and monitor their current status.

The tracking system allows users to follow the order from the moment it is placed until delivery.

🛒 Order Placed
      ↓
✅ Confirmed
      ↓
📦 Processing
      ↓
🚚 Shipped
      ↓
🏠 Delivered

⸻

🧾 Invoice System

SIM MARKET provides an invoice for each order.

Invoices can contain:

* 👤 Customer information
* 📦 Ordered products
* 🔢 Product quantities
* 💰 Product prices
* 🏷️ Applied discounts
* 🎟️ Applied coupon
* 💳 Payment information
* 🚚 Shipping information
* 💵 Final order total

⸻

📊 Order Analytics

SIM MARKET provides order and sales analytics to help merchants and administrators understand business performance.

Analytics Include

* 📦 Total orders
* 💰 Total revenue
* 📈 Sales performance
* 📊 Order statistics
* 🚚 Order status statistics
* 🛍️ Product performance
* 📅 Order activity
* 💳 Payment statistics
* 🏷️ Discount impact

These analytics help merchants understand their sales performance and make better business decisions.

⸻

🔐 Authentication & Authorization

The application uses secure authentication and role-based authorization.

Authentication

* User registration
* User login
* JWT authentication
* Protected routes
* Secure password handling
* Token-based authorization

User Roles

SIM MARKET supports three main roles:

👤 User
   │
   ├── Shopping
   ├── Cart
   ├── Orders
   ├── Payments
   └── Loyalty
🏪 Merchant
   │
   ├── Products
   ├── Categories
   ├── Orders
   ├── Discounts
   ├── Coupons
   └── Analytics
🛡️ Admin
   │
   ├── Users
   ├── Merchants
   ├── Products
   ├── Categories
   ├── Orders
   ├── Payments
   ├── Coupons
   └── Analytics

⸻

🧱 Tech Stack

Layer	Technology
Frontend	React.js
Backend	Node.js
Server Framework	Express.js
Database	MongoDB
ODM	Mongoose
Authentication	JWT
HTTP Client	Axios
State Management	React Hooks / Context API
Version Control	Git & GitHub

⸻

🏗️ Project Structure

📁 E-commerce/
│
├── 📁 SIM/                         # React Frontend
│   │
│   ├── 📁 public/
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable Components
│   │   ├── 📁 pages/               # Application Pages
│   │   ├── 📁 context/             # Context API
│   │   ├── 📁 services/            # API Services
│   │   ├── 📁 hooks/               # Custom Hooks
│   │   ├── 📁 assets/              # Images & Assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── 📁 server/                      # Node.js + Express Backend
    │
    ├── 📁 controllers/             # Business Logic
    ├── 📁 models/                  # MongoDB Models
    ├── 📁 routes/                  # API Routes
    ├── 📁 middleware/              # Authentication & Middleware
    ├── 📁 services/                # Application Services
    ├── 📁 utils/                   # Helper Functions
    ├── server.js
    └── package.json

⸻

🔄 Application Flow

                ┌──────────────┐
                │   SIM MARKET │
                └──────┬───────┘
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       👤 User     🏪 Merchant   🛡️ Admin
          │            │            │
          ↓            ↓            ↓
      Products      Products     Management
          │            │            │
          ↓            ↓            ↓
        Cart        Orders       Analytics
          │            │
          ↓            ↓
       Checkout     Business
          │         Analytics
          ↓
       Payment
          │
          ↓
        Order
          │
          ├──────────────┐
          ↓              ↓
     🚚 Tracking     🧾 Invoice
          │
          ↓
      ⭐ Loyalty

⸻

🚀 Installation

1. Clone the Repository

git clone <your-repository-url>

⸻

2. Navigate to the Project

cd E-commerce

⸻

3. Install Backend Dependencies

cd server
npm install

⸻

4. Configure Environment Variables

Create a .env file inside the server directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

Add any additional environment variables required by your payment or AI services.

⸻

5. Run the Backend

npm run dev

Or:

npm start

⸻

6. Install Frontend Dependencies

Open another terminal:

cd SIM
npm install

⸻

7. Run the Frontend

npm run dev

⸻

🌐 Project Architecture

SIM MARKET follows a modern Client-Server architecture.

React Frontend
      │
      │ Axios / HTTP Requests
      ↓
Node.js + Express API
      │
      ├── Authentication
      ├── Users
      ├── Merchants
      ├── Products
      ├── Categories
      ├── Cart
      ├── Orders
      ├── Payments
      ├── Coupons
      ├── Discounts
      ├── Loyalty
      ├── Invoices
      ├── Analytics
      └── AI Assistant
              │
              ↓
        MongoDB Database

⸻

🔮 Future Improvements

Planned improvements may include:

* 📱 React Native mobile application
* 🤖 More advanced AI-powered recommendations
* 🔔 Real-time notifications
* 💬 Real-time customer/merchant chat
* 📊 Advanced business dashboards
* 🌍 Multi-language support
* 💱 Multi-currency support
* 🚚 More advanced delivery tracking
* ⭐ Advanced loyalty and rewards
* 🧠 Personalized AI shopping experience

⸻

📸 Screenshots

Screenshots of the application can be added here:

Coming Soon...

⸻

📬 Contact

* 💼 LinkedIn: https://www.linkedin.com/in/ibrahim-mohamed-haraz-95114a2ab/
* 📧 Email: ibrahimmahrez726@gmail.com
* 🌐 Portfolio: https://ibrahimmahrez.github.io/ibrahim-protofilo/

⸻

💡 Author

Made with ❤️ by Ibrahim Mahrez

MERN Stack Developer | Computer Science Student

⸻

⭐ If you like this project, don’t forget to give it a star!