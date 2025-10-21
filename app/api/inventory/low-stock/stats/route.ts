import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { LowStockService } from '@/lib/services/low-stock.service';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await LowStockService.getLowStockStats(
      session.user.organizationId
    );

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching low stock stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch low stock stats' },
      { status: 500 }
    );
  }
}
