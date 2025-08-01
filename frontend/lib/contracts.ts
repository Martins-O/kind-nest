// Auto-generated contract addresses
// Generated on: 2025-08-01T00:00:00.000Z

export const CONTRACTS = {
  EXPENSE_FACTORY: '0x1234567890123456789012345678901234567890' as const, // Will be updated after deployment
} as const;

export const NETWORK_INFO = {
  chainId: 2810,
  name: 'morphHolesky',
  rpcUrl: 'https://rpc-holesky.morphl2.io',
} as const;

// Contract ABIs
export const GROUP_TREASURY_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_groupName", "type": "string"},
      {"internalType": "address", "name": "_creator", "type": "address"},
      {"internalType": "string", "name": "_creatorNickname", "type": "string"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_member", "type": "address"},
      {"internalType": "string", "name": "_nickname", "type": "string"}
    ],
    "name": "addMember",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"},
      {"internalType": "address[]", "name": "_participants", "type": "address[]"}
    ],
    "name": "addExpense",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_creditor", "type": "address"}],
    "name": "settleDebt",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_member", "type": "address"}],
    "name": "getBalance",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_creditor", "type": "address"}],
    "name": "getDebtTo",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getExpenses",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint256", "name": "totalAmount", "type": "uint256"},
          {"internalType": "address", "name": "paidBy", "type": "address"},
          {"internalType": "address[]", "name": "participants", "type": "address[]"},
          {"internalType": "uint256[]", "name": "shares", "type": "uint256[]"},
          {"internalType": "bool", "name": "settled", "type": "bool"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "internalType": "struct GroupTreasury.Expense[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMembers",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_member", "type": "address"}],
    "name": "getMemberInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "wallet", "type": "address"},
          {"internalType": "string", "name": "nickname", "type": "string"},
          {"internalType": "uint256", "name": "totalOwed", "type": "uint256"},
          {"internalType": "uint256", "name": "totalOwing", "type": "uint256"},
          {"internalType": "bool", "name": "active", "type": "bool"}
        ],
        "internalType": "struct GroupTreasury.Member",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "groupName",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "member", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "nickname", "type": "string"}
    ],
    "name": "MemberAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "expenseId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "paidBy", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "ExpenseAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "debtor", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "creditor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "DebtSettled",
    "type": "event"
  }
] as const;

export const EXPENSE_FACTORY_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_creatorNickname", "type": "string"}
    ],
    "name": "createGroup",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserGroups",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserGroupsWithInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "groupAddress", "type": "address"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "bool", "name": "active", "type": "bool"}
        ],
        "internalType": "struct ExpenseFactory.GroupInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_groupAddress", "type": "address"}],
    "name": "getGroupInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "groupAddress", "type": "address"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "bool", "name": "active", "type": "bool"}
        ],
        "internalType": "struct ExpenseFactory.GroupInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllGroups",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "group", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"}
    ],
    "name": "GroupCreated",
    "type": "event"
  }
] as const;