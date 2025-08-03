'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, EXPENSE_FACTORY_ABI, GROUP_TREASURY_ABI } from './contracts';
import { shortenAddress } from './utils';
import type { GroupInfo, Expense, Member } from '@/types';

// Factory hooks
export function useCreateGroup() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createGroup = (name: string, creatorNickname: string) => {
    writeContract({
      address: CONTRACTS.EXPENSE_FACTORY,
      abi: EXPENSE_FACTORY_ABI,
      functionName: 'createGroup',
      args: [name, creatorNickname],
    } as any);
  };

  return {
    createGroup,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

export function useUserGroups(userAddress?: string) {
  return useReadContract({
    address: CONTRACTS.EXPENSE_FACTORY,
    abi: EXPENSE_FACTORY_ABI,
    functionName: 'getUserGroups',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
      refetchInterval: 10000, // Refetch every 10 seconds
      staleTime: 5000, // Consider data stale after 5 seconds
    },
  });
}

export function useGroupInfo(groupAddress?: string) {
  return useReadContract({
    address: CONTRACTS.EXPENSE_FACTORY,
    abi: EXPENSE_FACTORY_ABI,
    functionName: 'getGroupInfo',
    args: groupAddress ? [groupAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!groupAddress,
    },
  });
}

// Group Treasury hooks
export function useGroupExpenses(groupAddress?: string, offset = 0, limit = 10) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'getExpensesPaginated',
    args: [BigInt(offset), BigInt(limit)],
    query: {
      enabled: !!groupAddress,
    },
  });
}

export function useGroupMembers(groupAddress?: string, offset = 0, limit = 20) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'getMembersPaginated',
    args: [BigInt(offset), BigInt(limit)],
    query: {
      enabled: !!groupAddress,
    },
  });
}

export function useGroupName(groupAddress?: string) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'groupName',
    query: {
      enabled: !!groupAddress,
    },
  });
}

export function useMemberInfo(groupAddress?: string, memberAddress?: string) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'getMemberInfo',
    args: memberAddress ? [memberAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!(groupAddress && memberAddress),
      retry: false, // Don't retry on revert
    },
  });
}

export function useMemberBalance(groupAddress?: string, memberAddress?: string) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'getBalance',
    args: memberAddress ? [memberAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!(groupAddress && memberAddress),
      retry: false, // Don't retry on revert
    },
  });
}

export function useDebtTo(groupAddress?: string, creditorAddress?: string) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'getDebtTo',
    args: creditorAddress ? [creditorAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!(groupAddress && creditorAddress),
    },
  });
}

// Helper hook to check if user is a member by checking the members list
export function useIsMember(groupAddress?: string, userAddress?: string) {
  const { data: membersData } = useGroupMembers(groupAddress);
  const members = membersData ? membersData[0] : [];
  
  if (!userAddress || !members) return false;
  
  return members.some(member => member.toLowerCase() === userAddress.toLowerCase());
}

// Helper hook to get member nickname
export function useMemberNickname(groupAddress?: string, memberAddress?: string) {
  const { data: memberInfo } = useMemberInfo(groupAddress, memberAddress);
  return memberInfo?.nickname || shortenAddress(memberAddress || '');
}

export function useCreationFee() {
  return useReadContract({
    address: CONTRACTS.EXPENSE_FACTORY,
    abi: EXPENSE_FACTORY_ABI,
    functionName: 'creationFee',
  });
}

export function useDeactivateGroup() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deactivateGroup = (groupAddress: string) => {
    writeContract({
      address: CONTRACTS.EXPENSE_FACTORY,
      abi: EXPENSE_FACTORY_ABI,
      functionName: 'deactivateGroup',
      args: [groupAddress as `0x${string}`],
    } as any);
  };

  return {
    deactivateGroup,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

// Write functions
export function useAddMember(groupAddress: string) {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const addMember = (memberAddress: string, nickname: string) => {
    writeContract({
      address: groupAddress as `0x${string}`,
      abi: GROUP_TREASURY_ABI,
      functionName: 'addMember',
      args: [memberAddress as `0x${string}`, nickname],
    } as any);
  };

  return {
    addMember,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

export function useAddExpense(groupAddress: string) {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const addExpense = (description: string, amount: bigint, participants: string[], receiptHash: string = '0x0000000000000000000000000000000000000000000000000000000000000000') => {
    writeContract({
      address: groupAddress as `0x${string}`,
      abi: GROUP_TREASURY_ABI,
      functionName: 'addExpense',
      args: [description, amount, participants.map(p => p as `0x${string}`), receiptHash as `0x${string}`],
    } as any);
  };

  return {
    addExpense,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

export function useSettleDebt(groupAddress: string) {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const settleDebt = (creditorAddress: string, amount: bigint) => {
    writeContract({
      address: groupAddress as `0x${string}`,
      abi: GROUP_TREASURY_ABI,
      functionName: 'settleDebt',
      args: [creditorAddress as `0x${string}`],
      value: amount,
    } as any);
  };

  return {
    settleDebt,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}