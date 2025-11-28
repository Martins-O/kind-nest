# Reown AppKit & WalletConnect UI Improvements for KindNest

## Issues to Fix (Prioritized)

### 1. Missing Network Switcher Button
- AppKit provides `<appkit-network-button />` but it's not used anywhere
- Users can't easily switch networks or see current network
- Should be added to header/navigation

### 2. No Wallet Disconnect Functionality
- Users can connect but there's no visible disconnect button
- Need to add disconnect UI in header or account area
- AppKit button should show account info when connected

### 3. Missing Connection Error Handling
- No error messages when wallet connection fails
- No feedback when user rejects connection
- Need toast/notification system for wallet errors

### 4. Email/Social Login Features Hidden
- AppKit configured with email/social login but not promoted
- Landing page doesn't mention email wallet option
- Missing UI hints about alternative login methods

### 5. No Transaction Loading States
- Wallet operations (create group, settle debt) lack proper loading UI
- No visual feedback during transaction confirmation
- AppKit modal doesn't show pending transaction status

### 6. Missing Wallet Address Display
- Connected wallet address not shown in dashboard header
- No ENS name resolution display
- Users can't easily copy their address

### 7. Hardcoded Network Configuration
- Chain ID 2810 (Morph Holesky) hardcoded throughout
- Theme colors hardcoded instead of using AppKit theme variables
- RPC URLs not using AppKit's built-in network management

### 8. No Wrong Network Detection
- App doesn't warn when user is on wrong network
- No automatic network switch prompt
- Could use AppKit's network guard features

### 9. Missing Wallet Connection Prompts
- Empty states don't clearly guide users to connect wallet
- No "Connect to see your nests" messaging
- Generic error messages instead of wallet-specific guidance

### 10. No Recent Transactions Display
- AppKit supports showing recent transactions but not enabled
- No transaction history in user dashboard
- Missing links to block explorer for confirmations

### 11. Inconsistent AppKit Button Styling
- AppKit buttons wrapped in custom divs inconsistently
- Button sizes/styles vary across pages
- Should use AppKit's built-in theming more consistently

### 12. Missing Account Modal Trigger
- No easy way to open account details/settings
- AppKit provides account modal but no trigger button
- Users can't view wallet info after connecting

### 13. No Multi-Wallet Support Messaging
- Landing page doesn't showcase 600+ wallet support
- Missing wallet logos/icons in marketing materials
- Should highlight AppKit's extensive wallet compatibility

### 14. Missing Gas Sponsorship UI
- AppKit supports gas sponsorship but not configured
- No UI to show when transactions are sponsored
- Could enhance UX for users with no ETH

### 15. No Wallet Analytics Dashboard
- AppKit provides analytics but not utilized
- Could show connection trends, popular wallets
- Missing insights into user wallet preferences
