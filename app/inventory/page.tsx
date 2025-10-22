"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryTable } from "@/components/inventory-table"
import { AddProductDialog } from "@/components/add-product-dialog"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Inventory Management
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Manage your product inventory and stock levels
              </p>
            </div>
            <AddProductDialog onProductAdded={() => setRefreshTrigger((prev) => prev + 1)} />
          </div>

          {lowStockCount > 0 && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10 dark:bg-yellow-500/5">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              <AlertTitle className="text-yellow-700 dark:text-yellow-400">
                Low Stock Warning
              </AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-400/90">
                {lowStockCount} product(s) are below reorder level. Consider placing purchase orders.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Products</CardTitle>
              <CardDescription>All products in your inventory</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <InventoryTable
                onEdit={(product) => console.log("Edit:", product)}
                onDelete={handleDeleteProduct}
                refreshTrigger={refreshTrigger}
              />
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
