'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Plus, 
  Users, 
  Wallet, 
  Sparkles,
  ArrowLeft,
  Crown,
  Calendar,
  Activity,
  Star
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useUserGroups, useCreateGroup } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDate, shortenAddress } from '@/lib/utils';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: userGroupsData, isLoading: groupsLoading, refetch } = useUserGroups(address);
  const { createGroup, isPending, isConfirming, isSuccess } = useCreateGroup();

  useEffect(() => {
    setIsLoaded(true);
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (isSuccess) {
      setShowCreateGroup(false);
      setGroupName('');
      setNickname('');
      refetch();
    }
  }, [isSuccess, refetch]);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && nickname.trim()) {
      createGroup(groupName.trim(), nickname.trim());
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-md mx-auto text-center">
          <Wallet className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-8">Connect your Web3 wallet to access your expense groups</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  const groupCount = userGroupsData?.length || 0;
  const adminGroups = userGroupsData?.filter(group => group.creator === address).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </button>
            </div>
            <ConnectButton />
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-white/90 text-sm font-medium">
                Connected: {shortenAddress(address)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4">
              Your Groups
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Manage your expense splitting groups and track your finances
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{groupCount}</div>
                  <div className="text-white/70">Total Groups</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{adminGroups}</div>
                  <div className="text-white/70">Admin Groups</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-white/70">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Group Form */}
        {showCreateGroup && (
          <div className="mb-8 transition-all duration-500 ease-out">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Create New Group</h2>
              </div>
              
              <form onSubmit={handleCreateGroup} className="space-y-6">
                <div>
                  <label className="block text-white/90 font-medium mb-3">Group Name</label>
                  <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Weekend Trip, Roommates, Office Lunch"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-medium mb-3">Your Nickname</label>
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="How should others see you in this group?"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    loading={isPending || isConfirming}
                    disabled={!groupName.trim() || !nickname.trim()}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
                  >
                    {isPending || isConfirming ? 'Creating...' : 'Create Group'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateGroup(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Groups Grid */}
        <div className="space-y-8">
          {/* Create Group Card */}
          {!showCreateGroup && (
            <div 
              onClick={() => setShowCreateGroup(true)}
              className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-dashed border-white/20 hover:border-white/40 transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Create New Group</h3>
                  <p className="text-white/70 text-lg">Start splitting expenses with friends and family</p>
                </div>
              </div>
            </div>
          )}

          {/* User Groups */}
          {groupsLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span className="text-white font-medium">Loading your groups...</span>
              </div>
            </div>
          ) : userGroupsData && userGroupsData.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Your Groups</h2>
                <p className="text-white/70">Click on any group to manage expenses</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {userGroupsData.map((group, index) => (
                  <div
                    key={group.groupAddress}
                    className={`group cursor-pointer transition-all duration-500 hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onClick={() => router.push(`/groups/${group.groupAddress}`)}
                  >
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-pink-200 transition-colors">
                            {group.name}
                          </h3>
                          {group.creator === address && (
                            <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                              <Crown className="h-3 w-3" />
                              <span>Admin</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/70">
                          <Wallet className="h-4 w-4" />
                          <span className="text-sm font-mono">{shortenAddress(group.groupAddress)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Created {formatDate(group.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Click to manage</span>
                          <Star className="h-4 w-4 text-white/40 group-hover:text-yellow-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">No Groups Yet</h3>
                <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                  Create your first group to start splitting expenses with friends and family
                </p>
                <Button 
                  onClick={() => setShowCreateGroup(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Group
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}