import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SearchService } from '@/lib/services/search.service';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const entityTypesParam = searchParams.get('types');

    // Validate query
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Parse entity types filter
    let entityTypes: Array<'product' | 'customer' | 'order' | 'employee'> | undefined;
    if (entityTypesParam) {
      entityTypes = entityTypesParam.split(',') as any;
    }

    // Perform search
    const results = await SearchService.globalSearch(
      query.trim(),
      session.user.organizationId,
      { limit, entityTypes }
    );

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while searching',
      },
      { status: 500 }
    );
  }
}
