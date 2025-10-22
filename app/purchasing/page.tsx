"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PurchaseOrdersTable } from "@/components/purchase-orders-table"
import { VendorsTable } from "@/components/vendors-table"
import { CreatePODialog } from "@/components/create-po-dialog"
import { AddVendorDialog } from "@/components/add-vendor-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function PurchasingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [metrics, setMetrics] = useState({ totalPOs: 0, draftPOs: 0, totalSpend: 0, receivedPOs: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/purchasing/purchase-orders")
        const pos = await response.json()

        const totalPOs = pos.length
        const draftPOs = pos.filter((p: any) => p.status === "draft").length
        const receivedPOs = pos.filter((p: any) => p.status === "received").length
        const totalSpend = pos.reduce((sum: number, p: any) => sum + (p.totalAmount || 0), 0)

        setMetrics({ totalPOs, draftPOs, totalSpend, receivedPOs })
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [refreshTrigger])

  const handleDeletePO = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PO?")) return

    try {
      const response = await fetch(`/api/purchasing/purchase-orders/${id}`, { method: "DELETE" })
      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        alert("Failed to delete PO")
      }
    } catch (error) {
      console.error("Failed to delete PO:", error)
      alert("Failed to delete PO")
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/purchasing/purchase-orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        alert("Failed to update PO status")
      }
    } catch (error) {
      console.error("Failed to update PO status:", error)
      alert("Failed to update PO status")
    }
  }

  const handleDeleteVendor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return

    try {
      const response = await fetch(`/api/purchasing/vendors/${id}`, { method: "DELETE" })
      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        alert("Failed to delete vendor")
      }
    } catch (error) {
      console.error("Failed to delete vendor:", error)
      alert("Failed to delete vendor")
    }
  }

  if (!isAuthenticated) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Purchasing Management</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage purchase orders and vendor relationships
            </p>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total POs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalPOs}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Draft</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.draftPOs}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${metrics.totalSpend.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Received</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.receivedPOs}</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="orders" className="w-full">
            <TabsList>
              <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-4">
              <div className="flex justify-end mb-4">
                <CreatePODialog onPOCreated={() => setRefreshTrigger((prev) => prev + 1)} />
              </div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>All purchase orders</CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  <PurchaseOrdersTable
                    onDelete={handleDeletePO}
                    onStatusChange={handleStatusChange}
                    refreshTrigger={refreshTrigger}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vendors" className="mt-4">
              <div className="flex justify-end mb-4">
                <AddVendorDialog onVendorAdded={() => setRefreshTrigger((prev) => prev + 1)} />
              </div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Vendors</CardTitle>
                  <CardDescription>All vendor information</CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  <VendorsTable onDelete={handleDeleteVendor} refreshTrigger={refreshTrigger} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
