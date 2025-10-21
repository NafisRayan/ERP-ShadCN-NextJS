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
    const { productId, fromWarehouseId, toWarehouseId, quantity, notes } = body;

    if (!productId || !fromWarehouseId || !toWarehouseId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (fromWarehouseId === toWarehouseId) {
      return NextResponse.json(
        { error: 'Cannot transfer to the same warehouse' },
        { status: 400 }
      );
    }

    const result = await InventoryService.transferStock(
      { productId, fromWarehouseId, toWarehouseId, quantity, notes },
      session.user.id,
      session.user.organizationId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error transferring stock:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to transfer stock' },
      { status: 500 }
    );
  }
}
