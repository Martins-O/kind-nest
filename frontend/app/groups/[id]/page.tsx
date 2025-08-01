'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Users, Receipt, DollarSign, UserPlus } from 'lucide-react';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
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

  const isGroupMember = memberInfo?.active;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{groupName || 'Loading...'}</h1>
              <p className="text-white/80">{shortenAddress(groupAddress)}</p>
            </div>
          </div>
          <ConnectButton />
        </div>

        {/* Balance Card */}
        {isGroupMember && balance !== undefined && (
          <Card className="mb-8">
            <CardContent className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Your Balance</h3>
                <p className={`text-2xl font-bold ${Number(balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(balance) >= 0 ? '+' : ''}
                  {formatETH(BigInt(balance.toString()))} ETH
                </p>
                <p className="text-sm text-gray-600">
                  {Number(balance) >= 0 ? 'You are owed money' : 'You owe money'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {isGroupMember && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Button 
              onClick={() => setShowAddMember(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
            <Button 
              onClick={() => setShowAddExpense(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        )}

        {/* Add Member Form */}
        {showAddMember && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add Group Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Wallet Address</label>
                  <Input
                    value={memberAddress}
                    onChange={(e) => setMemberAddress(e.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nickname</label>
                  <Input
                    value={memberNickname}
                    onChange={(e) => setMemberNickname(e.target.value)}
                    placeholder="How should this person appear in the group?"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" loading={addingMember}>
                    Add Member
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddMember(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Add Expense Form */}
        {showAddExpense && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="e.g., Dinner, Gas, Hotel"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (ETH)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Participants</label>
                  <div className="space-y-2">
                    {members?.map((memberAddr) => (
                      <div key={memberAddr} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(memberAddr)}
                          onChange={() => toggleParticipant(memberAddr)}
                          className="rounded"
                        />
                        <span>{shortenAddress(memberAddr)}</span>
                        {memberAddr === address && <span className="text-sm text-gray-500">(You)</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    loading={addingExpense}
                    disabled={selectedParticipants.length === 0}
                  >
                    Add Expense
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddExpense(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Members & Expenses */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Members ({members?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members?.map((memberAddr) => (
                  <div key={memberAddr} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{shortenAddress(memberAddr)}</div>
                      {memberAddr === address && <div className="text-sm text-gray-500">You</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Expenses ({expenses?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses && expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <div key={expense.id.toString()} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{expense.description}</div>
                        <div className="font-bold">{formatETH(expense.totalAmount)} ETH</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Paid by: {shortenAddress(expense.paidBy)}</div>
                        <div>Date: {formatDateTime(expense.timestamp)}</div>
                        <div>Participants: {expense.participants.length}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No expenses yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {!isGroupMember && (
          <Card className="mt-8">
            <CardContent className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">You&apos;re not a member of this group</h3>
              <p className="text-gray-600">Ask the group admin to add you as a member to participate.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function GroupDetail({ params }: any) {
  return <GroupDetailClient groupAddress={params.id} />;
}