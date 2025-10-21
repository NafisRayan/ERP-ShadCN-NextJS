"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface CreateOrderDialogProps {
  onOrderCreated: () => void
}

export function CreateOrderDialog({ onOrderCreated }: CreateOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    orderNumber: "",
    customerName: "",
    customerId: "",
    selectedProduct: "",
    quantity: "1",
    items: [] as any[],
    dueDate: "",
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory/products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen])

  const handleAddItem = () => {
    if (!formData.selectedProduct || !formData.quantity) return

    const product = products.find((p) => p._id === formData.selectedProduct)
    if (!product) return

    const newItem = {
      productId: product._id,
      productName: product.name,
      quantity: Number(formData.quantity),
      unitPrice: product.price,
      total: Number(formData.quantity) * product.price,
    }

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
      selectedProduct: "",
      quantity: "1",
    })
  }

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = async () => {
    if (!formData.orderNumber || !formData.customerName || formData.items.length === 0) {
      alert("Please fill in all required fields and add at least one item")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/sales/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalAmount,
        }),
      })

      if (response.ok) {
        setFormData({
          orderNumber: "",
          customerName: "",
          customerId: "",
          selectedProduct: "",
          quantity: "1",
          items: [],
          dueDate: "",
        })
        setIsOpen(false)
        onOrderCreated()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Failed to create order:", error)
      alert("Failed to create order")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Sales Order</DialogTitle>
          <DialogDescription>Enter order details and add items</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Order Number *</Label>
              <Input
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                placeholder="ORD-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Customer Name *</Label>
            <Input
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Customer name"
            />
          </div>

          <div className="space-y-2">
            <Label>Customer ID</Label>
            <Input
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              placeholder="Optional"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select
                    value={formData.selectedProduct}
                    onValueChange={(value) => setFormData({ ...formData, selectedProduct: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddItem} className="w-full">
                    Add
                  </Button>
                </div>
              </div>

              {formData.items.length > 0 && (
                <div className="bg-muted/50 p-3 rounded space-y-2">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <div className="flex gap-2 items-center">
                        <span>${item.total.toFixed(2)}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(idx)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-semibold">Total: ${totalAmount.toFixed(2)}</div>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
