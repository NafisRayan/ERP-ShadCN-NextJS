import mongoose, { Schema, Document, Model } from 'mongoose';
import { Address, EmergencyContact } from '@/types/common';

export interface IEmployee extends Document {
  organizationId: mongoose.Types.ObjectId;
  employeeId: string;
  userId?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  hireDate: Date;
  department: string;
  jobTitle: string;
  salary: number;
  employmentType: 'full-time' | 'part-time' | 'contract';
  status: 'active' | 'inactive' | 'terminated';
  address: Address;
  emergencyContact: EmergencyContact;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
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
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    hireDate: {
      type: Date,
      required: [true, 'Hire date is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: 0,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract'],
      required: [true, 'Employment type is required'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active',
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
    },
    documents: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
EmployeeSchema.index({ organizationId: 1 });
EmployeeSchema.index({ employeeId: 1, organizationId: 1 }, { unique: true });
EmployeeSchema.index({ email: 1, organizationId: 1 });
EmployeeSchema.index({ status: 1 });

// Text index for search
EmployeeSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text',
  phone: 'text',
  employeeId: 'text',
  department: 'text',
  jobTitle: 'text'
});

const Employee: Model<IEmployee> =
  mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
