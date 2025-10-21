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
    const { productId, warehouseId, newQuantity, notes } = body;

    if (!productId || !warehouseId || newQuantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await InventoryService.adjustStock(
      { productId, warehouseId, newQuantity, notes },
      session.user.id,
      session.user.organizationId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error adjusting stock:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to adjust stock' },
      { status: 500 }
    );
  }
}
