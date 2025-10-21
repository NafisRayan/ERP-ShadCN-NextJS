import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { LowStockService } from '@/lib/services/low-stock.service';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const suggestions = await LowStockService.getReorderSuggestions(
      session.user.organizationId
    );

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Error fetching reorder suggestions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reorder suggestions' },
      { status: 500 }
    );
  }
}
