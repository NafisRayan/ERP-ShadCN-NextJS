'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Package, Users, ShoppingCart, UserCircle, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'product' | 'customer' | 'order' | 'employee';
  title: string;
  subtitle: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface GroupedResults {
  products: SearchResult[];
  customers: SearchResult[];
  orders: SearchResult[];
  employees: SearchResult[];
}

const entityIcons = {
  product: Package,
  customer: Users,
  order: ShoppingCart,
  employee: UserCircle,
};

const entityColors = {
  product: 'text-blue-500 bg-blue-50',
  customer: 'text-green-500 bg-green-50',
  order: 'text-purple-500 bg-purple-50',
  employee: 'text-orange-500 bg-orange-50',
};

const entityLabels = {
  product: 'Products',
  customer: 'Customers',
  order: 'Orders',
  employee: 'Employees',
};

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [groupedResults, setGroupedResults] = useState<GroupedResults>({
    products: [],
    customers: [],
    orders: [],
    employees: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setGroupedResults({
          products: [],
          customers: [],
          orders: [],
          employees: [],
        });
        setTotalCount(0);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&limit=50`
        );
        const data = await response.json();

        if (data.success) {
          setResults(data.data.results);
          setGroupedResults(data.data.groupedResults);
          setTotalCount(data.data.totalCount);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
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
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
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

  // Render result card
  const renderResultCard = (result: SearchResult) => {
    const Icon = entityIcons[result.type];

    return (
      <Card
        key={result.id}
        className="cursor-pointer transition-all hover:shadow-md"
        onClick={() => handleResultClick(result)}
      >
        <CardContent className="flex items-start gap-4 p-4">
          <div className={cn('rounded-lg p-3', entityColors[result.type])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">
                {highlightMatch(result.title, searchQuery)}
              </h3>
              <Badge variant="outline" className="text-xs">
                {result.type}
              </Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {highlightMatch(result.subtitle, searchQuery)}
            </p>
            {result.description && (
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {result.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Get counts for each entity type
  const counts = {
    all: totalCount,
    products: groupedResults.products.length,
    customers: groupedResults.customers.length,
    orders: groupedResults.orders.length,
    employees: groupedResults.employees.length,
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, customers, orders, employees..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : searchQuery ? (
        <>
          {/* Results Summary */}
          <div>
            <h2 className="text-xl font-semibold">
              {totalCount > 0
                ? `Found ${totalCount} result${totalCount !== 1 ? 's' : ''} for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </h2>
          </div>

          {totalCount > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All ({counts.all})
                </TabsTrigger>
                <TabsTrigger value="products">
                  Products ({counts.products})
                </TabsTrigger>
                <TabsTrigger value="customers">
                  Customers ({counts.customers})
                </TabsTrigger>
                <TabsTrigger value="orders">
                  Orders ({counts.orders})
                </TabsTrigger>
                <TabsTrigger value="employees">
                  Employees ({counts.employees})
                </TabsTrigger>
              </TabsList>

              {/* All Results */}
              <TabsContent value="all" className="space-y-4">
                {results.map((result) => renderResultCard(result))}
              </TabsContent>

              {/* Products */}
              <TabsContent value="products" className="space-y-4">
                {groupedResults.products.length > 0 ? (
                  groupedResults.products.map((result) => renderResultCard(result))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No products found</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Customers */}
              <TabsContent value="customers" className="space-y-4">
                {groupedResults.customers.length > 0 ? (
                  groupedResults.customers.map((result) => renderResultCard(result))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No customers found</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Orders */}
              <TabsContent value="orders" className="space-y-4">
                {groupedResults.orders.length > 0 ? (
                  groupedResults.orders.map((result) => renderResultCard(result))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No orders found</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Employees */}
              <TabsContent value="employees" className="space-y-4">
                {groupedResults.employees.length > 0 ? (
                  groupedResults.employees.map((result) => renderResultCard(result))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No employees found</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Enter a search query to find products, customers, orders, and employees
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
