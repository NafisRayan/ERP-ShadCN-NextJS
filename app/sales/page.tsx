"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesMetrics } from "@/components/sales-metrics"
import { OrdersTable } from "@/components/orders-table"
import { CreateOrderDialog } from "@/components/create-order-dialog"

export default function SalesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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
        alert("Failed to delete order")
      }
    } catch (error) {
      console.error("Failed to delete order:", error)
      alert("Failed to delete order")
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
        alert("Failed to update order status")
      }
    } catch (error) {
      console.error("Failed to update order status:", error)
      alert("Failed to update order status")
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
                <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
                <p className="text-muted-foreground mt-2">Manage customer orders and track shipments</p>
              </div>
              <CreateOrderDialog onOrderCreated={() => setRefreshTrigger((prev) => prev + 1)} />
            </div>

            <SalesMetrics refreshTrigger={refreshTrigger} />

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>All sales orders</CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTable
                  onDelete={handleDeleteOrder}
                  onStatusChange={handleStatusChange}
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
