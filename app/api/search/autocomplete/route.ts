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
    const limit = parseInt(searchParams.get('limit') || '5');

    // Validate query
    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Get autocomplete suggestions
    const suggestions = await SearchService.getAutocompleteSuggestions(
      query.trim(),
      session.user.organizationId,
      limit
    );

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching suggestions',
      },
      { status: 500 }
    );
  }
}
