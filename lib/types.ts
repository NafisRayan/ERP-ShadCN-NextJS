export interface User {
  _id?: string
  email: string
  password: string
  name: string
  role: "admin" | "manager" | "employee" | "viewer"
  department: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  _id?: string
  sku: string
  name: string
  description: string
  category: string
  price: number
  cost: number
  quantity: number
  reorderLevel: number
  supplier: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id?: string
  orderNumber: string
  customerId: string
  customerName: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  orderDate: Date
  dueDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface PurchaseOrder {
  _id?: string
  poNumber: string
  vendorId: string
  vendorName: string
  items: PurchaseOrderItem[]
  totalAmount: number
  status: "draft" | "sent" | "received" | "cancelled"
  orderDate: Date
  expectedDelivery: Date
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Vendor {
  _id?: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  paymentTerms: string
  rating: number
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  _id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position: string
  salary: number
  joinDate: Date
  status: "active" | "inactive" | "on-leave"
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  _id?: string
  invoiceNumber: string
  orderId: string
  customerId: string
  customerName: string
  amount: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue"
  issueDate: Date
  dueDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalInventoryValue: number
  totalEmployees: number
  pendingOrders: number
  lowStockItems: number
}
