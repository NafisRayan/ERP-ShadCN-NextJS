import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ProductService } from '@/lib/services/product.service';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await ProductService.getLowStockProducts(
      session.user.organizationId
    );

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching low stock products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch low stock products' },
      { status: 500 }
    );
  }
}
