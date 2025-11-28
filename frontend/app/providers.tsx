'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { createAppKit } from '@reown/appkit/react';
import { wagmiAdapter, projectId, metadata, networks } from '@/lib/wagmi';
import { WalletErrorHandler } from '@/components/WalletErrorHandler';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

// Create the AppKit modal with custom KindNest theme
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'github', 'apple', 'facebook'],
    emailShowWallets: true,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#10b981',
    '--w3m-color-mix-strength': 40,
    '--w3m-accent': '#10b981',
    '--w3m-border-radius-master': '12px',
  },
  allWallets: 'SHOW',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletErrorHandler />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
