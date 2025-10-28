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

interface Invoice {
  _id: string
  invoiceNumber: string
  orderId: string
  customerId: string
  customerName: string
  amount: number
  tax: number
  total: number
  status: string
  issueDate: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

interface ViewInvoiceDialogProps {
  invoiceId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewInvoiceDialog({ invoiceId, open, onOpenChange }: ViewInvoiceDialogProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (invoiceId && open) {
      fetchInvoice()
    }
  }, [invoiceId, open])

  const fetchInvoice = async () => {
    if (!invoiceId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/financial/invoices/${invoiceId}`)
      const data = await response.json()
      setInvoice(data)
    } catch (error) {
      console.error("Failed to fetch invoice:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500/20 text-gray-700",
      sent: "bg-blue-500/20 text-blue-700",
      paid: "bg-green-500/20 text-green-700",
      overdue: "bg-red-500/20 text-red-700",
    }
    return colors[status] || "bg-gray-500/20 text-gray-700"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>
            View detailed information about this invoice
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
        ) : invoice ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{invoice.invoiceNumber}</h3>
                <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
              </div>
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Issue Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Order ID</label>
                  <p className="text-sm text-muted-foreground">{invoice.orderId}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Customer ID</label>
                  <p className="text-sm text-muted-foreground">{invoice.customerId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subtotal</label>
                  <p className="text-sm text-muted-foreground">${Number(invoice.amount || 0).toFixed(2)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Tax</label>
                  <p className="text-sm text-muted-foreground">${Number(invoice.tax || 0).toFixed(2)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Total Amount</label>
                  <p className="text-lg font-semibold">${Number(invoice.total || 0).toFixed(2)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Invoice Summary</h4>
              <div className="rounded-md border p-4 bg-muted/30">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Invoice Number:</span>
                    <span className="font-medium">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium">{invoice.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Issue Date:</span>
                    <span className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="outline" className={getStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t">
                    <span>Total:</span>
                    <span>${Number(invoice.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium">Last Updated</label>
              <p className="text-sm text-muted-foreground">
                {new Date(invoice.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Invoice not found</p>
        )}
      </DialogContent>
    </Dialog>
  )
}