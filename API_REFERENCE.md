# ERP System API Reference

## Authentication Endpoints

### POST /api/auth/login
Authenticate user and return JWT token.

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

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "employee",
    "department": "General"
  },
  "token": "jwt_token_here"
}
```

## Inventory Management

### Products

#### GET /api/inventory/products
Get all products.

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
    "quantity": 50,
    "reorderLevel": 10,
    "supplier": "Supplier 1"
  }
]
```

#### POST /api/inventory/products
Create a new product.

**Request Body:**
```json
{
  "sku": "SKU-0001",
  "name": "Laptop Pro",
  "description": "High-performance laptop",
  "category": "Electronics",
  "price": 1299.99,
  "cost": 899.99,
  "quantity": 50,
  "reorderLevel": 10,
  "supplier": "Supplier 1"
}
```

#### GET /api/inventory/products/[id]
Get a specific product by ID.

#### PUT /api/inventory/products/[id]
Update a product.

#### DELETE /api/inventory/products/[id]
Delete a product.

#### POST /api/inventory/adjust-stock
Adjust product stock quantity.

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 10,
  "reason": "Restock"
}
```

## Sales Management

### Orders

#### GET /api/sales/orders
Get all sales orders (sorted by order date, newest first).

**Response:**
```json
[
  {
    "_id": "order_id",
    "orderNumber": "ORD-001",
    "customerName": "John Doe",
    "items": [
      {
        "productId": "product_id",
        "productName": "Laptop Pro",
        "quantity": 2,
        "unitPrice": 1299.99,
        "total": 2599.98
      }
    ],
    "totalAmount": 2599.98,
    "status": "pending",
    "orderDate": "2024-01-15T10:00:00Z",
    "dueDate": "2024-02-15T10:00:00Z"
  }
]
```

#### POST /api/sales/orders
Create a new sales order.

**Request Body:**
```json
{
  "orderNumber": "ORD-001",
  "customerName": "John Doe",
  "customerId": "customer_id",
  "items": [
    {
      "productId": "product_id",
      "productName": "Laptop Pro",
      "quantity": 2,
      "unitPrice": 1299.99,
      "total": 2599.98
    }
  ],
  "totalAmount": 2599.98,
  "dueDate": "2024-02-15"
}
```

#### GET /api/sales/orders/[id]
Get a specific order by ID.

#### PUT /api/sales/orders/[id]
Update an order.

#### DELETE /api/sales/orders/[id]
Delete an order.

## Purchasing Management

### Purchase Orders

#### GET /api/purchasing/purchase-orders
Get all purchase orders (sorted by order date, newest first).

#### POST /api/purchasing/purchase-orders
Create a new purchase order.

**Request Body:**
```json
{
  "poNumber": "PO-001",
  "vendorName": "Tech Supplies Inc",
  "vendorId": "vendor_id",
  "items": [
    {
      "productId": "product_id",
      "productName": "Laptop Pro",
      "quantity": 10,
      "unitPrice": 899.99,
      "total": 8999.90
    }
  ],
  "totalAmount": 8999.90,
  "expectedDelivery": "2024-02-01"
}
```

### Vendors

#### GET /api/purchasing/vendors
Get all vendors.

#### POST /api/purchasing/vendors
Create a new vendor.

**Request Body:**
```json
{
  "name": "Tech Supplies Inc",
  "email": "contact@techsupplies.com",
  "phone": "+1-555-0123",
  "address": "123 Tech Street",
  "city": "Tech City",
  "country": "USA",
  "paymentTerms": "Net 30",
  "rating": 4.5
}
```

## Human Resources

### Employees

#### GET /api/hr/employees
Get all employees.

**Response:**
```json
[
  {
    "_id": "employee_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "department": "Sales",
    "position": "Senior Sales Manager",
    "salary": 75000,
    "joinDate": "2023-06-01T00:00:00Z",
    "status": "active"
  }
]
```

#### POST /api/hr/employees
Create a new employee.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1-555-0123",
  "department": "Sales",
  "position": "Senior Sales Manager",
  "salary": 75000,
  "joinDate": "2023-06-01"
}
```

## Financial Management

### Invoices

#### GET /api/financial/invoices
Get all invoices (sorted by issue date, newest first).

#### POST /api/financial/invoices
Create a new invoice.

**Request Body:**
```json
{
  "invoiceNumber": "INV-001",
  "orderId": "order_id",
  "customerId": "customer_id",
  "customerName": "John Doe",
  "amount": 2599.98,
  "tax": 259.99,
  "dueDate": "2024-02-15"
}
```

**Note:** `total` is automatically calculated as `amount + tax`.

## Dashboard & Analytics

### GET /api/dashboard/metrics
Get dashboard metrics and KPIs.

**Response:**
```json
{
  "totalRevenue": 125000.50,
  "totalOrders": 150,
  "totalInventoryValue": 50000.00,
  "totalEmployees": 25,
  "pendingOrders": 12,
  "lowStockItems": 5,
  "totalProducts": 200,
  "revenueChangePercent": 15.5,
  "newHiresThisMonth": 3
}
```

## Reports

### GET /api/reports/summary
Get comprehensive business summary report.

**Response:**
```json
{
  "summary": {
    "totalRevenue": 125000.50,
    "totalExpenses": 75000.25,
    "profit": 50000.25,
    "totalInvoiced": 150000.00,
    "paidInvoices": 120,
    "pendingInvoices": 15,
    "totalPayroll": 250000.00,
    "activeEmployees": 25,
    "totalProducts": 200,
    "lowStockProducts": 5
  },
  "orders": {
    "total": 150,
    "pending": 12,
    "completed": 138
  },
  "purchaseOrders": {
    "total": 80,
    "pending": 8,
    "received": 72
  }
}
```

## Error Response Format

All API endpoints return errors in a consistent format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer your_jwt_token_here
```

## Data Types

### Common Field Types

- **ID fields**: MongoDB ObjectId (returned as string)
- **Dates**: ISO 8601 format strings
- **Numbers**: Float/Double values
- **Booleans**: true/false
- **Strings**: UTF-8 encoded text

### Status Enums

#### Order Status
- `pending`
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`

#### Purchase Order Status
- `draft`
- `sent`
- `received`
- `cancelled`

#### Invoice Status
- `draft`
- `sent`
- `paid`
- `overdue`

#### Employee Status
- `active`
- `inactive`
- `on-leave`

#### User Roles
- `admin`
- `manager`
- `employee`
- `viewer`

## Rate Limiting

API endpoints should implement rate limiting in production:
- Authentication endpoints: 5 requests per minute
- General API endpoints: 100 requests per minute
- Report endpoints: 20 requests per minute

## Pagination

For endpoints that may return large datasets, implement pagination:

```
GET /api/inventory/products?page=1&limit=50
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "pages": 5
  }
}
```</content>
<parameter name="filePath">c:\Users\BS00861\Documents\GitHub\ERP-ShadCN-NextJS\API_REFERENCE.md