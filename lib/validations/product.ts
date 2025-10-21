import { z } from 'zod';

export const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required').trim(),
  name: z.string().min(1, 'Product name is required').trim(),
  description: z.string().optional().default(''),
  category: z.string().min(1, 'Category is required').trim(),
  unit: z.string().min(1, 'Unit is required').default('pcs'),
  costPrice: z.number().min(0, 'Cost price must be positive'),
  sellingPrice: z.number().min(0, 'Selling price must be positive'),
  reorderLevel: z.number().min(0, 'Reorder level must be positive').default(10),
  barcode: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
