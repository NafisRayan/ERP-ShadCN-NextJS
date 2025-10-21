'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GripVertical, Save } from 'lucide-react';

interface WidgetConfig {
  type: string;
  position: number;
  isVisible: boolean;
  size?: 'small' | 'medium' | 'large';
}

const widgetLabels: Record<string, string> = {
  revenue: 'Total Revenue',
  expenses: 'Total Expenses',
  sales: 'Sales Orders',
  customers: 'New Customers',
  'revenue-chart': 'Revenue Overview Chart',
  'sales-overview': 'Sales by Status Chart',
  'recent-activity': 'Recent Activity',
};

export default function DashboardSettingsPage() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchWidgetConfig();
  }, []);

  const fetchWidgetConfig = async () => {
    try {
      const response = await fetch('/api/dashboard/widgets');
      if (!response.ok) throw new Error('Failed to fetch configuration');
      
      const data = await response.json();
      setWidgets(data.widgets || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard configuration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/dashboard/widgets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgets }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save configuration');
      }

      toast({
        title: 'Success',
        description: 'Dashboard configuration saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save dashboard configuration',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = (index: number) => {
    const updated = [...widgets];
    updated[index].isVisible = !updated[index].isVisible;
    setWidgets(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...widgets];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    // Update positions
    updated.forEach((widget, idx) => {
      widget.position = idx;
    });

    setWidgets(updated);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Settings</h1>
          <p className="mt-2 text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Customize your dashboard by reordering widgets and toggling visibility
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Widget Configuration</CardTitle>
          <CardDescription>
            Drag widgets to reorder them, or toggle visibility using the switches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {widgets.map((widget, index) => (
              <div
                key={`${widget.type}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-move hover:bg-muted/50 transition-colors ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{widgetLabels[widget.type] || widget.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Position: {widget.position + 1}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`widget-${index}`} className="text-sm">
                    {widget.isVisible ? 'Visible' : 'Hidden'}
                  </Label>
                  <Switch
                    id={`widget-${index}`}
                    checked={widget.isVisible}
                    onCheckedChange={() => toggleVisibility(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            This is how your dashboard will appear with the current configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {widgets
              .filter((w) => w.isVisible)
              .map((widget, index) => (
                <div
                  key={`preview-${widget.type}-${index}`}
                  className="p-3 border rounded bg-muted/20"
                >
                  <p className="text-sm font-medium">
                    {index + 1}. {widgetLabels[widget.type] || widget.type}
                  </p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
