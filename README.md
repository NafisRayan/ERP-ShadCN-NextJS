# ERP System - Enterprise Resource Planning Solution

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC)](https://tailwindcss.com/)
[![ShadCN/UI](https://img.shields.io/badge/ShadCN%2FUI-Latest-orange)](https://ui.shadcn.com/)

A comprehensive, modern Enterprise Resource Planning (ERP) system built with Next.js 15, React 19, TypeScript, and MongoDB Atlas. Features a beautiful UI with ShadCN components, dark/light theme support, and complete business management capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [Demo Data](#demo-data)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🎯 Overview

This ERP system provides a complete business management solution with modules for inventory, sales, purchasing, human resources, invoicing, and analytics. Built with modern web technologies, it offers a professional user experience with responsive design, real-time data visualization, and comprehensive reporting capabilities.

### What It Includes

- **Dashboard**: Real-time metrics, charts, and business insights
- **Inventory Management**: Product catalog, stock tracking, reorder alerts
- **Sales Orders**: Customer order management and fulfillment
- **Purchasing**: Vendor management and purchase order processing
- **Human Resources**: Employee directory and department management
- **Invoicing**: Billing and payment tracking
- **Reports**: Analytics and business intelligence
- **Authentication**: Secure user login and role-based access

## ✨ Key Features

### 🏢 Business Management
- **Complete ERP Suite**: All major business functions in one system
- **Real-time Metrics**: Live dashboard with KPI tracking
- **Multi-module Integration**: Seamless data flow between modules
- **Business Intelligence**: Advanced reporting and analytics

### 🎨 User Experience
- **Modern UI**: Professional design with ShadCN components
- **Dark/Light Themes**: Automatic theme switching with system preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with keyboard navigation

### 📊 Data Visualization
- **Interactive Charts**: Revenue trends, inventory status, performance metrics
- **Real-time Updates**: Live data refresh and notifications
- **Export Capabilities**: Data export in multiple formats
- **Advanced Filtering**: Search and filter across all modules

### 🔐 Security & Performance
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for user credentials
- **Input Validation**: Comprehensive form validation
- **Database Optimization**: Indexed queries and connection pooling

## 🛠 Technology Stack

### Frontend
- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript 5.0**: Type-safe development
- **Tailwind CSS 4.1.9**: Utility-first CSS framework
- **ShadCN/UI**: High-quality component library
- **Radix UI**: Accessible UI primitives
- **Recharts**: Data visualization library
- **Lucide React**: Beautiful icon set

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB Atlas**: Cloud-hosted NoSQL database
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **MongoDB Node.js Driver**: Database connectivity

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **pnpm**: Package management
- **TypeScript Compiler**: Type checking

## 📋 Prerequisites

Before installing, ensure you have:

- **Node.js**: Version 18.0 or higher
- **pnpm**: Package manager (recommended)
- **MongoDB Atlas**: Cloud database account
- **Git**: Version control system

### System Requirements
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: 500MB free space
- **Network**: Stable internet connection for MongoDB Atlas

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/NafisRayan/ERP-ShadCN-NextJS.git
cd ERP-ShadCN-NextJS
```

### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/erp-system

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
```

### 4. MongoDB Atlas Setup
1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or 0.0.0.0/0 for development)
5. Get your connection string and update `.env.local`

### 5. Seed Demo Data
```bash
# Seed the database with demo data
npm run seed

# Or using pnpm
pnpm run seed
```

### 6. Start Development Server
```bash
# Start the development server
npm run dev

# Or using pnpm
pnpm run dev
```

### 7. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser and login with:
- **Email**: `demo@example.com`
- **Password**: `demo123`

## ⚙️ Configuration

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | `your-secret-key` |
| `NEXTAUTH_URL` | Base URL for authentication | No | `http://localhost:3000` |

### Database Configuration
The system uses MongoDB Atlas with the following collections:
- `users` - User accounts and authentication
- `products` - Inventory items
- `orders` - Sales orders
- `purchaseOrders` - Purchase orders
- `vendors` - Supplier information
- `employees` - HR data
- `invoices` - Billing documents

### Theme Configuration
The application supports automatic theme switching:
- **System**: Follows OS preference
- **Light**: Always light mode
- **Dark**: Always dark mode

## 📖 Usage

### First Time Setup
1. **Login**: Use demo credentials or create a new account
2. **Explore Dashboard**: View business metrics and recent activity
3. **Navigate Modules**: Use sidebar to access different sections
4. **Customize Data**: Add your own products, orders, and employees

### Core Workflows

#### Inventory Management
1. Navigate to **Inventory** section
2. View current stock levels and alerts
3. Add new products using the "Add Product" button
4. Monitor reorder levels and low stock warnings
5. Update quantities and pricing as needed

#### Order Processing
1. Go to **Sales Orders** to view customer orders
2. Create new orders or update existing ones
3. Track order status through the fulfillment process
4. Generate invoices from completed orders

#### Purchasing Workflow
1. Access **Purchasing** module for vendor orders
2. Create purchase orders for inventory replenishment
3. Track delivery dates and vendor performance
4. Approve orders and manage vendor relationships

#### HR Management
1. Visit **HR Management** for employee directory
2. View department distribution and headcount
3. Add new employees and update information
4. Monitor employee status and payroll data

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Open search (when implemented)
- `Esc`: Close dialogs and modals
- `Tab`: Navigate through forms

## 🔌 API Reference

### Authentication Endpoints

#### POST `/api/auth/login`
Authenticate a user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin",
    "department": "Management"
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User"
}
```

### Dashboard Endpoints

#### GET `/api/dashboard/metrics`
Retrieve dashboard KPI metrics.

**Response:**
```json
{
  "totalRevenue": 125000.50,
  "totalOrders": 150,
  "totalInventoryValue": 75000.25,
  "totalEmployees": 25,
  "pendingOrders": 8,
  "lowStockItems": 12
}
```

#### GET `/api/dashboard/chart-data`
Get data for dashboard charts.

**Response:**
```json
[
  {
    "month": "Jan 2025",
    "revenue": 15000,
    "orders": 45
  },
  {
    "month": "Feb 2025",
    "revenue": 18500,
    "orders": 52
  }
]
```

### Inventory Endpoints

#### GET `/api/inventory/products`
Retrieve all products.

**Response:**
```json
[
  {
    "_id": "product_id",
    "sku": "SKU-0001",
    "name": "Laptop Pro",
    "category": "Electronics",
    "price": 1299.99,
    "cost": 899.99,
    "quantity": 25,
    "reorderLevel": 10,
    "supplier": "TechCorp"
  }
]
```

#### POST `/api/inventory/products`
Create a new product.

**Request Body:**
```json
{
  "sku": "SKU-0002",
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "category": "Electronics",
  "price": 49.99,
  "cost": 25.00,
  "quantity": 100,
  "reorderLevel": 20,
  "supplier": "Office Supplies Inc"
}
```

#### PUT `/api/inventory/products/[id]`
Update an existing product.

#### DELETE `/api/inventory/products/[id]`
Delete a product.

### Sales Endpoints

#### GET `/api/sales/orders`
Retrieve all sales orders.

#### POST `/api/sales/orders`
Create a new sales order.

**Request Body:**
```json
{
  "customerName": "Acme Corporation",
  "customerId": "CUST-1001",
  "items": [
    {
      "productId": "SKU-0001",
      "productName": "Laptop Pro",
      "quantity": 2,
      "unitPrice": 1299.99,
      "total": 2599.98
    }
  ],
  "totalAmount": 2599.98,
  "status": "pending",
  "orderDate": "2025-01-15T10:00:00Z",
  "dueDate": "2025-01-30T10:00:00Z"
}
```

### Purchasing Endpoints

#### GET `/api/purchasing/orders`
Retrieve all purchase orders.

#### POST `/api/purchasing/orders`
Create a new purchase order.

### HR Endpoints

#### GET `/api/hr/employees`
Retrieve all employees.

#### POST `/api/hr/employees`
Add a new employee.

### Invoice Endpoints

#### GET `/api/invoices`
Retrieve all invoices.

#### POST `/api/invoices`
Create a new invoice.

### Reports Endpoints

#### GET `/api/reports/summary`
Get business summary report.

#### GET `/api/reports/financial`
Get financial reports.

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  role: String (enum: admin, manager, employee, viewer),
  department: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  sku: String (required, unique),
  name: String (required),
  description: String,
  category: String (required),
  price: Number (required),
  cost: Number (required),
  quantity: Number (required),
  reorderLevel: Number (required),
  supplier: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  orderNumber: String (required, unique),
  customerId: String (required),
  customerName: String (required),
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  totalAmount: Number (required),
  status: String (enum: pending, confirmed, shipped, delivered, cancelled),
  orderDate: Date (required),
  dueDate: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

### PurchaseOrders Collection
```javascript
{
  _id: ObjectId,
  poNumber: String (required, unique),
  vendorId: String (required),
  vendorName: String (required),
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  totalAmount: Number (required),
  status: String (enum: draft, sent, received, cancelled),
  orderDate: Date (required),
  expectedDelivery: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Vendors Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String,
  address: String,
  city: String,
  country: String,
  paymentTerms: String,
  rating: Number (1-5),
  createdAt: Date,
  updatedAt: Date
}
```

### Employees Collection
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required),
  phone: String,
  department: String (required),
  position: String (required),
  salary: Number (required),
  joinDate: Date (required),
  status: String (enum: active, inactive, on-leave),
  createdAt: Date,
  updatedAt: Date
}
```

### Invoices Collection
```javascript
{
  _id: ObjectId,
  invoiceNumber: String (required, unique),
  orderId: String (required),
  customerId: String (required),
  customerName: String (required),
  amount: Number (required),
  tax: Number (required),
  total: Number (required),
  status: String (enum: draft, sent, paid, overdue),
  issueDate: Date (required),
  dueDate: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🏗️ Architecture

### Frontend Architecture

#### Component Structure
```
components/
├── ui/                    # ShadCN base components
├── dashboard-metrics.tsx  # KPI display component
├── dashboard-charts.tsx   # Chart visualization
├── inventory-table.tsx    # Data table component
├── header.tsx            # Top navigation
├── sidebar.tsx           # Side navigation
├── theme-provider.tsx    # Theme context
└── theme-selector.tsx    # Theme toggle
```

#### Page Structure
```
app/
├── layout.tsx            # Root layout with providers
├── page.tsx             # Authentication page
├── dashboard/
│   └── page.tsx         # Main dashboard
├── inventory/
│   └── page.tsx         # Inventory management
├── sales/
│   └── page.tsx         # Sales orders
├── purchasing/
│   └── page.tsx         # Purchase orders
├── hr/
│   └── page.tsx         # HR management
├── invoices/
│   └── page.tsx         # Invoice management
├── reports/
│   └── page.tsx         # Reports & analytics
└── settings/
    └── page.tsx         # User settings
```

### Backend Architecture

#### API Route Structure
```
app/api/
├── auth/
│   ├── login/route.ts    # User authentication
│   └── signup/route.ts   # User registration
├── dashboard/
│   ├── metrics/route.ts  # KPI calculations
│   └── chart-data/route.ts # Chart data
├── inventory/
│   └── products/route.ts # Product CRUD
├── sales/
│   └── orders/route.ts   # Order management
├── purchasing/
│   └── orders/route.ts   # PO management
├── hr/
│   └── employees/route.ts # Employee management
├── invoices/
│   └── route.ts          # Invoice management
└── reports/
    └── route.ts          # Report generation
```

#### Database Layer
```typescript
// lib/db.ts - Database connection management
export async function connectToDatabase() {
  // MongoDB connection with caching
}

export async function getCollection(name: string) {
  // Collection access with error handling
}
```

### State Management
- **Local State**: React useState for component state
- **Server State**: Direct API calls with fetch
- **Persistent State**: localStorage for auth tokens
- **Theme State**: next-themes for theme management

### Styling Architecture
- **Design System**: Consistent color palette and typography
- **CSS Variables**: Dynamic theming with CSS custom properties
- **Utility Classes**: Tailwind for rapid styling
- **Component Variants**: ShadCN for consistent component styling

## 🎭 Demo Data

### Data Generation Script
The `scripts/seed-demo-data.js` file generates realistic demo data:

```javascript
// Generate 50 products across 6 categories
function generateProducts(count = 50) {
  // Random product generation with business logic
}

// Generate 100 sales orders with relationships
function generateSalesOrders(products, count = 100) {
  // Order generation with customer data
}

// Generate 30 employees across departments
function generateEmployees(count = 30) {
  // Employee data with realistic attributes
}
```

### Demo Dataset Summary
- **Users**: 1 demo user (admin role)
- **Products**: 50 items across Electronics, Furniture, Office Supplies, etc.
- **Sales Orders**: 100 orders from 16 customers
- **Purchase Orders**: 60 POs from 20 vendors
- **Employees**: 30 staff across 7 departments
- **Invoices**: 80 billing documents
- **Vendors**: 20 suppliers with contact information

### Data Relationships
- Orders link to products and customers
- Invoices reference orders and customers
- Purchase orders connect products to vendors
- Employees belong to departments

### Sample Data Characteristics
- **Dates**: Random dates within last 6-12 months
- **Prices**: Realistic ranges ($10-$2000)
- **Quantities**: Business-appropriate amounts
- **Names**: Generated using common name patterns
- **Categories**: Industry-standard classifications

## 💻 Development

### Development Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Seed demo data
npm run seed

# Check database connection
npm run check:db
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting (configure as needed)
- **Git Hooks**: Pre-commit hooks for quality checks

### Testing
Currently, the project uses manual testing. Future enhancements could include:
- Unit tests with Jest
- Integration tests with Playwright
- API tests with Supertest
- E2E tests with Cypress

### Debugging
- **Browser DevTools**: React DevTools for component debugging
- **Next.js DevTools**: Built-in debugging features
- **MongoDB Compass**: Database visualization and querying
- **Console Logging**: Extensive logging in API routes

## 🚢 Deployment

### Production Checklist
- [ ] Update MongoDB URI to production cluster
- [ ] Set strong JWT_SECRET environment variable
- [ ] Configure proper CORS settings
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies
- [ ] Update demo user credentials

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative hosting platform
- **Railway**: Full-stack deployment
- **AWS**: Scalable cloud infrastructure
- **Docker**: Containerized deployment

### Environment Configuration
```env
# Production Environment Variables
MONGODB_URI=mongodb+srv://prod-user:prod-pass@prod-cluster.mongodb.net/prod-db
JWT_SECRET=your-production-jwt-secret-key
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

### Build Optimization
- **Static Generation**: Dashboard metrics pre-rendered
- **Image Optimization**: Next.js automatic optimization
- **Bundle Analysis**: Analyze bundle size with `@next/bundle-analyzer`
- **CDN**: Static assets served via CDN

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Install dependencies: `pnpm install`
4. Set up environment variables
5. Run seed script: `npm run seed`
6. Start development: `npm run dev`

### Code Standards
- **TypeScript**: Strict typing required
- **Component Naming**: PascalCase for components
- **File Naming**: kebab-case for files
- **Commits**: Conventional commit messages
- **PRs**: Detailed description and testing

### Feature Requests
- Use GitHub Issues with "enhancement" label
- Provide detailed use case and requirements
- Include mockups or examples when possible

### Common Issues

#### Database Connection Issues
```
Error: MongoServerError: bad auth
```
**Solution**: Verify MongoDB credentials and network access

#### Authentication Problems
```
Error: Invalid credentials
```
**Solution**: Check email/password, ensure user exists in database

#### Build Failures
```
Error: Module not found
```
**Solution**: Run `npm install` or `pnpm install` to install dependencies

#### Theme Not Working
```
Dark mode not persisting
```
**Solution**: Check localStorage and theme provider configuration

### Performance Issues
- **Slow Loading**: Check MongoDB connection and indexes
- **Large Bundle**: Analyze with bundle analyzer tool
- **Memory Usage**: Monitor React DevTools for memory leaks

### Security Concerns
- **Exposed Credentials**: Never commit secrets to version control
- **Weak Passwords**: Use strong passwords in production
- **Unsecured APIs**: Implement proper authentication and authorization

---

## 📊 Project Statistics

- **Lines of Code**: ~15,000+ lines
- **Components**: 80+ reusable UI components
- **API Endpoints**: 15+ RESTful endpoints
- **Database Collections**: 7 collections
- **Demo Records**: 341 total records
- **Dependencies**: 40+ npm packages

## 🎯 Future Enhancements

### Planned Features
- [ ] Advanced search and filtering
- [ ] Bulk operations and imports
- [ ] Email notifications and alerts
- [ ] Multi-language support (i18n)
- [ ] Role-based permissions
- [ ] Audit logging
- [ ] API rate limiting
- [ ] Data export to Excel/PDF
- [ ] Mobile app companion
- [ ] Integration APIs (webhooks)
- [ ] Advanced analytics dashboard
- [ ] Workflow automation
- [ ] Custom report builder

### Technical Improvements
- [ ] Unit and integration tests
- [ ] Performance monitoring
- [ ] Caching layer (Redis)
- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] Container orchestration
- [ ] CI/CD pipelines

---

**Built with ❤️ by NafisRayan**

*Experience the future of business management with our comprehensive ERP solution.*