# Online Market Place for Handmade Craft

**Your comprehensive solution for modern online shopping and business management**

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Modules & Components](#modules--components)
- [Technology Stack](#technology-stack)
- [Installation Guide](#installation-guide)
- [Usage Instructions](#usage-instructions)
- [Project Structure](#project-structure)
- [Mind Map](#mind-map)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

Online Market Place for Handmade Craft is a full-stack marketplace tailored for independent artisans and craft enthusiasts. It blends a curated shopping experience with robust operational tooling, enabling creators to showcase handmade goods while buyers discover authentic items by region, material, craft type, and story.

### Vision & Goals
- Elevate artisans globally by providing a fair, transparent, and scalable marketplace
- Build trust through high-quality listings, authentic reviews, and clear shop policies
- Offer a delightful, performant, and accessible shopping experience across devices
- Provide maintainers and contributors with a modular, documented codebase that scales

### What This Project Solves
- **For Buyers**: Hard-to-find crafts become discoverable; clear pricing, availability, and shipping; secure checkout; credible reviews
- **For Artisans**: Simple catalog management, order workflow, payout-ready system, and visibility by region/craft
- **For Operators**: Centralized moderation, analytics, inventory insight, and operational automations

### Target Users
- **Buyers**: Individuals seeking unique, handmade items, gifts, and region-specific crafts
- **Artisans/Sellers**: Independent creators, small collectives, and craft studios
- **Marketplace Admins**: Trust & safety, support, merchandising, finance, and analytics teams

### Marketplace Model (Current Scope)
- Single-vendor cart per checkout session (simple, reliable flow)
- Region and subcategory-centric discovery (e.g., Explore by Region → Europe → France)
- Platform-processed payments (Stripe), with roadmap to multi-seller payouts
- Reviews and ratings around purchased products for quality signals

### Core User Journeys
- **Buyer**
  1) Discover by region/category or search → 2) Filter/sort → 3) View detail → 4) Add to cart → 5) Checkout → 6) Track order → 7) Review
- **Artisan (future expansion)**
  1) Sign up → 2) Create shop → 3) List products → 4) Manage stock → 5) Fulfill orders → 6) Receive payouts → 7) Engage with reviews
- **Admin**
  1) Monitor dashboard → 2) Review reports/moderate → 3) Curate categories → 4) Handle support → 5) Export analytics

### Catalog & Taxonomy
- Top-level: Regions (Asia, Africa, Europe, North America, South America, Australia & Oceania)
- Sub-level: Countries (e.g., France, Spain, Germany, Greece, Turkey)
- Product attributes: materials, techniques, dimensions, price, stock, images
- Visual consistency: card grids with 300×200 images, unified hover effects, and typography

### Trust, Safety, and Content Quality
- Authenticated reviews with rating aggregation
- Admin moderation capabilities (products, reviews, images)
- Clear policies for returns, shipping, and prohibited content (operator-configurable)

### High-Level Data Model (Simplified)
- `User` (buyer/admin) → profile, addresses, auth
- `Product` → title, description, images, price, stock, region/country, attributes
- `Order` → items, totals, payment status, shipping info, timeline
- `Cart` → user, items, quantities, computed totals
- `Review` → user, product, rating, text, timestamps

### Security & Compliance
- JWT-based authentication; password hashing (bcrypt)
- Role-based authorization for admin-only operations
- Stripe payment processing; sensitive keys in environment variables
- Input validation and standardized error handling

### Performance & Scalability
- React + Vite for fast client-side performance
- API supports pagination, filtering, and image fallback logic
- MongoDB/Mongoose for flexible, horizontally scalable data storage
- Asset optimizations (image sizing, caching guidance in docs)

### Accessibility & UX
- Mobile-first responsive layout
- Consistent image ratios and interactive states
- Breadcrumbs and semantic structure on category flows
- Clear empty states; removal of unnecessary loading placeholders on category pages

### Observability & Operations
- Structured error handling and logs (backend)
- Admin dashboard for key metrics (orders, products, revenue)
- Seeder utilities for local development and demos

