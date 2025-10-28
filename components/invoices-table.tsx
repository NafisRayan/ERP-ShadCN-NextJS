"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Invoice {
  _id: string
  invoiceNumber: string
  customerName: string
  total: number
  status: string
  issueDate: string
  dueDate: string
}

interface InvoicesTableProps {
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: string) => void
  onView?: (invoiceId: string) => void
  onDownload?: (invoiceId: string) => void
  refreshTrigger: number
}

export function InvoicesTable({ onDelete, onStatusChange, onView, onDownload, refreshTrigger }: InvoicesTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/financial/invoices")
        const data = await response.json()
        setInvoices(data)
      } catch (error) {
        console.error("Failed to fetch invoices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [refreshTrigger])

  const filteredInvoices = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500/20 text-gray-700",
      sent: "bg-blue-500/20 text-blue-700",
      paid: "bg-green-500/20 text-green-700",
      overdue: "bg-red-500/20 text-red-700",
    }
    return colors[status] || "bg-gray-500/20 text-gray-700"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by invoice number or customer..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>${invoice.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Select value={invoice.status} onValueChange={(status) => onStatusChange(invoice._id, status)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(invoice._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onDownload && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(invoice._id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onDelete(invoice._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
