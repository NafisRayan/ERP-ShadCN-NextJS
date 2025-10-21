# Shared Components Documentation

This directory contains reusable UI components built with shadcn/ui for the ERP system.

## Components

### DataTable

A powerful data table component with sorting, filtering, and pagination.

**Features:**
- Column sorting (ascending/descending)
- Search/filter functionality
- Pagination
- Row selection
- Responsive design

**Usage:**

```tsx
import { DataTable, DataTableColumnHeader } from "@/components/shared"
import { ColumnDef } from "@tanstack/react-table"

// Define your columns
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
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
]

// Use the DataTable
<DataTable
  columns={columns}
  data={products}
  searchKey="name"
  searchPlaceholder="Search products..."
/>
```

### StatsCard

A card component for displaying KPIs and statistics.

**Features:**
- Icon support
- Trend indicators (positive/negative)
- Description text
- Customizable styling

**Usage:**

```tsx
import { StatsCard } from "@/components/shared"
import { DollarSign, Users, ShoppingCart } from "lucide-react"

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
</div>
```

### Modal

A simple modal/dialog component for displaying content.

**Usage:**

```tsx
import { Modal } from "@/components/shared"
import { Button } from "@/components/ui/button"

const [isOpen, setIsOpen] = useState(false)

<Modal
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p>This action cannot be undone.</p>
</Modal>
```

### FormModal

A modal component specifically designed for forms with built-in submit/cancel buttons.

**Usage:**

```tsx
import { FormModal } from "@/components/shared"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
  },
})

const onSubmit = (values: z.infer<typeof formSchema>) => {
  console.log(values)
  setIsOpen(false)
}

<FormModal
  title="Add New User"
  description="Enter the user details below"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={form.handleSubmit(onSubmit)}
  submitLabel="Create User"
  isLoading={isLoading}
>
  <Form {...form}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="John Doe" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="john@example.com" type="email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </Form>
</FormModal>
```

## Form Components

The `form.tsx` file provides React Hook Form integration with shadcn/ui components.

**Components:**
- `Form` - Form provider wrapper
- `FormField` - Field controller
- `FormItem` - Field container
- `FormLabel` - Field label with error styling
- `FormControl` - Input wrapper with accessibility
- `FormDescription` - Helper text
- `FormMessage` - Error message display

**Usage:**

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Toast Notifications

The toast system provides non-intrusive notifications.

**Usage:**

```tsx
import { useToast } from "@/lib/hooks/use-toast"
import { Button } from "@/components/ui/button"

function MyComponent() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Success!",
          description: "Your changes have been saved.",
        })
      }}
    >
      Show Toast
    </Button>
  )
}

// Add Toaster to your root layout
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

**Toast Variants:**

```tsx
// Success
toast({
  title: "Success",
  description: "Operation completed successfully.",
})

// Error
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong.",
})

// With action
toast({
  title: "Scheduled: Catch up",
  description: "Friday, February 10, 2023 at 5:57 PM",
  action: (
    <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
  ),
})
```

## Core UI Components

All shadcn/ui components are available in `components/ui/`:

- `button` - Button component with variants
- `input` - Text input field
- `select` - Dropdown select
- `dialog` - Modal dialog
- `table` - Table components
- `card` - Card container
- `label` - Form label
- `badge` - Status badge
- `avatar` - User avatar
- `dropdown-menu` - Dropdown menu
- `scroll-area` - Scrollable area
- `separator` - Visual separator
- `sheet` - Slide-out panel
- `toast` - Toast notification

Refer to [shadcn/ui documentation](https://ui.shadcn.com) for detailed usage of each component.
