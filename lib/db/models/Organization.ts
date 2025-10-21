import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  logo?: string;
  currency: string;
  timezone: string;
  taxId?: string;
  settings: {
    branding: {
      primaryColor: string;
      secondaryColor: string;
    };
    features: {
      inventory: boolean;
      crm: boolean;
      projects: boolean;
      hr: boolean;
    };
    notifications: {
      lowStockThreshold: number;
      invoiceDueDays: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    logo: {
      type: String,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    taxId: {
      type: String,
    },
    settings: {
      branding: {
        primaryColor: { type: String, default: '#3b82f6' },
        secondaryColor: { type: String, default: '#64748b' },
      },
      features: {
        inventory: { type: Boolean, default: true },
        crm: { type: Boolean, default: true },
        projects: { type: Boolean, default: true },
        hr: { type: Boolean, default: true },
      },
      notifications: {
        lowStockThreshold: { type: Number, default: 10 },
        invoiceDueDays: { type: Number, default: 30 },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
OrganizationSchema.index({ email: 1 });

// Clear cached model to ensure schema updates are applied
if (mongoose.models.Organization) {
  delete mongoose.models.Organization;
}

const Organization: Model<IOrganization> =
  mongoose.model<IOrganization>('Organization', OrganizationSchema);

export default Organization;
