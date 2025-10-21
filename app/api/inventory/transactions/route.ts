import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { InventoryService } from '@/lib/services/inventory.service';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, warehouseId, type, quantity, referenceType, referenceId, notes } = body;

    if (!productId || !warehouseId || !type || !quantity || !referenceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction = await InventoryService.recordTransaction(
      { productId, warehouseId, type, quantity, referenceType, referenceId, notes },
      session.user.id,
      session.user.organizationId
    );

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error('Error recording transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record transaction' },
      { status: 500 }
    );
  }
}

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

    const filters = {
      warehouseId: searchParams.get('warehouseId') || undefined,
      type: searchParams.get('type') || undefined,
      limit: parseInt(searchParams.get('limit') || '100'),
    };

    const transactions = await InventoryService.getTransactionHistory(
      productId,
      session.user.organizationId,
      filters
    );

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
