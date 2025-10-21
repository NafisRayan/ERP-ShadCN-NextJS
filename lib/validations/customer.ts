import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const customerSchema = z.object({
  type: z.enum(['individual', 'company']),
  name: z.string().min(1, 'Customer name is required').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().min(1, 'Phone is required').trim(),
  company: z.string().optional(),
  address: addressSchema,
  taxId: z.string().optional(),
  paymentTerms: z.number().min(0, 'Payment terms must be positive').default(30),
  creditLimit: z.number().min(0, 'Credit limit must be positive').optional(),
  tags: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

export const updateCustomerSchema = customerSchema.partial();

export type CustomerInput = z.infer<typeof customerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
