# Demo Data Guide

## Overview
This guide explains how to populate your ERP system with realistic demo data for testing and demonstration purposes.

## Demo User Credentials

```
Email:    demo@example.com
Password: demo123
```

## What Gets Created

The demo data seeding script creates a complete, realistic dataset:

### 📦 Products (50 items)
- Electronics (Laptops, Monitors, Keyboards, etc.)
- Furniture (Chairs, Desks, Filing Cabinets)
- Office Supplies (Paper, Pens, Folders)
- Hardware & Equipment
- Various categories with realistic pricing
- Stock levels and reorder points
- SKU codes (SKU-0001 to SKU-0050)

### 👥 Employees (30 people)
- Various departments: Sales, Marketing, IT, HR, Finance, Operations
- Different positions: Manager, Specialist, Coordinator, etc.
- Realistic salaries ($40,000 - $150,000)
- Active and on-leave statuses
- Hire dates spanning multiple years

### 🏢 Vendors (20 companies)
- Tech companies, office suppliers, furniture vendors
- Contact information and addresses
- Payment terms (Net 30, Net 45, Net 60)
- Vendor ratings (3-5 stars)
- International vendors from multiple countries

### 🛒 Sales Orders (100 orders)
- Orders from 16 different customers
- Multiple line items per order
- Various statuses: pending, confirmed, shipped, delivered, cancelled
- Order numbers: ORD-00001 to ORD-00100
- Realistic order dates over the past 6 months
- Total values ranging from hundreds to thousands

### 📋 Purchase Orders (60 orders)
- Orders to various vendors
- Multiple products per PO
- Statuses: draft, sent, received, cancelled
- PO numbers: PO-00001 to PO-00060
- Expected delivery dates
- Bulk quantities and wholesale pricing

### 💰 Invoices (80 invoices)
- Linked to sales orders
- 8% tax calculation
- Various statuses: draft, sent, paid, overdue
- Invoice numbers: INV-00001 to INV-00080
- 30-day payment terms
- Issue and due dates

## How to Run

### Prerequisites
- Node.js installed
- MongoDB running
- Environment variables configured

### Method 1: Using npm script (Recommended)
```bash
npm run seed
```

or

```bash
npm run seed:demo
```

### Method 2: Direct execution
```bash
node scripts/seed-demo-data.js
```

### Method 3: With custom MongoDB URI
```bash
MONGODB_URI="mongodb://localhost:27017/your-db" npm run seed
```

## What Happens During Seeding

1. **Connects to MongoDB**
   - Uses `MONGODB_URI` from environment or defaults to localhost

2. **Clears Existing Data** (Optional)
   - Removes all products, employees, vendors, orders, purchase orders, and invoices
   - Comment out this section in the script if you want to keep existing data

3. **Generates Realistic Data**
   - Creates products with proper SKUs and pricing
   - Generates employees with realistic names and salaries
   - Creates vendors with contact information
   - Generates interconnected orders and invoices

4. **Inserts into Database**
   - Bulk inserts for better performance
   - Maintains referential integrity

5. **Shows Summary**
   - Displays count of each data type created
   - Shows demo user credentials

## Expected Output

```
🌱 Starting demo data seeding...

✅ Connected to MongoDB

🗑️  Clearing existing demo data...
✅ Cleared existing data

📦 Generating products...
✅ Inserted 50 products

👥 Generating employees...
✅ Inserted 30 employees

🏢 Generating vendors...
✅ Inserted 20 vendors

🛒 Generating sales orders...
✅ Inserted 100 sales orders

📋 Generating purchase orders...
✅ Inserted 60 purchase orders

💰 Generating invoices...
✅ Inserted 80 invoices

📊 Demo Data Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Products:         50
Employees:        30
Vendors:          20
Sales Orders:     100
Purchase Orders:  60
Invoices:         80
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Demo data seeding completed successfully!

📝 Demo User Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:    demo@example.com
Password: demo123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👋 Database connection closed
```

## Data Characteristics

### Realistic Patterns
- **Dates**: Spread over the past 6 months
- **Prices**: Range from $10 to $2,000
- **Quantities**: Realistic stock levels (0-500 units)
- **Statuses**: Mix of pending, completed, and cancelled items
- **Relationships**: Orders reference actual products and vendors

### Business Logic
- **Profit Margins**: Products have 40% markup (cost vs price)
- **Reorder Levels**: Set between 10-50 units
- **Payment Terms**: Standard business terms (Net 30/45/60)
- **Tax Calculation**: 8% sales tax on invoices
- **Order Values**: Realistic totals based on quantity × price

