"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function ExportButtons() {
  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/reports/export/csv?type=${type}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to export:", error)
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("orders")}>
        <Download className="h-4 w-4" />
        Export Orders
      </Button>
      <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("invoices")}>
        <Download className="h-4 w-4" />
        Export Invoices
      </Button>
      <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("employees")}>
        <Download className="h-4 w-4" />
        Export Employees
      </Button>
      <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("products")}>
        <Download className="h-4 w-4" />
        Export Products
      </Button>
    </div>
  )
}
