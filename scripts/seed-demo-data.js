/**
 * Demo Data Seeding Script
 * Populates the database with realistic demo data for demo@example.com
 * Run with: node scripts/seed-demo-data.js
 */

const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb+srv://vaugheu:tempA@cluster0.yfpgp8o.mongodb.net/erp-system?retryWrites=true&w=majority&appName=Cluster0'

// Demo user credentials
const DEMO_USER = {
  email: 'demo@example.com',
  password: 'demo123', // Will be hashed
  name: 'Demo User',
  department: 'Management',
  role: 'admin'
}

// Sample data generators
const categories = ['Electronics', 'Furniture', 'Office Supplies', 'Hardware', 'Software', 'Equipment']
const departments = ['Sales', 'Marketing', 'IT', 'HR', 'Finance', 'Operations', 'Customer Service']
const positions = ['Manager', 'Senior Specialist', 'Specialist', 'Coordinator', 'Assistant', 'Director']
const statuses = {
  order: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  invoice: ['draft', 'sent', 'paid', 'overdue'],
  po: ['draft', 'sent', 'received', 'cancelled']
}

// Generate random date within last N days
function randomDate(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date
}

// Generate random number in range
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate random price
function randomPrice(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

// Generate Products
function generateProducts(count = 50) {
  const products = []
  const productNames = [
    'Laptop', 'Desktop Computer', 'Monitor', 'Keyboard', 'Mouse', 'Printer',
    'Office Chair', 'Desk', 'Filing Cabinet', 'Whiteboard', 'Projector',
    'Tablet', 'Smartphone', 'Headphones', 'Webcam', 'Router', 'Switch',
    'Server', 'Hard Drive', 'SSD', 'RAM Module', 'Graphics Card',
    'Conference Phone', 'Scanner', 'Shredder', 'Laminator', 'Stapler',
    'Paper Ream', 'Toner Cartridge', 'USB Cable', 'HDMI Cable', 'Power Strip',
    'Desk Lamp', 'Ergonomic Mat', 'Monitor Stand', 'Laptop Stand',
    'Docking Station', 'External Battery', 'Surge Protector', 'Label Maker',
    'Calculator', 'Notebook', 'Pen Set', 'Marker Set', 'Sticky Notes',
    'Binder', 'Folder', 'Envelope Pack', 'Tape Dispenser', 'Scissors'
  ]

  for (let i = 0; i < count; i++) {
    const name = productNames[i % productNames.length]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const price = randomPrice(10, 2000)
    const cost = price * 0.6 // 40% margin
    const quantity = randomNum(0, 500)
    const reorderLevel = randomNum(10, 50)

    products.push({
      sku: `SKU-${String(i + 1).padStart(4, '0')}`,
      name: `${name} ${category === 'Electronics' ? 'Pro' : category === 'Furniture' ? 'Deluxe' : 'Standard'}`,
      description: `High-quality ${name.toLowerCase()} for professional use`,
      category,
      price,
      cost,
      quantity,
      reorderLevel,
      supplier: `Supplier ${randomNum(1, 10)}`,
      createdAt: randomDate(180),
      updatedAt: new Date()
    })
  }

  return products
}

// Generate Employees
function generateEmployees(count = 30) {
  const employees = []
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary',
    'William', 'Patricia', 'Richard', 'Jennifer', 'Thomas', 'Linda', 'Charles', 'Barbara', 'Daniel', 'Susan']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const department = departments[Math.floor(Math.random() * departments.length)]
    const position = positions[Math.floor(Math.random() * positions.length)]
    const salary = randomNum(40000, 150000)

    employees.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      position,
      salary,
      status: Math.random() > 0.1 ? 'active' : 'on-leave',
      hireDate: randomDate(1000),
      createdAt: randomDate(365),
      updatedAt: new Date()
    })
  }

  return employees
}

// Generate Vendors
function generateVendors(count = 20) {
  const vendors = []
  const companyTypes = ['Tech', 'Office', 'Furniture', 'Supply', 'Equipment', 'Solutions', 'Systems', 'Industries']
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia']

  for (let i = 0; i < count; i++) {
    const companyName = `${companyTypes[Math.floor(Math.random() * companyTypes.length)]} ${['Global', 'International', 'Corp', 'Inc', 'LLC'][Math.floor(Math.random() * 5)]}`
    const city = cities[Math.floor(Math.random() * cities.length)]
    const country = countries[Math.floor(Math.random() * countries.length)]

    vendors.push({
      name: companyName,
      email: `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1-${randomNum(200, 999)}-${randomNum(200, 999)}-${randomNum(1000, 9999)}`,
      address: `${randomNum(100, 9999)} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine'][Math.floor(Math.random() * 5)]} Street`,
      city,
      country,
      paymentTerms: ['Net 30', 'Net 45', 'Net 60', 'Due on Receipt'][Math.floor(Math.random() * 4)],
      rating: randomNum(3, 5),
      createdAt: randomDate(365),
      updatedAt: new Date()
    })
  }

  return vendors
}

