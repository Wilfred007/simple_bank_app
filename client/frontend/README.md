# SimpleBank Frontend

A modern React frontend for the SimpleBank smart contract, featuring WalletConnect integration and a beautiful user interface.

## Features

- 🔗 **WalletConnect Integration**: Connect with any Web3 wallet
- 💰 **Deposit & Withdraw**: Easy ETH deposits and withdrawals
- 📊 **Real-time Balances**: View your bank balance and ETH balance
- 📈 **Contract Statistics**: Monitor total deposits and contract balance
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Web3 wallet (MetaMask, WalletConnect compatible wallet)
- Deployed SimpleBank contract on Base Sepolia or Sepolia testnet

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update contract addresses in `src/config/wagmi.js`:
```javascript
export const CONTRACT_ADDRESSES = {
  [baseSepolia.id]: 'YOUR_BASE_SEPOLIA_CONTRACT_ADDRESS',
  [sepolia.id]: 'YOUR_SEPOLIA_CONTRACT_ADDRESS',
}
```

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`.

## Configuration

### WalletConnect Project ID

The app uses WalletConnect project ID: `982f175981feaa4270a11ee31a1231d6`

### Supported Networks

- Base Sepolia (Chain ID: 84532)
- Sepolia (Chain ID: 11155111)
- Mainnet (Chain ID: 1)

### Contract Integration

The frontend automatically detects the network and uses the appropriate contract address. Make sure to update the `CONTRACT_ADDRESSES` object in `src/config/wagmi.js` with your deployed contract addresses.

## Usage

1. **Connect Wallet**: Click the connect button to link your Web3 wallet
2. **View Balances**: See your ETH balance and SimpleBank balance
3. **Deposit**: Enter an amount and click deposit to add ETH to your bank account
4. **Withdraw**: Enter an amount and click withdraw to remove ETH from your bank account
5. **Monitor**: View contract statistics including total deposits and contract balance

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SimpleBank.js      # Main banking interface
│   │   └── SimpleBank.css     # Component styles
│   ├── config/
│   │   └── wagmi.js          # WalletConnect & contract config
│   ├── App.js                # Main app component
│   ├── App.css               # Global styles
│   └── index.js              # React entry point
├── package.json
└── README.md
```

## Technologies Used

- **React 18**: Modern React with hooks
- **Wagmi**: React hooks for Ethereum
- **WalletConnect**: Web3Modal for wallet connections
- **Viem**: TypeScript interface for Ethereum
- **React Toastify**: Toast notifications
- **CSS3**: Modern styling with glassmorphism effects

## Smart Contract Integration

The frontend integrates with the SimpleBank smart contract using the following functions:

- `deposit()`: Payable function to deposit ETH
- `withdraw(uint256)`: Function to withdraw specified amount
- `getMyBalance()`: View function to get user's balance
- `getContractBalance()`: View function to get total contract balance
- `totalDeposits()`: View function to get total deposits

## Styling

The app features a modern design with:

- Glassmorphism effects with backdrop blur
- Gradient backgrounds and buttons
- Smooth hover animations
- Responsive grid layouts
- Loading states and animations
- Toast notifications for user feedback

## Development

To contribute to the frontend:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Wallet not connecting**: Ensure you have a Web3 wallet installed and enabled
2. **Network not supported**: Switch to Base Sepolia or Sepolia testnet
3. **Contract not found**: Verify the contract address is correct for your network
4. **Transaction failing**: Check you have sufficient ETH for gas fees

### Getting Test ETH

- **Sepolia**: Use [Sepolia Faucet](https://sepoliafaucet.com/)
- **Base Sepolia**: Use [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

## License

This project is part of the SimpleBank DApp and follows the same MIT license.
# simple_bank_app
