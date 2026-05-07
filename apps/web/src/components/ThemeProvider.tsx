'use client';

// App is dark-mode only. This provider is kept for compatibility
// with components that call useTheme(). It always returns 'dark'.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
