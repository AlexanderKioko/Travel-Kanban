"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner'; 

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ErrorBoundary
          fallback={<div className="min-h-screen flex items-center justify-center">Something went wrong. Refresh or contact support.</div>}
          onError={(error) => toast.error('Unexpected error', { description: error.message })}
        >
          {/* Wrap with TooltipProvider to enable tooltips globally */}
          <TooltipProvider delayDuration={300} skipDelayDuration={100}>
            {children}
          </TooltipProvider>
        </ErrorBoundary>

        {/* Toast notifications */}
        <Toaster richColors position="top-right" duration={3000} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}