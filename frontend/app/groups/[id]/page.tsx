'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Users, Receipt, DollarSign, UserPlus, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  useGroupExpenses, 
  useGroupMembers, 
  useGroupName, 
  useMemberInfo,
  useMemberBalance,
  useAddMember,
  useAddExpense,
  useSettleDebt,
  useDebtTo
} from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatETH, parseETH, shortenAddress, formatDateTime } from '@/lib/utils';

function GroupDetailClient({ groupAddress }: { groupAddress: string }) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [memberAddress, setMemberAddress] = useState('');
  const [memberNickname, setMemberNickname] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Data hooks
  const { data: groupName } = useGroupName(groupAddress);
  const { data: expenses, refetch: refetchExpenses } = useGroupExpenses(groupAddress);
  const { data: members, refetch: refetchMembers } = useGroupMembers(groupAddress);
  const { data: memberInfo } = useMemberInfo(groupAddress, address);
  const { data: balance } = useMemberBalance(groupAddress, address);

  // Write hooks
  const { addMember, isPending: addingMember, isSuccess: memberAdded } = useAddMember(groupAddress);
  const { addExpense, isPending: addingExpense, isSuccess: expenseAdded } = useAddExpense(groupAddress);

  useEffect(() => {
    setIsLoaded(true);
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (memberAdded) {
      setShowAddMember(false);
      setMemberAddress('');
      setMemberNickname('');
      refetchMembers();
    }
  }, [memberAdded, refetchMembers]);

  useEffect(() => {
    if (expenseAdded) {
      setShowAddExpense(false);
      setExpenseDescription('');
      setExpenseAmount('');
      setSelectedParticipants([]);
      refetchExpenses();
      refetchMembers();
    }
  }, [expenseAdded, refetchExpenses, refetchMembers]);

  // Get member nicknames for display
  const getMemberNicknames = async () => {
    if (!members) return {};
    const nicknames: { [address: string]: string } = {};
    // This would need to be implemented with batch calls or stored locally
    return nicknames;
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberAddress.trim() && memberNickname.trim()) {
      addMember(memberAddress.trim(), memberNickname.trim());
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseDescription.trim() && expenseAmount && selectedParticipants.length > 0) {
      try {
        const amount = parseETH(expenseAmount);
        addExpense(expenseDescription.trim(), amount, selectedParticipants);
      } catch (error) {
        console.error('Invalid amount:', error);
      }
    }
  };

  const toggleParticipant = (memberAddress: string) => {
    setSelectedParticipants(prev => 
      prev.includes(memberAddress) 
        ? prev.filter(addr => addr !== memberAddress)
        : [...prev, memberAddress]
    );
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-md mx-auto text-center">
          <Wallet className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-8">Connect your Web3 wallet to access this group</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  const isGroupMember = memberInfo?.active;

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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <ConnectButton />
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Users className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-white/90 text-sm font-medium">
                Group: {shortenAddress(groupAddress)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4">
              {groupName || 'Loading...'}
            </h1>
            <p className="text-xl text-white/70">
              Manage expenses and track balances for your group
            </p>
          </div>
        </div>

        {/* Balance Card */}
        {isGroupMember && balance !== undefined && (
          <div className="mb-12">
            <div className={`bg-gradient-to-br ${Number(balance) >= 0 ? 'from-emerald-500/20 to-teal-500/20' : 'from-red-500/20 to-pink-500/20'} backdrop-blur-lg rounded-3xl p-8 border border-white/10`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Your Balance</h3>
                  <p className={`text-4xl font-black mb-3 ${Number(balance) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {Number(balance) >= 0 ? '+' : ''}
                    {formatETH(BigInt(balance.toString()))} ETH
                  </p>
                  <p className="text-white/70 text-lg">
                    {Number(balance) >= 0 ? '💰 You are owed money' : '💸 You owe money'}
                  </p>
                </div>
                <div className={`w-20 h-20 ${Number(balance) >= 0 ? 'bg-emerald-500' : 'bg-red-500'} rounded-2xl flex items-center justify-center`}>
                  <DollarSign className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {isGroupMember && (
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
            <div 
              onClick={() => setShowAddMember(true)}
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Add Member</h3>
                    <p className="text-white/70">Invite friends to join this group</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => setShowAddExpense(true)}
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Add Expense</h3>
                    <p className="text-white/70">Record a new shared expense</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Member Form */}
        {showAddMember && (
          <div className="mb-12 transition-all duration-500 ease-out">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Add Group Member</h2>
              </div>
              
              <form onSubmit={handleAddMember} className="space-y-6">
                <div>
                  <label className="block text-white/90 font-medium mb-3">Wallet Address</label>
                  <Input
                    value={memberAddress}
                    onChange={(e) => setMemberAddress(e.target.value)}
                    placeholder="0x..."
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-medium mb-3">Nickname</label>
                  <Input
                    value={memberNickname}
                    onChange={(e) => setMemberNickname(e.target.value)}
                    placeholder="How should this person appear in the group?"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    loading={addingMember}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0"
                  >
                    {addingMember ? 'Adding...' : 'Add Member'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddMember(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Expense Form */}
        {showAddExpense && (
          <div className="mb-12 transition-all duration-500 ease-out">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Add New Expense</h2>
              </div>
              
              <form onSubmit={handleAddExpense} className="space-y-6">
                <div>
                  <label className="block text-white/90 font-medium mb-3">Description</label>
                  <Input
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="e.g., Dinner, Gas, Hotel"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-medium mb-3">Amount (ETH)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.1"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-medium mb-3">Participants</label>
                  <div className="space-y-3">
                    {members?.map((memberAddr) => (
                      <div key={memberAddr} className="flex items-center space-x-3 bg-white/5 rounded-xl p-3 border border-white/10">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(memberAddr)}
                          onChange={() => toggleParticipant(memberAddr)}
                          className="w-5 h-5 rounded accent-purple-500"
                        />
                        <div className="flex-1">
                          <span className="text-white font-medium">{shortenAddress(memberAddr)}</span>
                          {memberAddr === address && <span className="text-white/60 text-sm ml-2">(You)</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    loading={addingExpense}
                    disabled={selectedParticipants.length === 0}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
                  >
                    {addingExpense ? 'Adding...' : 'Add Expense'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddExpense(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Members & Expenses */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Members */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Members ({members?.length || 0})</h2>
            </div>
            
            <div className="space-y-4">
              {members?.map((memberAddr, index) => (
                <div 
                  key={memberAddr} 
                  className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {shortenAddress(memberAddr).slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{shortenAddress(memberAddr)}</div>
                        {memberAddr === address && (
                          <div className="text-green-400 text-sm font-medium">You</div>
                        )}
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              ))}
              
              {(!members || members.length === 0) && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">No members yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Expenses ({expenses?.length || 0})</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {expenses && expenses.length > 0 ? (
                expenses.map((expense, index) => (
                  <div 
                    key={expense.id.toString()}
                    className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-white font-medium">{expense.description}</div>
                        <div className="text-orange-400 font-bold">{formatETH(expense.totalAmount)} ETH</div>
                      </div>
                      <div className="space-y-1 text-sm text-white/70">
                        <div className="flex items-center gap-2">
                          <span>💰 Paid by:</span>
                          <span className="text-white/90">{shortenAddress(expense.paidBy)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📅 Date:</span>
                          <span className="text-white/90">{formatDateTime(expense.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥 Participants:</span>
                          <span className="text-white/90">{expense.participants.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">No expenses yet</p>
                  <p className="text-white/50 text-sm">Add your first expense to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isGroupMember && (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Not a Member Yet</h3>
              <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                You're not a member of this group. Ask the group admin to add you as a member to participate in expense splitting.
              </p>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-white/60 text-sm">
                  💡 Share this group address with the admin: <br />
                  <span className="font-mono text-white/80">{shortenAddress(groupAddress)}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GroupDetail({ params }: any) {
  return <GroupDetailClient groupAddress={params.id} />;
}