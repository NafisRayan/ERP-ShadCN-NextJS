'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, Package, Users, ShoppingCart, UserCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'product' | 'customer' | 'order' | 'employee';
  title: string;
  subtitle: string;
  description?: string;
}

const entityIcons = {
  product: Package,
  customer: Users,
  order: ShoppingCart,
  employee: UserCircle,
};

const entityColors = {
  product: 'text-blue-500',
  customer: 'text-green-500',
  order: 'text-purple-500',
  employee: 'text-orange-500',
};

const entityLabels = {
  product: 'Product',
  customer: 'Customer',
  order: 'Order',
  employee: 'Employee',
};

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Fetch autocomplete suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search/autocomplete?q=${encodeURIComponent(searchQuery)}&limit=8`
      );
      const data = await response.json();

      if (data.success) {
        setResults(data.data);
        setIsOpen(data.data.length > 0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        } else if (query.trim()) {
          handleViewAllResults();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    const routes = {
      product: `/dashboard/inventory/products/${result.id}`,
      customer: `/dashboard/crm/customers/${result.id}`,
      order: `/dashboard/sales/orders/${result.id}`,
      employee: `/dashboard/hr/employees/${result.id}`,
    };

    router.push(routes[result.type]);
    setIsOpen(false);
    setQuery('');
  };

  // Handle view all results
  const handleViewAllResults = () => {
    router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 text-gray-900">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search products, customers, orders..."
          className="pl-10 pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-md border bg-popover shadow-lg">
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.map((result, index) => {
              const Icon = entityIcons[result.type];
              return (
                <button
                  key={result.id}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors',
                    'hover:bg-accent',
                    selectedIndex === index && 'bg-accent'
                  )}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Icon className={cn('mt-0.5 h-5 w-5 flex-shrink-0', entityColors[result.type])} />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">
                        {highlightMatch(result.title, query)}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {entityLabels[result.type]}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {highlightMatch(result.subtitle, query)}
                    </p>
                    {result.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {result.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* View All Results */}
          <div className="border-t p-2">
            <button
              className="w-full rounded-md p-2 text-center text-sm font-medium text-primary hover:bg-accent"
              onClick={handleViewAllResults}
            >
              View all results for &quot;{query}&quot;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
