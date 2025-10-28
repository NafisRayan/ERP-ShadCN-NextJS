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

interface Vendor {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  paymentTerms: string
  rating: number
  createdAt: string
  updatedAt: string
}

interface ViewVendorDialogProps {
  vendorId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewVendorDialog({ vendorId, open, onOpenChange }: ViewVendorDialogProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (vendorId && open) {
      fetchVendor()
    }
  }, [vendorId, open])

  const fetchVendor = async () => {
    if (!vendorId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/purchasing/vendors/${vendorId}`)
      const data = await response.json()
      setVendor(data)
    } catch (error) {
      console.error("Failed to fetch vendor:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vendor Details</DialogTitle>
          <DialogDescription>
            View detailed information about this vendor
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
        ) : vendor ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{vendor.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  {renderStars(vendor.rating)}
                  <span className="text-sm text-muted-foreground">({vendor.rating}/5)</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{vendor.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-muted-foreground">{vendor.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Terms</label>
                  <p className="text-sm text-muted-foreground">{vendor.paymentTerms || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <p className="text-sm text-muted-foreground">{vendor.address || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">City</label>
                  <p className="text-sm text-muted-foreground">{vendor.city || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Country</label>
                  <p className="text-sm text-muted-foreground">{vendor.country || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Last Updated</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(vendor.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Vendor not found</p>
        )}
      </DialogContent>
    </Dialog>
  )
}