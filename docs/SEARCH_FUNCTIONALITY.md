# Global Search Functionality

## Overview

The ERP system includes a comprehensive global search feature that allows users to quickly find products, customers, orders, and employees across the entire system. The search functionality includes:

- Real-time autocomplete suggestions
- Full-text search with MongoDB text indexes
- Entity grouping and filtering
- Search result highlighting
- Keyboard navigation support

## Features

### 1. Global Search Bar

Located in the top navigation bar, the global search bar provides:

- **Autocomplete**: Shows up to 8 relevant results as you type (minimum 2 characters)
- **Debounced Search**: 300ms delay to reduce API calls
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select, Escape to close
- **Entity Icons**: Visual indicators for different entity types
- **Quick Access**: Click any result to navigate directly to the entity detail page

### 2. Search Results Page

Accessible at `/dashboard/search`, the search results page provides:

- **Comprehensive Results**: Up to 50 results per search
- **Entity Filtering**: Tabs to filter by entity type (All, Products, Customers, Orders, Employees)
- **Result Counts**: Shows the number of results for each entity type
- **Highlighted Matches**: Search terms are highlighted in yellow
- **Empty States**: Helpful messages when no results are found

### 3. Text Search Indexes

MongoDB text indexes are created on the following fields:

#### Products
- name
- description
- sku
- category
- barcode

#### Customers
- name
- email
- phone
- company
- taxId

#### Orders
- orderNumber
- notes

#### Employees
- firstName
- lastName
- email
- phone
- employeeId
- department
- jobTitle

## API Endpoints

### GET /api/search

Search across all entities.

**Query Parameters:**
- `q` (required): Search query string
- `limit` (optional): Maximum number of results (default: 20)
- `types` (optional): Comma-separated entity types to search (e.g., "product,customer")

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [...],
    "totalCount": 25,
    "groupedResults": {
      "products": [...],
      "customers": [...],
      "orders": [...],
      "employees": [...]
    }
  }
}
```

### GET /api/search/autocomplete

Get autocomplete suggestions.

**Query Parameters:**
- `q` (required): Search query string (minimum 2 characters)
- `limit` (optional): Maximum number of suggestions (default: 5)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "type": "product",
      "title": "Product Name",
      "subtitle": "SKU: ABC123",
      "description": "Product description",
      "metadata": {...},
      "score": 1.5
    }
  ]
}
```

## Components

### GlobalSearch

The main search component with autocomplete functionality.

**Location:** `components/shared/global-search.tsx`

**Features:**
- Debounced search input
- Autocomplete dropdown
- Keyboard navigation
- Click outside to close
- Result highlighting

### SearchResults

The search results page component.

**Location:** `app/dashboard/search/search-results.tsx`

**Features:**
- Tabbed interface for entity filtering
- Result cards with entity icons
- Search result highlighting
- Empty states

## Usage

### In Components

```tsx
import { GlobalSearch } from '@/components/shared/global-search';

export function MyComponent() {
  return <GlobalSearch />;
}
```

### Programmatic Search

```tsx
import { SearchService } from '@/lib/services/search.service';

// Perform a search
const results = await SearchService.globalSearch(
  'search query',
  organizationId,
  { limit: 20, entityTypes: ['product', 'customer'] }
);

// Get autocomplete suggestions
const suggestions = await SearchService.getAutocompleteSuggestions(
  'search query',
  organizationId,
  5
);
```

## Performance Considerations

1. **Text Indexes**: MongoDB text indexes are created on all searchable fields for fast full-text search
2. **Debouncing**: 300ms debounce on autocomplete to reduce API calls
3. **Parallel Queries**: Entity searches are executed in parallel for better performance
4. **Result Limits**: Default limits prevent excessive data transfer
5. **Organization Isolation**: All searches are scoped to the user's organization

## Security

- All search endpoints require authentication
- Results are filtered by organization ID
- Only active entities are included in search results (where applicable)
- Input validation prevents injection attacks

## Future Enhancements

- Advanced search filters (date ranges, price ranges, etc.)
- Search history and saved searches
- Search analytics and popular searches
- Fuzzy matching for typo tolerance
- Search result ranking improvements
- Export search results
- Search within specific modules
