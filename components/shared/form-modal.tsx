"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface FormModalProps {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  children: React.ReactNode
  submitLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  className?: string
}

export function FormModal({
  title,
  description,
  isOpen,
  onClose,
  onSubmit,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isLoading = false,
  className,
}: FormModalProps) {
  const onChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={cn("sm:max-w-[500px]", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">{children}</div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
