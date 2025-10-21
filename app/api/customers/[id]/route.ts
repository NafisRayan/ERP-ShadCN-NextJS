import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CustomerService } from '@/lib/services/customer.service';
import { updateCustomerSchema } from '@/lib/validations/customer';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = await CustomerService.getCustomerById(
      params.id,
      session.user.organizationId
    );

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer' },
      { status: error.message === 'Customer not found' ? 404 : 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateCustomerSchema.parse(body);

    const customer = await CustomerService.updateCustomer(
      params.id,
      validatedData,
      session.user.organizationId
    );

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Error updating customer:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update customer' },
      { status: error.message === 'Customer not found' ? 404 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await CustomerService.deleteCustomer(
      params.id,
      session.user.organizationId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete customer' },
      { status: error.message === 'Customer not found' ? 404 : 500 }
    );
  }
}