// Generate Sales Orders
function generateSalesOrders(products, count = 100) {
  const orders = []
  const customers = [
    'Acme Corporation', 'TechStart Inc', 'Global Solutions', 'Innovation Labs',
    'Enterprise Systems', 'Digital Dynamics', 'Smart Industries', 'Future Tech',
    'Quantum Corp', 'Nexus Solutions', 'Apex Industries', 'Vertex Systems',
    'Pinnacle Group', 'Summit Enterprises', 'Horizon Tech', 'Zenith Corp'
  ]

  for (let i = 0; i < count; i++) {
    const orderDate = randomDate(180)
    const itemCount = randomNum(1, 5)
    const items = []
    let totalAmount = 0

    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = randomNum(1, 10)
      const unitPrice = product.price
      const total = quantity * unitPrice

      items.push({
        productId: product.sku,
        productName: product.name,
        quantity,
        unitPrice,
        total
      })

      totalAmount += total
    }

    orders.push({
      orderNumber: `ORD-${String(i + 1).padStart(5, '0')}`,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      customerId: `CUST-${randomNum(1000, 9999)}`,
      items,
      totalAmount,
      status: statuses.order[Math.floor(Math.random() * statuses.order.length)],
      orderDate,
      dueDate: new Date(orderDate.getTime() + randomNum(7, 30) * 24 * 60 * 60 * 1000),
      createdAt: orderDate,
      updatedAt: new Date()
    })
  }

  return orders
}

// Generate Purchase Orders
function generatePurchaseOrders(products, vendors, count = 60) {
  const pos = []

  for (let i = 0; i < count; i++) {
    const orderDate = randomDate(180)
    const vendor = vendors[Math.floor(Math.random() * vendors.length)]
    const itemCount = randomNum(1, 5)
    const items = []
    let totalAmount = 0

    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = randomNum(10, 100)
      const unitPrice = product.cost
      const total = quantity * unitPrice

      items.push({
        productId: product.sku,
        productName: product.name,
        quantity,
        unitPrice,
        total
      })

      totalAmount += total
    }

    pos.push({
      poNumber: `PO-${String(i + 1).padStart(5, '0')}`,
      vendorId: vendor.name,
      vendorName: vendor.name,
      items,
      totalAmount,
      status: statuses.po[Math.floor(Math.random() * statuses.po.length)],
      orderDate,
      expectedDelivery: new Date(orderDate.getTime() + randomNum(14, 60) * 24 * 60 * 60 * 1000),
      createdAt: orderDate,
      updatedAt: new Date()
    })
  }

  return pos
}

// Generate Invoices
function generateInvoices(orders, count = 80) {
  const invoices = []

  for (let i = 0; i < count; i++) {
    const order = orders[Math.floor(Math.random() * orders.length)]
    const issueDate = randomDate(180)
    const amount = order.totalAmount
    const tax = amount * 0.08 // 8% tax
    const total = amount + tax

    invoices.push({
      invoiceNumber: `INV-${String(i + 1).padStart(5, '0')}`,
      customerName: order.customerName,
      customerId: order.customerId,
      amount,
      tax,
      total,
      status: statuses.invoice[Math.floor(Math.random() * statuses.invoice.length)],
      issueDate,
      dueDate: new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      createdAt: issueDate,
      updatedAt: new Date()
    })
  }

  return invoices
}

// Main seeding function
async function seedDemoData() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('🌱 Starting demo data seeding...\n')
    await client.connect()
    console.log('✅ Connected to MongoDB\n')

    const db = client.db()

    // Clear existing demo data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing demo data...')
    await db.collection('products').deleteMany({})
    await db.collection('employees').deleteMany({})
    await db.collection('vendors').deleteMany({})
    await db.collection('orders').deleteMany({})
    await db.collection('purchaseOrders').deleteMany({})
    await db.collection('invoices').deleteMany({})
    await db.collection('users').deleteMany({ email: DEMO_USER.email })
    console.log('✅ Cleared existing data\n')

    // Create demo user
    console.log('👤 Creating demo user...')
    const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10)
    const demoUser = {
      email: DEMO_USER.email,
      password: hashedPassword,
      name: DEMO_USER.name,
      role: DEMO_USER.role,
      department: DEMO_USER.department,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.collection('users').insertOne(demoUser)
    console.log('✅ Created demo user\n')

    // Generate and insert data
    console.log('📦 Generating products...')
    const products = generateProducts(50)
    await db.collection('products').insertMany(products)
    console.log(`✅ Inserted ${products.length} products\n`)

    console.log('👥 Generating employees...')
    const employees = generateEmployees(30)
    await db.collection('employees').insertMany(employees)
    console.log(`✅ Inserted ${employees.length} employees\n`)

    console.log('🏢 Generating vendors...')
    const vendors = generateVendors(20)
    await db.collection('vendors').insertMany(vendors)
    console.log(`✅ Inserted ${vendors.length} vendors\n`)

    console.log('🛒 Generating sales orders...')
    const orders = generateSalesOrders(products, 100)
    await db.collection('orders').insertMany(orders)
    console.log(`✅ Inserted ${orders.length} sales orders\n`)

    console.log('📋 Generating purchase orders...')
    const purchaseOrders = generatePurchaseOrders(products, vendors, 60)
    await db.collection('purchaseOrders').insertMany(purchaseOrders)
    console.log(`✅ Inserted ${purchaseOrders.length} purchase orders\n`)

    console.log('💰 Generating invoices...')
    const invoices = generateInvoices(orders, 80)
    await db.collection('invoices').insertMany(invoices)
    console.log(`✅ Inserted ${invoices.length} invoices\n`)

    // Summary
    console.log('📊 Demo Data Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Demo User:        1`)
    console.log(`Products:         ${products.length}`)
    console.log(`Employees:        ${employees.length}`)
    console.log(`Vendors:          ${vendors.length}`)
    console.log(`Sales Orders:     ${orders.length}`)
    console.log(`Purchase Orders:  ${purchaseOrders.length}`)
    console.log(`Invoices:         ${invoices.length}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('🎉 Demo data seeding completed successfully!')
    console.log('\n📝 Demo User Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:    demo@example.com')
    console.log('Password: demo123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

// Run the seeding
if (require.main === module) {
  seedDemoData()
}

module.exports = { seedDemoData }
