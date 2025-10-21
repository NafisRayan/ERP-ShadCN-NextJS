'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';

export function Breadcrumb() {
  const pathname = usePathname();
  
  // Split pathname and filter out empty strings
  const segments = pathname.split('/').filter(Boolean);
  
  // Remove 'dashboard' from segments if it's the first one
  const breadcrumbSegments = segments[0] === 'dashboard' ? segments.slice(1) : segments;
  
  // If we're on the dashboard home, don't show breadcrumbs
  if (breadcrumbSegments.length === 0) {
    return null;
  }

  // Capitalize and format segment names
  const formatSegment = (segment: string) => {
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Build breadcrumb path
  const buildPath = (index: number) => {
    return '/dashboard/' + breadcrumbSegments.slice(0, index + 1).join('/');
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Dashboard</span>
      </Link>
      
      {breadcrumbSegments.map((segment, index) => {
        const isLast = index === breadcrumbSegments.length - 1;
        const path = buildPath(index);
        
        return (
          <Fragment key={segment}>
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-foreground">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link
                href={path}
                className="hover:text-foreground transition-colors"
              >
                {formatSegment(segment)}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
