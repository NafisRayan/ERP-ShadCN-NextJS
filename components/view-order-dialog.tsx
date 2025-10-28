"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

interface Order {
  _id: string
  orderNumber: string
  customerId: string
  customerName: string
  items: OrderItem[]
  totalAmount: number
  status: string
  orderDate: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

interface ViewOrderDialogProps {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewOrderDialog({ orderId, open, onOpenChange }: ViewOrderDialogProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (orderId && open) {
      fetchOrder()
    }
  }, [orderId, open])

  const fetchOrder = async () => {
    if (!orderId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/sales/orders/${orderId}`)
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error("Failed to fetch order:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-700",
      confirmed: "bg-blue-500/20 text-blue-700",
      shipped: "bg-purple-500/20 text-purple-700",
      delivered: "bg-green-500/20 text-green-700",
      cancelled: "bg-red-500/20 text-red-700",
    }
    return colors[status] || "bg-gray-500/20 text-gray-700"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View detailed information about this sales order
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                <p className="text-sm text-muted-foreground">{order.customerName}</p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Order Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Customer ID</label>
                  <p className="text-sm text-muted-foreground">{order.customerId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Total Amount</label>
                  <p className="text-lg font-semibold">${order.totalAmount.toLocaleString()}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Items Count</label>
                  <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Order Items</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${Number(item.unitPrice || 0).toFixed(2)}</TableCell>
                        <TableCell className="text-right">${Number(item.total || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium">Last Updated</label>
              <p className="text-sm text-muted-foreground">
                {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Order not found</p>
        )}
      </DialogContent>
    </Dialog>
  )
}