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

interface PurchaseOrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

interface PurchaseOrder {
  _id: string
  poNumber: string
  vendorId: string
  vendorName: string
  items: PurchaseOrderItem[]
  totalAmount: number
  status: string
  orderDate: string
  expectedDelivery: string
  createdAt: string
  updatedAt: string
}

interface ViewPurchaseOrderDialogProps {
  poId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewPurchaseOrderDialog({ poId, open, onOpenChange }: ViewPurchaseOrderDialogProps) {
  const [po, setPo] = useState<PurchaseOrder | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (poId && open) {
      fetchPO()
    }
  }, [poId, open])

  const fetchPO = async () => {
    if (!poId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/purchasing/purchase-orders/${poId}`)
      const data = await response.json()
      setPo(data)
    } catch (error) {
      console.error("Failed to fetch purchase order:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500/20 text-gray-700",
      sent: "bg-blue-500/20 text-blue-700",
      received: "bg-green-500/20 text-green-700",
      cancelled: "bg-red-500/20 text-red-700",
    }
    return colors[status] || "bg-gray-500/20 text-gray-700"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Order Details</DialogTitle>
          <DialogDescription>
            View detailed information about this purchase order
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
        ) : po ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{po.poNumber}</h3>
                <p className="text-sm text-muted-foreground">{po.vendorName}</p>
              </div>
              <Badge className={getStatusColor(po.status)}>
                {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Order Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(po.orderDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Expected Delivery</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(po.expectedDelivery).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Vendor ID</label>
                  <p className="text-sm text-muted-foreground">{po.vendorId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Total Amount</label>
                  <p className="text-lg font-semibold">${po.totalAmount.toLocaleString()}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Items Count</label>
                  <p className="text-sm text-muted-foreground">{po.items.length} items</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(po.createdAt).toLocaleString()}
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
                    {po.items.map((item, index) => (
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
                {new Date(po.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Purchase order not found</p>
        )}
      </DialogContent>
    </Dialog>
  )
}