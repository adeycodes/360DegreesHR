"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * QueryProvider wraps your application in the QueryClientProvider.
 * It uses useState to ensure the QueryClient is initialized only once 
 * and persists across re-renders in the client browser.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
    // We initialize the QueryClient here. 
    // We use lazy initialization inside useState to prevent creating a 
    // new client on every single render.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // How long before data becomes stale (refetch triggered on mount/focus)
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}