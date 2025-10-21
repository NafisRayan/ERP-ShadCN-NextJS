import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { InventoryService } from '@/lib/services/inventory.service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const stockLevels = await InventoryService.getStockLevels(
      productId,
      session.user.organizationId
    );

    return NextResponse.json({ stockLevels });
  } catch (error: any) {
    console.error('Error fetching stock levels:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stock levels' },
      { status: 500 }
    );
  }
}
