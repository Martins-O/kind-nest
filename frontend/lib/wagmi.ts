'use client';

import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
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
      http: [
        process.env.NEXT_PUBLIC_MORPH_RPC_URL || 'https://rpc-quicknode-holesky.morphl2.io',
        'https://rpc-holesky.morphl2.io',
      ],
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

// Get projectId from environment
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id';

// Define metadata
export const metadata = {
  name: 'KindNest',
  description: 'Support that feels human - A warm, community-focused platform where support flows as naturally as love',
  url: 'https://kindnest.vercel.app',
  icons: ['https://kindnest.vercel.app/favicon.ico']
};

// Define networks
export const networks = [morphHolesky];

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
});

export const config = wagmiAdapter.wagmiConfig;
