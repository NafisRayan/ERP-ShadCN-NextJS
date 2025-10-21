import { Suspense } from 'react';
import { SearchResults } from './search-results';
import { Loader2 } from 'lucide-react';

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        <p className="text-muted-foreground">
          Find products, customers, orders, and employees
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
