"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Light on first visit (not the OS preference); after that next-themes
    // persists the user's pick in localStorage and applies it before paint.
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="naano-theme">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
