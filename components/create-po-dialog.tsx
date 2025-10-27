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

interface CreatePODialogProps {
  onPOCreated: () => void
}

export function CreatePODialog({ onPOCreated }: CreatePODialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    poNumber: "",
    vendorId: "",
    vendorName: "",
    selectedProduct: "",
    quantity: "1",
    items: [] as any[],
    expectedDelivery: "",
  })

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [vendorsRes, productsRes] = await Promise.all([
            fetch("/api/purchasing/vendors"),
            fetch("/api/inventory/products"),
          ])
          setVendors(await vendorsRes.json())
          setProducts(await productsRes.json())
        } catch (error) {
          console.error("Failed to fetch data:", error)
        }
      }
      fetchData()
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
      unitPrice: product.cost || product.price,
      total: Number(formData.quantity) * (product.cost || product.price),
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
    if (!formData.poNumber || !formData.vendorName || formData.items.length === 0) {
      alert("Please fill in all required fields and add at least one item")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/purchasing/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalAmount,
        }),
      })

      if (response.ok) {
        setFormData({
          poNumber: "",
          vendorId: "",
          vendorName: "",
          selectedProduct: "",
          quantity: "1",
          items: [],
          expectedDelivery: "",
        })
        setIsOpen(false)
        onPOCreated()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create PO")
      }
    } catch (error) {
      console.error("Failed to create PO:", error)
      alert("Failed to create PO")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New PO
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>Enter purchase order details and add items</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PO Number *</Label>
              <Input
                value={formData.poNumber}
                onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                placeholder="PO-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Delivery</Label>
              <Input
                type="date"
                value={formData.expectedDelivery}
                onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vendor *</Label>
            <Select
              value={formData.vendorId}
              onValueChange={(value) => {
                const vendor = vendors.find((v) => v._id === value)
                setFormData({
                  ...formData,
                  vendorId: value,
                  vendorName: vendor?.name || "",
                })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor._id} value={vendor._id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">PO Items</h3>
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
                        <span>${Number(item.total || 0).toFixed(2)}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(idx)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-semibold">Total: ${Number(totalAmount || 0).toFixed(2)}</div>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create PO"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
