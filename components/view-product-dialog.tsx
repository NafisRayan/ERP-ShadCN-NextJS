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

interface Product {
  _id: string
  sku: string
  name: string
  description: string
  category: string
  price: number
  cost: number
  quantity: number
  reorderLevel: number
  supplier: string
  createdAt: string
  updatedAt: string
}

interface ViewProductDialogProps {
  productId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewProductDialog({ productId, open, onOpenChange }: ViewProductDialogProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (productId && open) {
      fetchProduct()
    }
  }, [productId, open])

  const fetchProduct = async () => {
    if (!productId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/inventory/products/${productId}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error("Failed to fetch product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            View detailed information about this product
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
        ) : product ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.sku}</p>
              </div>
              <Badge variant={product.quantity <= product.reorderLevel ? "destructive" : "default"}>
                {product.quantity <= product.reorderLevel ? "Low Stock" : "In Stock"}
              </Badge>
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground">{product.description}</p>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p className="text-sm text-muted-foreground">
                    <Badge variant="outline">{product.category}</Badge>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Supplier</label>
                  <p className="text-sm text-muted-foreground">{product.supplier}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <p className="text-sm text-muted-foreground">${Number(product.price || 0).toFixed(2)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Cost</label>
                  <p className="text-sm text-muted-foreground">${Number(product.cost || 0).toFixed(2)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <p className="text-sm text-muted-foreground">{product.quantity} units</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Reorder Level</label>
                  <p className="text-sm text-muted-foreground">{product.reorderLevel} units</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium">Last Updated</label>
              <p className="text-sm text-muted-foreground">
                {new Date(product.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Product not found</p>
        )}
      </DialogContent>
    </Dialog>
  )
}