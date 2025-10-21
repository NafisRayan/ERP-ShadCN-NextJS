import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ProductService } from '@/lib/services/product.service';
import { updateProductSchema } from '@/lib/validations/product';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await ProductService.getProductById(
      params.id,
      session.user.organizationId
    );

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: error.message === 'Product not found' ? 404 : 500 }
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
    const validatedData = updateProductSchema.parse(body);

    const product = await ProductService.updateProduct(
      params.id,
      validatedData,
      session.user.organizationId
    );

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: error.message === 'Product not found' ? 404 : 500 }
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

    const result = await ProductService.deleteProduct(
      params.id,
      session.user.organizationId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: error.message === 'Product not found' ? 404 : 500 }
    );
  }
}
