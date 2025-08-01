'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, EXPENSE_FACTORY_ABI, GROUP_TREASURY_ABI } from './contracts';
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
    });
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
    functionName: 'getUserGroupsWithInfo',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });
}

// Group Treasury hooks
export function useGroupExpenses(groupAddress?: string) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'getExpenses',
    query: {
      enabled: !!groupAddress,
    },
  });
}

export function useGroupMembers(groupAddress?: string) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'getMembers',
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
    args: memberAddress ? [memberAddress] : undefined,
    query: {
      enabled: !!(groupAddress && memberAddress),
    },
  });
}

export function useMemberBalance(groupAddress?: string, memberAddress?: string) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'getBalance',
    args: memberAddress ? [memberAddress] : undefined,
    query: {
      enabled: !!(groupAddress && memberAddress),
    },
  });
}

export function useDebtTo(groupAddress?: string, creditorAddress?: string) {
  return useReadContract({
    address: groupAddress as `0x${string}`,
    abi: GROUP_TREASURY_ABI,
    functionName: 'getDebtTo',
    args: creditorAddress ? [creditorAddress] : undefined,
    query: {
      enabled: !!(groupAddress && creditorAddress),
    },
  });
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
      args: [memberAddress, nickname],
    });
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

  const addExpense = (description: string, amount: bigint, participants: string[]) => {
    writeContract({
      address: groupAddress as `0x${string}`,
      abi: GROUP_TREASURY_ABI,
      functionName: 'addExpense',
      args: [description, amount, participants],
    });
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
      args: [creditorAddress],
      value: amount,
    });
  };

  return {
    settleDebt,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}