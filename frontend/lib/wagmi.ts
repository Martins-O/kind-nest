'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Morph Holesky Testnet
export const morphHolesky = defineChain({
  id: 2810,
  name: 'Morph Holesky Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-holesky.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Holesky Explorer',
      url: 'https://explorer-holesky.morphl2.io',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'SplitWise 3.0',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [morphHolesky],
  ssr: true,
});