### Data Distribution
- **Active Employees**: 90% active, 10% on leave
- **Order Statuses**: Weighted towards completed orders
- **Invoice Statuses**: Mix of paid, pending, and overdue
- **Vendor Ratings**: Mostly 4-5 stars (good vendors)

## Using the Demo Data

### 1. Login
```
Email: demo@example.com
Password: demo123
```

### 2. Explore Dashboard
- View metrics with real numbers
- See charts with actual data
- Check recent activity

### 3. Browse Inventory
- 50 products across multiple categories
- Some items with low stock (triggers alerts)
- Realistic pricing and quantities

### 4. Review Orders
- 100 sales orders in various stages
- Track order fulfillment
- View order details and line items

### 5. Check Financials
- 80 invoices with different statuses
- Some overdue invoices (for testing)
- Revenue and expense tracking

### 6. Manage HR
- 30 employees across departments
- Payroll calculations
- Department distribution

### 7. Purchasing
- 60 purchase orders
- Vendor management
- Procurement tracking

## Customization

### Adjust Quantities
Edit the script to change how much data is generated:

```javascript
const products = generateProducts(50)      // Change 50 to desired count
const employees = generateEmployees(30)    // Change 30 to desired count
const vendors = generateVendors(20)        // Change 20 to desired count
const orders = generateSalesOrders(products, 100)  // Change 100
const purchaseOrders = generatePurchaseOrders(products, vendors, 60)  // Change 60
const invoices = generateInvoices(orders, 80)  // Change 80
```

### Modify Date Range
Change the `randomDate()` parameter:

```javascript
randomDate(180)  // Last 180 days (6 months)
randomDate(365)  // Last 365 days (1 year)
randomDate(30)   // Last 30 days (1 month)
```

### Add Custom Data
Extend the arrays in the script:

```javascript
const categories = ['Electronics', 'Furniture', 'Your Category']
const departments = ['Sales', 'Marketing', 'Your Department']
```

### Keep Existing Data
Comment out the clearing section:

```javascript
// await db.collection('products').deleteMany({})
// await db.collection('employees').deleteMany({})
// ... etc
```

## Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running
```bash
# Start MongoDB
mongod
# or with Docker
docker start mongodb
```

### Permission Error
```
Error: not authorized
```
**Solution**: Check MongoDB authentication settings or use correct credentials

### Module Not Found
```
Error: Cannot find module 'mongodb'
```
**Solution**: Install dependencies
```bash
npm install
```

### Database Not Found
The script will create collections automatically if they don't exist.

## Best Practices

### For Development
1. Run seed script after setting up the database
2. Re-run when you need fresh data
3. Use for testing new features

### For Demos
1. Seed before client presentations
2. Ensure data looks realistic
3. Have a variety of statuses to show workflows

### For Testing
1. Seed with known data for automated tests
2. Use consistent data for reproducible tests
3. Clear and re-seed between test runs

## Data Integrity

The script maintains referential integrity:
- ✅ Orders reference actual products
- ✅ Purchase orders reference actual vendors
- ✅ Invoices link to sales orders
- ✅ All dates are logical (order before delivery)
- ✅ Prices and totals are calculated correctly

## Performance

- **Seeding Time**: ~2-5 seconds
- **Database Size**: ~2-5 MB
- **Memory Usage**: Minimal
- **Bulk Inserts**: Used for efficiency

## Security Note

⚠️ **Important**: This is demo data only!
- Don't use in production with real data
- Demo password is intentionally simple
- Clear demo data before going live
- Use strong passwords for real users

## Next Steps

After seeding:
1. ✅ Login with demo credentials
2. ✅ Explore all modules
3. ✅ Test workflows
4. ✅ Verify calculations
5. ✅ Check reports and analytics
6. ✅ Test responsive design
7. ✅ Verify dark mode

## Support

If you encounter issues:
1. Check MongoDB is running
2. Verify environment variables
3. Check console output for errors
4. Review MongoDB logs
5. Ensure sufficient disk space

## Summary

The demo data seeding script provides:
- ✅ 340+ database records
- ✅ Realistic business data
- ✅ Interconnected relationships
- ✅ Various statuses and scenarios
- ✅ Ready-to-use demo environment
- ✅ Professional presentation data

Perfect for demonstrations, testing, and development!
