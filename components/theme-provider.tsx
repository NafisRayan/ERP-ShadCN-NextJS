'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme as _useTheme,
} from 'next-themes'

// A small wrapper around next-themes ThemeProvider that enables class
// based theming (documentElement will receive the active theme as a class).
// We also export the useTheme hook from next-themes so components can read
// and write the current theme.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} attribute="class" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  )
}

// Re-export the hook with a stable name for other components to import from
export const useTheme = _useTheme