### Current Limitations & Roadmap Highlights
- Single-seller checkout flow (multi-seller/cart split is planned)
- Seller onboarding, payouts, and dispute tooling are roadmap items
- Additional payment methods and languages planned
- Enhanced recommendation engine and marketplace curation planned

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Separate permissions for customers and administrators
- **Password Encryption**: Advanced bcrypt hashing for password security
- **Session Management**: Automatic token refresh and secure logout
- **Admin Authentication**: Dedicated admin login system with enhanced security

### 🛍️ Product Management
- **Comprehensive Product Catalog**: Detailed product information with specifications
- **Category Organization**: Hierarchical category and subcategory system
- **Image Management**: Multiple product images with optimization
- **Inventory Tracking**: Real-time stock level monitoring
- **Product Search**: Advanced search with filters and sorting
- **Product Reviews**: Customer rating and review system
- **Price Management**: Dynamic pricing with discounts and offers

### 🛒 Shopping Experience
- **Shopping Cart**: Real-time cart updates with persistent storage
- **Product Comparison**: Side-by-side product comparison feature
- **Product Recommendations**: AI-powered product suggestions
- **Quick View**: Modal-based product preview
- **Recently Viewed**: Track and display recently viewed products
- **Product Filtering**: Advanced filtering by price, category, brand, etc.
- **Responsive Design**: Mobile-first responsive interface

### 💳 Order Processing
- **Streamlined Checkout**: Multi-step checkout process with validation
- **Payment Integration**: Secure Stripe payment processing
- **Order Tracking**: Real-time order status updates
- **Order History**: Complete purchase history for customers
- **Invoice Generation**: Automated invoice creation
- **Shipping Management**: Multiple shipping options and tracking
- **Order Notifications**: Email notifications for order updates

### 📊 Admin Dashboard
- **Sales Analytics**: Comprehensive sales reports and metrics
- **Customer Management**: Customer data and purchase history
- **Inventory Management**: Stock level monitoring and alerts
- **Order Management**: Order processing and fulfillment tools
- **Product Management**: Add, edit, and manage product catalog
- **Revenue Tracking**: Financial reports and profit analysis
- **User Management**: Admin user roles and permissions

### 🔍 Search & Discovery
- **Global Search**: Site-wide search functionality
- **Category Search**: Category-specific product search
- **Advanced Filters**: Price range, brand, rating filters
- **Search Suggestions**: Auto-complete search suggestions
- **Search Analytics**: Track popular search terms
- **Product Tags**: Tag-based product organization

### 📱 User Experience
- **Responsive Design**: Mobile, tablet, and desktop optimization
- **Progressive Web App**: PWA capabilities for mobile users
- **Accessibility**: WCAG compliant accessibility features
- **Performance Optimization**: Fast loading times and smooth interactions
- **Error Handling**: User-friendly error messages and recovery
- **Loading States**: Visual feedback during data loading

## 🏗️ System Architecture

### Frontend Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Components    │    │   State Mgmt    │
│   (Main App)    │◄──►│   (UI Layer)    │◄──►│   (Data Layer)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Client    │    │   Routing       │    │   Auth Context  │
│   (HTTP Layer)  │    │   (Navigation)  │    │   (Security)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Backend Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Express API   │    │   Controllers   │    │   Middleware    │
│   (Server)      │◄──►│   (Logic Layer) │◄──►│   (Auth/CORS)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   Models        │    │   Utilities     │
│   (Database)    │    │   (Data Schema) │    │   (Helpers)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Modules & Components

### Backend Modules

#### Authentication Module (`authController.js`)
- **Purpose**: Handles user registration, login, and token management
- **Key Functions**:
  - `register()`: Create new user accounts with validation
  - `login()`: Authenticate users and generate JWT tokens
  - `logout()`: Invalidate user sessions
  - `refreshToken()`: Renew expired tokens
