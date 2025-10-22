# Font System Documentation

## Overview
The ERP system uses **Geist** and **Geist Mono** fonts from Vercel, providing a modern, professional typography system optimized for UI and code display.

## Font Configuration

### Primary Fonts

#### Geist Sans (UI Font)
- **Usage:** All UI text, headings, body copy
- **Variable:** `--font-sans`
- **Fallbacks:** `ui-sans-serif`, `system-ui`, `sans-serif`
- **Features:** 
  - Variable font with multiple weights
  - Optimized for screen reading
  - Excellent legibility at all sizes
  - Modern, clean appearance

#### Geist Mono (Code Font)
- **Usage:** Code blocks, technical data, monospace content
- **Variable:** `--font-mono`
- **Fallbacks:** `ui-monospace`, `monospace`
- **Features:**
  - Fixed-width characters
  - Clear distinction between similar characters (0/O, 1/l/I)
  - Perfect for displaying SKUs, codes, technical data

## Implementation

### Layout Configuration
```tsx
// app/layout.tsx
const geistSans = Geist({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
})

// Applied to body
className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
```

### CSS Variables
```css
/* globals.css */
--font-sans: "Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif;
--font-mono: "Geist Mono", "Geist Mono Fallback", ui-monospace, monospace;
```

### Tailwind Configuration
```js
// tailwind.config.cjs
fontFamily: {
  sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
}
```

## Typography Scale

### Font Sizes
```css
text-xs    → 12px / 16px line-height
text-sm    → 14px / 20px line-height
text-base  → 16px / 24px line-height
text-lg    → 18px / 28px line-height
text-xl    → 20px / 28px line-height
text-2xl   → 24px / 32px line-height
text-3xl   → 30px / 36px line-height
text-4xl   → 36px / 40px line-height
text-5xl   → 48px / 48px line-height
```

### Font Weights
```css
font-normal    → 400 (Regular)
font-medium    → 500 (Medium)
font-semibold  → 600 (Semibold)
font-bold      → 700 (Bold)
```

### Letter Spacing
```css
tracking-tighter  → -0.05em
tracking-tight    → -0.025em (Used for headings)
tracking-normal   → 0
tracking-wide     → 0.025em
tracking-wider    → 0.05em
tracking-widest   → 0.1em
```

## Usage Guidelines

### Headings
```tsx
// Page titles
<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
  Dashboard
</h1>

// Section titles
<h2 className="text-xl font-semibold tracking-tight">
  Recent Activity
</h2>

// Card titles
<h3 className="text-sm font-medium">
  Total Revenue
</h3>
```

### Body Text
```tsx
// Regular text
<p className="text-base text-foreground">
  Main content text
</p>

// Muted text
<p className="text-sm text-muted-foreground">
  Secondary information
</p>

// Small text
<span className="text-xs text-muted-foreground">
  Helper text or labels
</span>
```

### Monospace Text
```tsx
// SKU codes
<span className="font-mono text-sm">
  SKU-001
</span>

// Technical data
<code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
  API_KEY
</code>

// Numbers in tables
<td className="font-mono tabular-nums">
  $1,234.56
</td>
```

### Responsive Typography
```tsx
// Scales from mobile to desktop
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

<p className="text-sm sm:text-base">
  Responsive body text
</p>
```

## Font Features

### Enabled Features
```css
body {
  font-feature-settings: "rlig" 1, "calt" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- **rlig:** Required ligatures
- **calt:** Contextual alternates
- **antialiased:** Smooth font rendering
- **grayscale:** Better rendering on macOS

### Tabular Numbers
For financial data and tables:
```tsx
<span className="tabular-nums">
  $1,234.56
</span>
```
This ensures numbers align vertically in columns.

## Text Utilities

### Text Wrapping
```tsx
// Balance text across lines (headings)
<h1 className="text-balance">
  Long Heading That Needs Balancing
</h1>

// Pretty text wrapping (paragraphs)
<p className="text-pretty">
  Long paragraph text that wraps nicely
</p>
```

### Text Truncation
```tsx
// Single line truncate
<p className="truncate">
  Very long text that will be cut off...
</p>

// Multi-line clamp
<p className="line-clamp-2">
  Text that will be limited to 2 lines
</p>
```

## Component Examples

### Dashboard Metrics
```tsx
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium">
      Total Revenue
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold tabular-nums">
      $45,231.89
    </div>
    <p className="text-xs text-muted-foreground">
      +20.1% from last month
    </p>
  </CardContent>
</Card>
```

### Table Headers
```tsx
<TableHead className="text-xs font-medium uppercase tracking-wide">
  Product Name
</TableHead>
```

### Form Labels
```tsx
<Label className="text-sm font-medium">
  Email Address
</Label>
```

### Buttons
```tsx
<Button className="text-sm font-medium">
  Save Changes
</Button>
```

## Performance Optimizations

### Font Loading
- Fonts are loaded via Next.js font optimization
- Automatic font subsetting
- Self-hosted for better performance
- No external font requests

### Font Display
```tsx
// Configured in layout.tsx
display: 'swap' // Implicit in Next.js font loader
```
This prevents invisible text during font loading.

### Preloading
Next.js automatically preloads fonts in the `<head>`:
```html
<link rel="preload" href="/_next/static/media/geist.woff2" as="font" type="font/woff2" crossorigin="anonymous">
```

## Accessibility

### Contrast Ratios
All text meets WCAG AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Font Sizes
- Minimum body text: 14px (text-sm)
- Recommended body text: 16px (text-base)
- All text is scalable with browser zoom

### Line Height
- Body text: 1.5 (150%)
- Headings: 1.2-1.3 (120-130%)
- Ensures readability and proper spacing

## Browser Support

### Modern Browsers
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android)

### Fallback Strategy
```css
font-family: 
  var(--font-sans),           /* Geist */
  "Geist Fallback",           /* System fallback */
  ui-sans-serif,              /* System UI font */
  system-ui,                  /* System font */
  sans-serif;                 /* Generic fallback */
```

## Dark Mode Considerations

Fonts render consistently in both light and dark modes:
- Same font weights used
- Proper antialiasing applied
- No color-dependent rendering issues

## Best Practices

### DO ✅
- Use `font-sans` for all UI text
- Use `font-mono` for codes, SKUs, technical data
- Use `tabular-nums` for financial data
- Apply `tracking-tight` to large headings
- Use responsive font sizes
- Maintain consistent line heights

### DON'T ❌
- Don't use custom fonts without fallbacks
- Don't use font sizes below 12px
- Don't use too many font weights
- Don't mix font families unnecessarily
- Don't forget to test on different devices

## Testing Checklist

- [ ] Fonts load correctly on first visit
- [ ] Fallback fonts display properly
- [ ] Text is readable in both light/dark modes
- [ ] Font sizes scale responsively
- [ ] Monospace text aligns in tables
- [ ] Numbers display with tabular spacing
- [ ] Headings have proper hierarchy
- [ ] Text meets contrast requirements
- [ ] Font rendering is smooth on all browsers

## Summary

The ERP system uses a professional, modern font system with:
- ✅ Geist Sans for UI (clean, readable)
- ✅ Geist Mono for code (clear, distinct)
- ✅ Proper fallback chain
- ✅ Optimized loading
- ✅ Responsive scaling
- ✅ Accessibility compliant
- ✅ Dark mode support
- ✅ Performance optimized

The typography system provides excellent readability, professional appearance, and consistent rendering across all devices and browsers.
