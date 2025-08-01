# SplitWise 3.0 - Smart Contract Expense Splitting

A modern expense splitting application built on Morph L2 blockchain that automatically splits bills between friends using smart contracts.

Built for the **Morph Consumer Buildathon 2025** 🏆

## 🌟 Features

- **Smart Contract Powered**: Transparent, automated expense splitting with blockchain security
- **Group Management**: Create and manage expense groups with friends
- **Automatic Splitting**: Fair division of expenses among participants
- **Instant Settlement**: Pay debts directly through smart contracts
- **Low Fees**: Built on Morph L2 for affordable transactions
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## 🏗️ Architecture

### Smart Contracts
- **ExpenseFactory.sol**: Creates and manages expense groups
- **GroupTreasury.sol**: Handles expense tracking, splitting, and settlements
- Built with Solidity ^0.8.20 and OpenZeppelin contracts

### Frontend
- **Next.js 15** with React 19
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **wagmi v2** and **RainbowKit** for Web3 integration
- **Viem** for Ethereum interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible wallet
- ETH on Morph Holesky Testnet (get from [faucet](https://bridge-holesky.morphl2.io/faucet))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd splitwise3-mvp
   ```

2. **Install contract dependencies**
   ```bash
   cd contracts
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Smart Contract Deployment

1. **Configure environment**
   ```bash
   cd contracts
   cp .env.example .env
   # Edit .env with your private key
   ```

2. **Deploy to Morph Holesky**
   ```bash
   npm run deploy:morph
   ```

3. **Verify contracts (optional)**
   ```bash
   npm run verify <FACTORY_ADDRESS>
   ```

### Frontend Setup

1. **Configure environment**
   ```bash
   cd frontend
   cp .env.example .env.local
   # Update with deployed contract address and WalletConnect project ID
   ```

2. **Update contract address**
   The deployment script automatically updates `frontend/lib/contracts.ts` with the deployed factory address.

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

## 📱 Usage Guide

### 1. Connect Wallet
- Open the application
- Click "Connect Wallet"
- Ensure you're on Morph Holesky Testnet (Chain ID: 2810)

### 2. Create a Group
- Click "Create New Group"
- Enter group name and your nickname
- Confirm transaction

### 3. Add Members
- Open your group
- Click "Add Member"
- Enter member's wallet address and nickname
- Confirm transaction (only group creator can add members)

### 4. Add Expenses
- Click "Add Expense"
- Enter description and amount in ETH
- Select participants
- Confirm transaction

### 5. View Balances
- See your balance (positive = owed money, negative = you owe)
- View all group expenses and members

### 6. Settle Debts
- Click on debt amount to pay
- Confirm transaction with exact debt amount

## 🔧 Configuration

### Network Configuration
- **Network**: Morph Holesky Testnet
- **Chain ID**: 2810
- **RPC URL**: https://rpc-holesky.morphl2.io
- **Explorer**: https://explorer-holesky.morphl2.io
- **Faucet**: https://bridge-holesky.morphl2.io/faucet

### Environment Variables

#### Contracts (.env)
```bash
PRIVATE_KEY=0x... # Your deployment wallet private key
MORPH_RPC_URL=https://rpc-holesky.morphl2.io
ETHERSCAN_API_KEY=abc # For contract verification
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_MORPH_RPC_URL=https://rpc-holesky.morphl2.io
NEXT_PUBLIC_EXPENSE_FACTORY_ADDRESS=0x... # Deployed factory address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=... # Your WalletConnect project ID
```

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
npm run test
npm run compile # Compile contracts
```

### Frontend
```bash
cd frontend
npm run build # Test build
npm run type-check # TypeScript checking
npm run lint # ESLint
```

## 📂 Project Structure

```
splitwise3-mvp/
├── contracts/                 # Smart contracts
│   ├── contracts/
│   │   ├── GroupTreasury.sol  # Main expense logic
│   │   └── ExpenseFactory.sol # Group creation
│   ├── scripts/
│   │   └── deploy.js          # Deployment script
│   ├── test/                  # Contract tests
│   └── hardhat.config.js      # Hardhat config
├── frontend/                  # Next.js application
│   ├── app/                   # App router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and hooks
│   └── types/                 # TypeScript types
└── README.md
```

## 🔐 Security Considerations

- Contracts use OpenZeppelin's security modules (ReentrancyGuard, Ownable)
- Only group creators can add members
- Debt settlements require exact payment amounts
- All transactions are transparent on-chain

## 🌐 Deployment

### Smart Contracts
Contracts are deployed on Morph Holesky Testnet:
- Factory Address: [Will be updated after deployment]
- Explorer: https://explorer-holesky.morphl2.io

### Frontend
The frontend can be deployed to any static hosting service:
- Vercel (recommended)
- Netlify
- GitHub Pages

```bash
cd frontend
npm run build
npm run start # Production server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🏆 Hackathon Submission

This project was built for the **Morph Consumer Buildathon 2025** with a focus on:
- Consumer-facing blockchain applications
- Smart contract automation
- Modern Web3 UX
- Real-world utility

### Demo Video
[Link to demo video will be added]

### Live Demo
[Link to deployed application will be added]

## 📞 Support

- **Morph Documentation**: https://docs.morphl2.io/
- **Discord**: [Morph Discord](https://discord.gg/L2Morph)
- **Issues**: Create an issue in this repository

## 🚀 Next Steps

Future enhancements could include:
- Telegram bot integration
- Receipt scanning with OCR
- Multi-currency support
- Mobile app
- Gas optimization
- Advanced analytics

---

**Built with ❤️ for the Morph L2 ecosystem**