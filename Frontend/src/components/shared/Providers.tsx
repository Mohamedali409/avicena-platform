"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/store/auth.store";

// App-wide client providers: React Query cache + session hydration on mount.
export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const hydrate = useAuth((s) => s.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
