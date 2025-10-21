import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db/mongodb';
import DashboardWidget from '@/lib/db/models/DashboardWidget';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let widgetConfig = await DashboardWidget.findOne({
      userId: session.user.id,
      organizationId: session.user.organizationId,
    });

    // If no config exists, return default configuration
    if (!widgetConfig) {
      const defaultWidgets = [
        { type: 'revenue', position: 0, isVisible: true, size: 'small' },
        { type: 'expenses', position: 1, isVisible: true, size: 'small' },
        { type: 'sales', position: 2, isVisible: true, size: 'small' },
        { type: 'customers', position: 3, isVisible: true, size: 'small' },
        { type: 'revenue-chart', position: 4, isVisible: true, size: 'large' },
        { type: 'sales-overview', position: 5, isVisible: true, size: 'medium' },
        { type: 'recent-activity', position: 6, isVisible: true, size: 'large' },
      ];

      return NextResponse.json({ widgets: defaultWidgets });
    }

    return NextResponse.json({ widgets: widgetConfig.widgets });
  } catch (error) {
    console.error('Error fetching widget configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can customize dashboard' },
        { status: 403 }
      );
    }

    const { widgets } = await request.json();

    if (!Array.isArray(widgets)) {
      return NextResponse.json(
        { error: 'Invalid widget configuration' },
        { status: 400 }
      );
    }

    await connectDB();

    const widgetConfig = await DashboardWidget.findOneAndUpdate(
      {
        userId: session.user.id,
        organizationId: session.user.organizationId,
      },
      {
        widgets,
        userId: session.user.id,
        organizationId: session.user.organizationId,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return NextResponse.json({
      message: 'Dashboard configuration saved',
      widgets: widgetConfig.widgets,
    });
  } catch (error) {
    console.error('Error saving widget configuration:', error);
    return NextResponse.json(
      { error: 'Failed to save widget configuration' },
      { status: 500 }
    );
  }
}
