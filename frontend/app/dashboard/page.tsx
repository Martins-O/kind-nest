'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, Users, Receipt, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useUserGroups, useCreateGroup } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { formatDate, shortenAddress } from '@/lib/utils';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [nickname, setNickname] = useState('');

  const { data: userGroupsData, isLoading: groupsLoading, refetch } = useUserGroups(address);
  const { createGroup, isPending, isConfirming, isSuccess } = useCreateGroup();

  useEffect(() => {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
        <Card className="p-8">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Please connect your wallet</h2>
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Groups</h1>
            <p className="text-white/80">Manage your expense splitting groups</p>
          </div>
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>

        {/* Create Group Form */}
        {showCreateGroup && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Group Name</label>
                  <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Weekend Trip, Roommates, Office Lunch"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Nickname</label>
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="How should others see you in this group?"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    loading={isPending || isConfirming}
                    disabled={!groupName.trim() || !nickname.trim()}
                  >
                    Create Group
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateGroup(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Groups Grid */}
        <div className="grid gap-6">
          {/* Create Group Card */}
          {!showCreateGroup && (
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
              <CardContent 
                className="flex flex-col items-center justify-center py-12 text-center"
                onClick={() => setShowCreateGroup(true)}
              >
                <Plus className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Create New Group</h3>
                <p className="text-gray-500">Start splitting expenses with friends</p>
              </CardContent>
            </Card>
          )}

          {/* User Groups */}
          {groupsLoading ? (
            <div className="text-center py-8">
              <div className="text-white">Loading your groups...</div>
            </div>
          ) : userGroupsData && userGroupsData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGroupsData.map((group) => (
                <Card 
                  key={group.groupAddress}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/groups/${group.groupAddress}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {group.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        {shortenAddress(group.groupAddress)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Created {formatDate(group.createdAt)}
                      </div>
                      {group.creator === address && (
                        <div className="text-blue-600 font-medium">
                          You&apos;re the admin
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No groups yet</h3>
                <p className="text-gray-500 mb-4">Create your first group to start splitting expenses</p>
                <Button onClick={() => setShowCreateGroup(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}