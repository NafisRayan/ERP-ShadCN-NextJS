"use client"

/**
 * Example Usage Component
 * 
 * This file demonstrates how to use all the reusable UI components.
 * This is for reference only and should not be imported in production code.
 */

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DollarSign, Users, ShoppingCart, Package } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { DataTable, DataTableColumnHeader } from "./data-table"
import { StatsCard } from "./stats-card"
import { Modal } from "./modal"
import { FormModal } from "./form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/lib/hooks/use-toast"

// Example data type
type Product = {
  id: string
  sku: string
  name: string
  category: string
  price: number
  stock: number
}

// Example data
const exampleProducts: Product[] = [
  {
    id: "1",
    sku: "PRD-001",
    name: "Laptop",
    category: "Electronics",
    price: 999.99,
    stock: 50,
  },
  {
    id: "2",
    sku: "PRD-002",
    name: "Mouse",
    category: "Accessories",
    price: 29.99,
    stock: 200,
  },
  {
    id: "3",
    sku: "PRD-003",
    name: "Keyboard",
    category: "Accessories",
    price: 79.99,
    stock: 150,
  },
]

// Form schema
const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
})

export function ExampleUsage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  // Define columns for DataTable
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SKU" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
    },
  ]

  // Form setup
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: "",
      stock: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(values)
    setIsLoading(false)
    setIsFormModalOpen(false)
    toast({
      title: "Success!",
      description: "Product has been created successfully.",
    })
    form.reset()
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Component Examples</h1>
        <p className="text-muted-foreground">
          Demonstration of all reusable UI components
        </p>
      </div>

      {/* StatsCard Examples */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Stats Cards</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="$45,231.89"
            description="from last month"
            icon={DollarSign}
            trend={{ value: 20.1, isPositive: true }}
          />
          <StatsCard
            title="Active Users"
            value="2,350"
            description="from last month"
            icon={Users}
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="Sales"
            value="12,234"
            description="from last month"
            icon={ShoppingCart}
            trend={{ value: -2.5, isPositive: false }}
          />
          <StatsCard
            title="Products"
            value="573"
            description="in inventory"
            icon={Package}
          />
        </div>
      </section>

      {/* DataTable Example */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Data Table</h2>
        <DataTable
          columns={columns}
          data={exampleProducts}
          searchKey="name"
          searchPlaceholder="Search products..."
        />
      </section>

      {/* Modal Examples */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Modals</h2>
        <div className="flex gap-4">
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Button onClick={() => setIsFormModalOpen(true)}>
            Open Form Modal
          </Button>
          <Button
            onClick={() => {
              toast({
                title: "Notification",
                description: "This is a toast notification!",
              })
            }}
          >
            Show Toast
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong!",
              })
            }}
          >
            Show Error Toast
          </Button>
        </div>

        {/* Simple Modal */}
        <Modal
          title="Confirm Action"
          description="Are you sure you want to proceed with this action?"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  toast({
                    title: "Confirmed",
                    description: "Action has been confirmed.",
                  })
                }}
              >
                Confirm
              </Button>
            </>
          }
        >
          <p>This action cannot be undone. Please confirm to continue.</p>
        </Modal>

        {/* Form Modal */}
        <FormModal
          title="Add New Product"
          description="Enter the product details below"
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={form.handleSubmit(onSubmit)}
          submitLabel="Create Product"
          isLoading={isLoading}
        >
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="PRD-001" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique product identifier
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </FormModal>
      </section>
    </div>
  )
}
