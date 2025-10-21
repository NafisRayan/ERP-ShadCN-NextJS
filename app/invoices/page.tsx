"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoicesTable } from "@/components/invoices-table"
import { CreateInvoiceDialog } from "@/components/create-invoice-dialog"
import { FinancialMetrics } from "@/components/financial-metrics"

export default function InvoicesPage() {
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

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return

    try {
      const response = await fetch(`/api/financial/invoices/${id}`, { method: "DELETE" })
      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        alert("Failed to delete invoice")
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error)
      alert("Failed to delete invoice")
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/financial/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        alert("Failed to update invoice status")
      }
    } catch (error) {
      console.error("Failed to update invoice status:", error)
      alert("Failed to update invoice status")
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
                <h1 className="text-3xl font-bold tracking-tight">Financial & Accounting</h1>
                <p className="text-muted-foreground mt-2">Manage invoices and financial reports</p>
              </div>
              <CreateInvoiceDialog onInvoiceCreated={() => setRefreshTrigger((prev) => prev + 1)} />
            </div>

            <FinancialMetrics refreshTrigger={refreshTrigger} />

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>All invoices and payment tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <InvoicesTable
                  onDelete={handleDeleteInvoice}
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
