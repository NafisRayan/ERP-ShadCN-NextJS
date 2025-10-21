"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryTable } from "@/components/inventory-table"
import { AddProductDialog } from "@/components/add-product-dialog"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function InventoryPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [lowStockCount, setLowStockCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    const fetchLowStockCount = async () => {
      try {
        const response = await fetch("/api/inventory/products")
        const products = await response.json()
        const lowStock = products.filter((p: any) => p.quantity <= p.reorderLevel).length
        setLowStockCount(lowStock)
      } catch (error) {
        console.error("Failed to fetch low stock count:", error)
      }
    }

    fetchLowStockCount()
  }, [refreshTrigger])

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/inventory/products/${id}`, { method: "DELETE" })
      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        alert("Failed to delete product")
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("Failed to delete product")
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                <p className="text-muted-foreground mt-2">Manage your product inventory and stock levels</p>
              </div>
              <AddProductDialog onProductAdded={() => setRefreshTrigger((prev) => prev + 1)} />
            </div>

            {lowStockCount > 0 && (
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  {lowStockCount} product(s) are below reorder level. Consider placing purchase orders.
                </AlertDescription>
              </Alert>
            )}

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>All products in your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryTable
                  onEdit={(product) => console.log("Edit:", product)}
                  onDelete={handleDeleteProduct}
                  refreshTrigger={refreshTrigger}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
