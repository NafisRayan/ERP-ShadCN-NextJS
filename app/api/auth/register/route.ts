import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Organization from '@/lib/db/models/Organization';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      organizationName,
      organizationEmail,
      organizationPhone,
    } = validatedFields.data;

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create organization
    const organization = await Organization.create({
      name: organizationName,
      email: organizationEmail,
      phone: organizationPhone,
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    });

    // Create user with admin role (first user of organization)
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      organizationId: organization._id,
      isActive: true,
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
