"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesMetrics } from "@/components/sales-metrics"
import { OrdersTable } from "@/components/orders-table"
import { CreateOrderDialog } from "@/components/create-order-dialog"
import { ViewOrderDialog } from "@/components/view-order-dialog"

export default function SalesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [viewOrderId, setViewOrderId] = useState<string | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return

    try {
      const response = await fetch(`/api/sales/orders/${id}`, { method: "DELETE" })
      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Failed to delete order")
      }
    } catch (error) {
      console.error("Failed to delete order:", error)
      alert("Network error: Failed to delete order")
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/sales/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Failed to update order status")
      }
    } catch (error) {
      console.error("Failed to update order status:", error)
      alert("Network error: Failed to update order status")
    }
  }

  const handleViewOrder = (orderId: string) => {
    setViewOrderId(orderId)
    setViewDialogOpen(true)
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
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sales Orders</h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Manage customer orders and track shipments
              </p>
            </div>
            <CreateOrderDialog onOrderCreated={() => setRefreshTrigger((prev) => prev + 1)} />
          </div>

          <SalesMetrics refreshTrigger={refreshTrigger} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Orders</CardTitle>
              <CardDescription>All sales orders</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <OrdersTable
                onDelete={handleDeleteOrder}
                onStatusChange={handleStatusChange}
                onView={handleViewOrder}
                refreshTrigger={refreshTrigger}
              />
            </CardContent>
          </Card>
        </main>
      </SidebarInset>

      <ViewOrderDialog
        orderId={viewOrderId}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </SidebarProvider>
  )
}
