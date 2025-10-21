"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface PurchaseOrder {
  _id: string
  poNumber: string
  vendorName: string
  totalAmount: number
  status: string
  orderDate: string
}

interface PurchaseOrdersTableProps {
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: string) => void
  refreshTrigger: number
}

export function PurchaseOrdersTable({ onDelete, onStatusChange, refreshTrigger }: PurchaseOrdersTableProps) {
  const [pos, setPos] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const response = await fetch("/api/purchasing/purchase-orders")
        const data = await response.json()
        setPos(data)
      } catch (error) {
        console.error("Failed to fetch purchase orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPOs()
  }, [refreshTrigger])

  const filteredPOs = pos.filter(
    (p) =>
      p.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500/20 text-gray-700",
      sent: "bg-blue-500/20 text-blue-700",
      received: "bg-green-500/20 text-green-700",
      cancelled: "bg-red-500/20 text-red-700",
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
        placeholder="Search by PO number or vendor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.map((po) => (
              <TableRow key={po._id}>
                <TableCell className="font-medium">{po.poNumber}</TableCell>
                <TableCell>{po.vendorName}</TableCell>
                <TableCell>${po.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Select value={po.status} onValueChange={(status) => onStatusChange(po._id, status)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(po.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(po._id)}>
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