- **Dependencies**: User Model, JWT, bcrypt
- **API Endpoints**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`

#### Product Module (`productController.js`)
- **Purpose**: Manages product catalog and inventory
- **Key Functions**:
  - `getProducts()`: Retrieve products with filtering and pagination
  - `getProductById()`: Fetch individual product details
  - `createProduct()`: Add new products to catalog
  - `updateProduct()`: Modify existing product information
  - `deleteProduct()`: Remove products from catalog
- **Dependencies**: Product Model, Image Upload, Category System
- **API Endpoints**: `/api/products/*`

#### Cart Module (`cartController.js`)
- **Purpose**: Manages shopping cart operations
- **Key Functions**:
  - `addToCart()`: Add items to user's cart
  - `removeFromCart()`: Remove items from cart
  - `updateCartItem()`: Modify item quantities
  - `getCart()`: Retrieve user's cart contents
  - `clearCart()`: Empty user's cart
- **Dependencies**: Cart Model, Product Model, User Model
- **API Endpoints**: `/api/cart/*`

#### Order Module (`orderController.js`)
- **Purpose**: Processes orders and manages fulfillment
- **Key Functions**:
  - `createOrder()`: Process new orders
  - `getOrders()`: Retrieve user's order history
  - `updateOrderStatus()`: Modify order status
  - `getOrderById()`: Fetch specific order details
  - `processPayment()`: Handle payment processing
- **Dependencies**: Order Model, Payment Gateway, Email Service
- **API Endpoints**: `/api/orders/*`

#### Review Module (`reviewController.js`)
- **Purpose**: Manages product reviews and ratings
- **Key Functions**:
  - `createReview()`: Add new product reviews
  - `getReviews()`: Retrieve product reviews
  - `updateReview()`: Modify existing reviews
  - `deleteReview()`: Remove reviews
  - `calculateRating()`: Update product average ratings
- **Dependencies**: Review Model, Product Model, User Model
- **API Endpoints**: `/api/reviews/*`

#### Admin Module (`adminController.js`)
- **Purpose**: Provides administrative functionality
- **Key Functions**:
  - `getDashboardData()`: Retrieve analytics and metrics
  - `manageUsers()`: User management operations
  - `manageProducts()`: Product catalog management
  - `manageOrders()`: Order processing and fulfillment
  - `generateReports()`: Create sales and analytics reports
- **Dependencies**: All other modules, Analytics Service
- **API Endpoints**: `/api/admin/*`

### Frontend Components

#### Layout Components
- **Header**: Navigation, search, user menu, cart icon
- **Footer**: Links, contact info, social media
- **Sidebar**: Category navigation, filters
- **Breadcrumb**: Navigation trail

#### Page Components
- **HomePage**: Featured products, promotions, categories
- **ProductList**: Product grid with filters and sorting
- **ProductDetail**: Detailed product view with reviews
- **Cart**: Shopping cart with quantity management
- **Checkout**: Multi-step checkout process
- **UserAccount**: Profile management and order history
- **AdminDashboard**: Administrative interface

#### UI Components
- **ProductCard**: Reusable product display component
- **SearchBar**: Global search functionality
- **FilterPanel**: Product filtering options
- **Pagination**: Page navigation for product lists
- **Modal**: Reusable modal dialogs
- **LoadingSpinner**: Loading state indicators
- **Toast**: Notification messages

#### Utility Components
- **ImageUpload**: File upload with preview
- **FormValidation**: Input validation helpers
- **ErrorBoundary**: Error handling wrapper
- **ProtectedRoute**: Authentication guard
- **ThemeProvider**: Theme management

## 🧩 Schemas and Modules

### Backend Schemas (Mongoose)
- `BACKEND/models/userModel.js` — User accounts and profiles
- `BACKEND/models/adminModel.js` — Admin users
- `BACKEND/models/productModel.js` — Products and attributes
- `BACKEND/models/cartModel.js` — User carts and items
- `BACKEND/models/orderModel.js` — Orders and lifecycle
- `BACKEND/models/reviewModel.js` — Product reviews and ratings
- `BACKEND/models/adminDatasetModel.js` — Admin datasets/utilities

### Backend Controllers (Business Logic Modules)
- `BACKEND/controllers/authController.js` — Authentication and session handling
- `BACKEND/controllers/profileController.js` — User profile operations
- `BACKEND/controllers/productController.js` — Product catalog management
- `BACKEND/controllers/cartController.js` — Cart CRUD and totals
- `BACKEND/controllers/orderController.js` — Order creation and status updates
- `BACKEND/controllers/reviewController.js` — Reviews and rating aggregation
- `BACKEND/controllers/adminController.js` — Admin dashboard and management
- `BACKEND/controllers/adminAuthController.js` — Admin authentication

### Backend Routes (HTTP API Modules)
- `BACKEND/routes/authRoutes.js` — Auth endpoints
- `BACKEND/routes/profileRoutes.js` — Profile endpoints
- `BACKEND/routes/productRoutes.js` — Product endpoints
- `BACKEND/routes/cartRoutes.js` — Cart endpoints
- `BACKEND/routes/orderRoutes.js` — Order endpoints
- `BACKEND/routes/reviewRoutes.js` — Review endpoints
- `BACKEND/routes/adminRoutes.js` — Admin endpoints
- `BACKEND/routes/adminAuthRoutes.js` — Admin auth endpoints
- `BACKEND/routes/imageRoutes.js` — Image handling endpoints

### Backend Middleware & Utils
- `BACKEND/middleware/authMiddleware.js` — JWT verification and role guards
- `BACKEND/utils/errorHandler.js` — Centralized error handling helpers
- `BACKEND/utils/seeder.js` / `productSeeder.js` — Data seeding utilities

## 🛠️ Technology Stack

### Backend Technologies
- **Node.js** (v18+): JavaScript runtime for server-side development
- **Express.js** (v4+): Web application framework
- **MongoDB** (v6+): NoSQL database for flexible data storage
- **Mongoose** (v7+): MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing library
- **Stripe**: Payment processing API
- **Multer**: File upload middleware
- **Morgan**: HTTP request logger
- **CORS**: Cross-origin resource sharing middleware

### Frontend Technologies
- **React** (v18+): Component-based UI library
- **Vite** (v4+): Fast build tool and development server
- **React Router** (v6+): Client-side routing
- **Axios** (v1+): HTTP client for API requests
- **CSS3/SCSS**: Styling with modern CSS features
- **React Hook Form**: Form handling and validation
- **React Query**: Data fetching and caching
- **Framer Motion**: Animation library
- **React Icons**: Icon component library

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Nodemon**: Development server auto-restart
- **Git**: Version control
- **npm/yarn**: Package management
- **Postman**: API testing
- **MongoDB Compass**: Database management

### Deployment & DevOps
- **Docker**: Containerization
- **PM2**: Process management
- **Nginx**: Web server and reverse proxy
- **Let's Encrypt**: SSL certificate management
- **GitHub Actions**: CI/CD pipeline
- **AWS/DigitalOcean**: Cloud hosting
- **MongoDB Atlas**: Cloud database

## 📦 Installation Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB (v6.0 or higher)
- npm (v8.0.0 or higher) or yarn (v1.22.0 or higher)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shopsmart-ecommerce.git
   cd shopsmart-ecommerce
   ```

2. **Install backend dependencies**
   ```bash
   cd BACKEND
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```

7. **Install frontend dependencies** (in a new terminal)
   ```bash
   cd ../FRONTEND
   npm install
   ```

8. **Start the frontend development server**
   ```bash
   npm run dev
   ```

### Environment Configuration

#### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/shopsmart

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/

# CORS
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App Configuration
VITE_APP_NAME=Online Market Place for Handmade Craft
VITE_APP_VERSION=1.0.0
```

### Docker Installation

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Manual Docker Setup**
   ```bash
   # Build backend image
   docker build -t shopsmart-backend ./BACKEND
   
   # Build frontend image
   docker build -t shopsmart-frontend ./FRONTEND
   
   # Run containers
   docker run -d -p 5000:5000 --name backend shopsmart-backend
   docker run -d -p 5173:5173 --name frontend shopsmart-frontend
   ```

## 📖 Usage Instructions

### Customer Workflow

#### 1. Account Management
```javascript
// Registration
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### 2. Product Browsing
- Navigate to homepage to see featured products
- Use category menu for organized browsing
- Utilize search bar for specific products
- Apply filters for refined results

#### 3. Shopping Process
```javascript
// Add to cart
POST /api/cart/add
{
  "productId": "64a1b2c3d4e5f6789abcdef0",
  "quantity": 2
}

// Update cart
PUT /api/cart/update
{
  "itemId": "64a1b2c3d4e5f6789abcdef1",
  "quantity": 3
}
```

#### 4. Checkout Process
```javascript
// Create order
POST /api/orders/create
{
  "items": [
    {
      "productId": "64a1b2c3d4e5f6789abcdef0",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  },
  "paymentMethod": "card"
}
```

### Admin Workflow

#### 1. Dashboard Access
- Navigate to `/admin`
- Login with admin credentials
- View analytics and key metrics

#### 2. Product Management
```javascript
// Create product
POST /api/admin/products/create
{
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones",
  "price": 199.99,
  "category": "Electronics",
  "subcategory": "Audio",
  "inventory": 50,
  "images": ["headphone1.jpg", "headphone2.jpg"]
}

// Update product
PUT /api/admin/products/update/:id
{
  "price": 179.99,
  "inventory": 45
}
```

#### 3. Order Management
- View incoming orders in real-time
- Update order status (processing, shipped, delivered)
- Generate shipping labels and invoices
- Handle customer inquiries

#### 4. Analytics & Reports
- Monitor sales trends and patterns
- Track popular products and categories
- Analyze customer behavior
- Generate financial reports

## 📁 Project Structure

```
shopsmart-ecommerce/
├── 📁 BACKEND/                          # Backend application
│   ├── 📁 controllers/                   # Request handlers
│   │   ├── 📄 adminAuthController.js     # Admin authentication
│   │   ├── 📄 adminController.js         # Admin dashboard
│   │   ├── 📄 authController.js          # User authentication
│   │   ├── 📄 cartController.js          # Shopping cart
│   │   ├── 📄 orderController.js         # Order processing
│   │   ├── 📄 productController.js       # Product management
│   │   ├── 📄 profileController.js       # User profiles
│   │   └── 📄 reviewController.js        # Product reviews
│   ├── 📁 middleware/                    # Express middleware
│   │   └── 📄 authMiddleware.js           # Authentication verification
│   ├── 📁 models/                        # Mongoose schemas
│   │   ├── 📄 adminModel.js               # Admin user schema
│   │   ├── 📄 cartModel.js                # Cart schema
│   │   ├── 📄 orderModel.js               # Order schema
│   │   ├── 📄 productModel.js             # Product schema
│   │   ├── 📄 reviewModel.js              # Review schema
│   │   └── 📄 userModel.js                # User schema
│   ├── 📁 routes/                        # API routes
│   │   ├── 📄 adminAuthRoutes.js          # Admin auth routes
│   │   ├── 📄 adminRoutes.js              # Admin routes
│   │   ├── 📄 authRoutes.js               # Auth routes
│   │   ├── 📄 cartRoutes.js               # Cart routes
│   │   ├── 📄 imageRoutes.js              # Image handling
│   │   ├── 📄 orderRoutes.js              # Order routes
│   │   ├── 📄 productRoutes.js            # Product routes
│   │   ├── 📄 profileRoutes.js            # Profile routes
│   │   └── 📄 reviewRoutes.js             # Review routes
│   ├── 📁 utils/                         # Utility functions
│   │   ├── 📄 errorHandler.js             # Error handling
│   │   ├── 📄 seeder.js                  # Database seeding
│   │   └── 📄 productSeeder.js            # Product data seeding
│   ├── 📄 .env                           # Environment variables
│   ├── 📄 package.json                   # Dependencies
│   └── 📄 server.js                      # Application entry point
│
├── 📁 FRONTEND/                          # Frontend application
│   ├── 📁 public/                        # Static assets
│   │   ├── 📄 icon.jpg                   # App icon
│   │   └── 📄 vite.svg                   # Vite logo
│   ├── 📁 src/                           # Source code
│   │   ├── 📁 Components/                # Reusable components
│   │   │   ├── 📄 Header.jsx             # Site header
│   │   │   ├── 📄 Footer.jsx             # Site footer
│   │   │   ├── 📄 ProductCard.jsx        # Product display
│   │   │   ├── 📄 SearchBar.jsx          # Search functionality
│   │   │   └── 📄 Modal.jsx              # Modal dialogs
│   │   ├── 📁 Pages/                     # Page components
│   │   │   ├── 📄 Home.jsx               # Homepage
│   │   │   ├── 📄 Product.jsx            # Product listing
│   │   │   ├── 📄 Detail.jsx             # Product detail
│   │   │   ├── 📄 Cart.jsx               # Shopping cart
│   │   │   ├── 📄 Checkout.jsx           # Checkout process
│   │   │   ├── 📄 Account.jsx            # User account
│   │   │   ├── 📄 Orders.jsx             # Order history
│   │   │   ├── 📄 Admin.jsx              # Admin dashboard
│   │   │   └── 📄 Subcategory.jsx        # Category pages
│   │   ├── 📁 assets/                    # Images and assets
│   │   ├── 📁 styles/                    # CSS/SCSS files
│   │   ├── 📁 utils/                     # Utility functions
│   │   ├── 📄 App.jsx                    # Main app component
│   │   └── 📄 main.jsx                   # Application entry
│   ├── 📄 .env                           # Environment variables
│   ├── 📄 package.json                   # Dependencies
│   └── 📄 vite.config.js                 # Vite configuration
│
├── 📄 package.json                       # Root package.json
├── 📄 docker-compose.yml                 # Docker configuration
├── 📄 Dockerfile                         # Docker image
└── 📄 README.md                          # Project documentation
```

## 🧠 Mind Map

```mermaid
mindmap
  root((Online Market Place for Handmade Craft))
    Frontend
      React Components
        Layout Components
          Header
          Footer
          Sidebar
          Breadcrumb
        Page Components
          HomePage
          ProductList
          ProductDetail
          Cart
          Checkout
          UserAccount
          AdminDashboard
        UI Components
          ProductCard
          SearchBar
          FilterPanel
          Pagination
          Modal
          LoadingSpinner
      State Management
        Context API
        Local Storage
        Session Storage
      Routing
        React Router
        Protected Routes
        Dynamic Routes
      Styling
        CSS3/SCSS
        Responsive Design
        Mobile First
        Component Styling
    Backend
      Express Server
        Middleware
          Authentication
          CORS
          Error Handling
          Logging
        Routes
          Auth Routes
          Product Routes
          Cart Routes
          Order Routes
          Admin Routes
          Review Routes
        Controllers
          Auth Controller
          Product Controller
          Cart Controller
          Order Controller
          Admin Controller
          Review Controller
      Database
        MongoDB
          Collections
            Users
            Products
            Orders
            Carts
            Reviews
            Admins
          Schemas
            User Schema
            Product Schema
            Order Schema
            Cart Schema
            Review Schema
            Admin Schema
      Authentication
        JWT Tokens
        Password Hashing
        Role-based Access
        Session Management
      Payment Processing
        Stripe Integration
        Payment Validation
        Transaction Logging
        Refund Handling
    Features
      User Management
        Registration
        Login/Logout
        Profile Management
        Password Reset
        Account Verification
      Product Management
        Product Catalog
        Category System
        Inventory Tracking
        Image Management
        Search & Filter
        Product Reviews
      Shopping Experience
        Shopping Cart
        Product Comparison
        Quick View
        Recently Viewed
        Product Recommendations
        Responsive Design
      Order Processing
        Checkout Process
        Payment Integration
        Order Tracking
        Order History
        Invoice Generation
        Shipping Management
      Admin Dashboard
        Sales Analytics
        Customer Management
        Inventory Management
        Order Management
        Product Management
        Revenue Tracking
        User Management
      Security
        Data Encryption
        Input Validation
        SQL Injection Prevention
        XSS Protection
        CSRF Protection
        Rate Limiting
    Technology Stack
      Frontend Tech
        React
        Vite
        React Router
        Axios
        CSS3/SCSS
        React Hook Form
        React Query
        Framer Motion
      Backend Tech
        Node.js
        Express.js
        MongoDB
        Mongoose
        JWT
        bcryptjs
        Stripe
        Multer
        Morgan
        CORS
      Development Tools
        ESLint
        Prettier
        Nodemon
        Git
        npm/yarn
        Postman
        MongoDB Compass
      Deployment
        Docker
        PM2
        Nginx
        Let's Encrypt
        GitHub Actions
        AWS/DigitalOcean
        MongoDB Atlas
    API Endpoints
      Authentication
        POST /api/auth/register
        POST /api/auth/login
        POST /api/auth/logout
        GET /api/auth/profile
        PUT /api/auth/profile
      Products
        GET /api/products
        GET /api/products/:id
        POST /api/products
        PUT /api/products/:id
        DELETE /api/products/:id
      Cart
        GET /api/cart
        POST /api/cart/add
        PUT /api/cart/update
        DELETE /api/cart/remove
        DELETE /api/cart/clear
      Orders
        GET /api/orders
        GET /api/orders/:id
        POST /api/orders/create
        PUT /api/orders/:id/status
      Reviews
        GET /api/reviews/:productId
        POST /api/reviews
        PUT /api/reviews/:id
        DELETE /api/reviews/:id
      Admin
        GET /api/admin/dashboard
        GET /api/admin/users
        GET /api/admin/products
        GET /api/admin/orders
        POST /api/admin/reports
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=10&category=electronics&sort=price&order=asc
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "name": "Premium Wireless Headphones",
      "description": "High-quality wireless headphones",
      "price": 199.99,
      "category": "Electronics",
      "subcategory": "Audio",
      "inventory": 50,
      "rating": 4.5,
      "images": ["headphone1.jpg", "headphone2.jpg"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 50
  }
}
```

#### Get Product by ID
```http
GET /api/products/64a1b2c3d4e5f6789abcdef0
```

### Cart Endpoints

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "64a1b2c3d4e5f6789abcdef0",
  "quantity": 2
}
```

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

### Order Endpoints

#### Create Order
```http
POST /api/orders/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "64a1b2c3d4e5f6789abcdef0",
      "quantity": 2,
      "price": 199.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  },
  "paymentMethod": "card"
}
```

### Admin Endpoints

#### Get Dashboard Data
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 125000,
    "totalOrders": 1250,
    "totalProducts": 500,
    "totalCustomers": 800,
    "recentOrders": [...],
    "topProducts": [...],
    "salesChart": [...]
  }
}
```

## 🚀 Deployment

### Production Deployment

#### 1. Environment Setup
```bash
# Set production environment variables
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shopsmart
JWT_SECRET=your_production_jwt_secret
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
```

#### 2. Build Applications
```bash
# Build backend
cd BACKEND
npm run build

# Build frontend
cd FRONTEND
npm run build
```

#### 3. Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

#### 4. PM2 Process Management
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor processes
pm2 monit
```

#### 5. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/shopsmart/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Cloud Deployment Options

#### AWS Deployment
- **EC2**: Virtual server for application hosting
- **RDS**: Managed database service
- **S3**: File storage for product images
- **CloudFront**: CDN for static assets
- **Route 53**: DNS management

#### DigitalOcean Deployment
- **Droplets**: Virtual machines for hosting
- **Managed MongoDB**: Database service
- **Spaces**: Object storage for files
- **Load Balancer**: Traffic distribution

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/shopsmart-ecommerce.git
   cd shopsmart-ecommerce
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Install dependencies**
   ```bash
   # Backend
   cd BACKEND && npm install
   
   # Frontend
   cd ../FRONTEND && npm install
   ```

5. **Make your changes**
6. **Run tests**
   ```bash
   # Backend tests
   cd BACKEND && npm test
   
   # Frontend tests
   cd ../FRONTEND && npm test
   ```

7. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

8. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

9. **Create a Pull Request**

### Code Standards

- **ESLint**: Follow the provided ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **JSDoc**: Document functions and complex code
- **Testing**: Write tests for new functionality
- **Commits**: Use conventional commit messages

### Pull Request Guidelines

- Update documentation for new features
- Add tests for new functionality
- Ensure all tests pass
- Follow the existing code style
- Include screenshots for UI changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

**Permissions:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

**Conditions:**
- 📋 License and copyright notice must be included

**Limitations:**
- ❌ No liability
- ❌ No warranty

### Full License Text

```
MIT License

Copyright (c) 2023 Online Market Place for Handmade Craft

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support & Contact

### Development Team
- **Lead Developer**: [Your Name](mailto:your.email@example.com)
- **Frontend Specialist**: [Frontend Dev](mailto:frontend@example.com)
- **Backend Architect**: [Backend Dev](mailto:backend@example.com)

### Support Channels
- 📧 Email: support@shopsmart-ecommerce.com
- 💬 Discord: [ShopSmart Community](https://discord.gg/shopsmart)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/shopsmart-ecommerce/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/shopsmart-ecommerce/wiki)

### Business Inquiries
- 📧 Email: business@shopsmart-ecommerce.com
- 📞 Phone: +1 (555) 123-4567
- 🏢 Address: 123 E-Commerce Street, Tech City, TC 12345

---

**Made with ❤️ by the Online Market Place for Handmade Craft Team**

*Last updated: December 2023*