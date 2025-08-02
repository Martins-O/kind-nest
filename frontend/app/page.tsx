'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Coins, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Globe,
  CheckCircle,
  Star,
  Wallet,
  Timer,
  DollarSign
} from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  const features = [
    {
      icon: Users,
      title: "Smart Groups",
      description: "Create expense groups instantly and invite friends with wallet addresses",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "All transactions secured by smart contracts on Morph L2 blockchain", 
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      description: "Pay debts with one click and ultra-low fees on Layer 2",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Real-time Tracking",
      description: "See who owes what in real-time with automatic calculations",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Works anywhere with just a Web3 wallet - no banks required",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Timer,
      title: "No More IOUs",
      description: "Eliminate forgotten debts with transparent blockchain records",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  const benefits = [
    "Split dinner bills with friends",
    "Track roommate expenses", 
    "Manage travel costs",
    "Organize group purchases",
    "Handle office lunch orders",
    "Share subscription costs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SplitWise 3.0</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-white/80">
            <button 
              onClick={() => router.push('/features')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => router.push('/how-it-works')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              How it Works
            </button>
            <button 
              onClick={() => router.push('/about')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              About
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className={`text-center py-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-white/90 text-sm font-medium">Built on Morph L2 Blockchain</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
            Split Bills
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Like Magic
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
            The future of expense splitting is here. Create groups, add expenses, and settle debts 
            instantly with blockchain-powered transparency and security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-1 rounded-2xl">
              <div className="bg-black/50 backdrop-blur-sm rounded-xl px-8 py-4">
                <ConnectButton />
              </div>
            </div>
            <button 
              onClick={() => router.push('/how-it-works')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
            >
              <span>See how it works</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">$0</div>
              <div className="text-white/60">Transaction Fees*</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-white/60">Group Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/60">Available</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why Choose SplitWise?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Experience the next generation of expense splitting with blockchain technology
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className={`group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Use Cases */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Perfect For</h2>
            <p className="text-xl text-white/70">Any situation where you need to split costs fairly</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                <span className="text-white/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-white/70">Get started in just 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Connect your Web3 wallet and switch to Morph L2 network",
                icon: Wallet,
                color: "from-blue-500 to-indigo-500"
              },
              {
                step: "02", 
                title: "Create Group",
                description: "Set up an expense group and invite friends with their wallet addresses",
                icon: Users,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Split & Settle",
                description: "Add expenses, split automatically, and settle debts with one click",
                icon: DollarSign,
                color: "from-emerald-500 to-teal-500"
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white/50 mb-2">{step.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-white/70">{step.description}</p>
                  {index < 2 && (
                    <ArrowRight className="hidden md:block absolute top-10 -right-4 h-6 w-6 text-white/30" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center">
          <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-4xl mx-auto">
            <Star className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Split Smart?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join the revolution in expense sharing. No more calculator apps, no more forgotten IOUs, 
              no more awkward conversations about money.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-1 rounded-2xl">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl px-8 py-4">
                  <ConnectButton />
                </div>
              </div>
              <div className="text-white/60 text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Morph Holesky Testnet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Free to use*</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-semibold">SplitWise 3.0</span>
            </div>
            <div className="text-white/60 text-center md:text-right">
              <p className="mb-1">Built for the Morph Consumer Buildathon 2025</p>
              <p className="text-sm">*Gas fees apply on Morph L2 (ultra-low)</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}