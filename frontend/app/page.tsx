'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Coins, Users, Shield, Zap } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Coins className="h-16 w-16 text-white mr-4" />
            <h1 className="text-6xl font-bold text-white">
              SplitWise 3.0
            </h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Automatically split expenses with your friends using smart contracts on Morph L2. 
            No more awkward money conversations!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <Users className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Group Management</h3>
            <p className="text-white/80">
              Create expense groups with friends and track who owes what
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <Shield className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Smart Contracts</h3>
            <p className="text-white/80">
              Transparent, automated expense splitting with blockchain security
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <Zap className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Instant Settlement</h3>
            <p className="text-white/80">
              Pay your debts instantly with low fees on Morph L2
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Get Started
            </h2>
            <p className="text-white/80 mb-6">
              Connect your wallet to start splitting expenses with smart contracts
            </p>
            <ConnectButton />
            <p className="text-sm text-white/60 mt-4">
              Make sure you&apos;re connected to Morph Holesky Testnet
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-white/60">
            Built for the Morph Consumer Buildathon 2025
          </p>
        </div>
      </div>
    </div>
  );
}