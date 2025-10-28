"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoicesTable } from "@/components/invoices-table"
import { CreateInvoiceDialog } from "@/components/create-invoice-dialog"
import { ViewInvoiceDialog } from "@/components/view-invoice-dialog"
import { FinancialMetrics } from "@/components/financial-metrics"

export default function InvoicesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [viewInvoiceId, setViewInvoiceId] = useState<string | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

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
        const errorData = await response.json()
        alert(errorData.error || "Failed to delete invoice")
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error)
      alert("Network error: Failed to delete invoice")
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
        const errorData = await response.json()
        alert(errorData.error || "Failed to update invoice status")
      }
    } catch (error) {
      console.error("Failed to update invoice status:", error)
      alert("Network error: Failed to update invoice status")
    }
  }

  const handleViewInvoice = (invoiceId: string) => {
    setViewInvoiceId(invoiceId)
    setViewDialogOpen(true)
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/financial/invoices/${invoiceId}`)
      const invoice = await response.json()

      if (!invoice) {
        alert("Invoice not found")
        return
      }

      // Create a simple text-based invoice for download
      const invoiceText = `
INVOICE
=======
Invoice Number: ${invoice.invoiceNumber}
Customer: ${invoice.customerName}
Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Status: ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}

Amount: $${Number(invoice.amount || 0).toFixed(2)}
Tax: $${Number(invoice.tax || 0).toFixed(2)}
Total: $${Number(invoice.total || 0).toFixed(2)}

Generated on: ${new Date().toLocaleString()}
      `.trim()

      // Create and download the file
      const blob = new Blob([invoiceText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoice.invoiceNumber}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download invoice:", error)
      alert("Failed to download invoice")
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
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Financial & Accounting</h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Manage invoices and financial reports
              </p>
            </div>
            <CreateInvoiceDialog onInvoiceCreated={() => setRefreshTrigger((prev) => prev + 1)} />
          </div>

          <FinancialMetrics refreshTrigger={refreshTrigger} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Invoices</CardTitle>
              <CardDescription>All invoices and payment tracking</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <InvoicesTable
                onDelete={handleDeleteInvoice}
                onStatusChange={handleStatusChange}
                onView={handleViewInvoice}
                onDownload={handleDownloadInvoice}
                refreshTrigger={refreshTrigger}
              />
            </CardContent>
          </Card>
        </main>
      </SidebarInset>

      <ViewInvoiceDialog
        invoiceId={viewInvoiceId}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </SidebarProvider>
  )
}
