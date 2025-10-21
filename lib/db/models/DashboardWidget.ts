import mongoose, { Schema, Document, Model } from 'mongoose';

export type WidgetType = 'revenue' | 'expenses' | 'sales' | 'customers' | 'revenue-chart' | 'sales-overview' | 'recent-activity';

export interface IWidgetConfig {
  type: WidgetType;
  position: number;
  isVisible: boolean;
  size?: 'small' | 'medium' | 'large';
  settings?: Record<string, any>;
}

export interface IDashboardWidget extends Document {
  userId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  widgets: IWidgetConfig[];
  createdAt: Date;
  updatedAt: Date;
}

const WidgetConfigSchema = new Schema<IWidgetConfig>(
  {
    type: {
      type: String,
      enum: ['revenue', 'expenses', 'sales', 'customers', 'revenue-chart', 'sales-overview', 'recent-activity'],
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const DashboardWidgetSchema = new Schema<IDashboardWidget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    widgets: {
      type: [WidgetConfigSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
DashboardWidgetSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

const DashboardWidget: Model<IDashboardWidget> =
  mongoose.models.DashboardWidget ||
  mongoose.model<IDashboardWidget>('DashboardWidget', DashboardWidgetSchema);

export default DashboardWidget;
