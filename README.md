# Icebreaker 🧊

**Break the ice, make new friends, and earn SUI for doing it.**

Icebreaker is a social app where you can connect with others at events. Share photos, complete fun quests, and earn SUI rewards for every interaction!

## What is Icebreaker?

Icebreaker helps you meet new people at events through photo sharing, quests, and challenges. Every time you participate, you earn SUI rewards (0.003 SUI per activity). It's gamified networking that makes meeting new people fun and rewarding!

## 🚀 Features

- **Photo Sharing**: Take and share photos with the community
- **Quests & Challenges**: Complete tasks to earn points and SUI
- **Real Rewards**: Get 0.003 SUI for every upload (paid from our reward pool)
- **Live Escrow Pool Balance**: See exactly how much SUI is left in the reward pool
- **Leaderboards**: Track your points and level up

## 💰 Deployed Contracts & Pool Information

### Escrow Pool Contract
- **Package ID**: [`0xcc55d1b3e2b8f5ad42aeba278ac680fdcc7d0ccb602971346e60177ca7d9b761`](https://suiexplorer.com/object/0xcc55d1b3e2b8f5ad42aeba278ac680fdcc7d0ccb602971346e60177ca7d9b761?network=testnet)
- **Network**: Sui Testnet
- **Type**: Shared Object (Pool for reward distribution)

### Reward Pool Object
- **Object ID**: [`0x94bd6487e22a711507bd85144aca335e34996962065bbe9189c7aa7ac4c7447e`](https://suiexplorer.com/object/0x94bd6487e22a711507bd85144aca335e34996962065bbe9189c7aa7ac4c7447e?network=testnet)
- **Current Balance**: Check the live balance in the app navigation
- **Purpose**: Holds SUI for automatic rewards (0.003 SUI per upload)

### Sponsor Wallet
- **Address**: `0x29c9ea26349d4fcd9cc41620fb29d5c7bcc1da93577887fb1981681212cf66d1`
- **Purpose**: Funded wallet used to initialize and maintain the pool

## 🔄 How to Add More Money to the Pool

You can add more SUI to the reward pool using one of these methods:

### Option 1: Using Sui CLI

```bash
# Call the deposit_shared function directly
sui client call \
  --package 0xcc55d1b3e2b8f5ad42aeba278ac680fdcc7d0ccb602971346e60177ca7d9b761 \
  --module escrow_pool \
  --function deposit_shared \
  --args 0x94bd6487e22a711507bd85144aca335e34996962065bbe9189c7aa7ac4c7447e <YOUR_COIN_OBJECT_ID> \
  --gas-budget 10000000
```

### Option 2: Send SUI to the Pool Object

1. Send SUI coins to the pool object address using any Sui wallet
2. The pool will automatically accept and store them

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Blockchain**: Sui Network (Testnet)
- **Smart Contracts**: Move language
- **Rewards**: Automated via escrow pool smart contract
- **Storage**: IPFS

## 📦 Project Structure

```
icebreaker/
├── contracts/              # Sui Move smart contracts
│   ├── sources/
│   │   └── escrow_pool.move
│   └── Move.toml
├── app/                   # Next.js app directory
│   ├── api/
│   │   ├── transfer-sui/  # Reward distribution endpoint
│   │   └── pool-balance/  # Pool balance checker
│   ├── upload/            # Photo upload page
│   └── ...
├── components/            # React components
└── scripts/               # Deployment scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Sui CLI (for deployment)

### Setup

1. **Clone and install**:
```bash
git clone <repo>
cd icebreaker
pnpm install
```

2. **Configure environment**:
```bash
cp .env.example .env
# Add your sponsor wallet and pool IDs
```

3. **Run the app**:
```bash
pnpm dev
```

Visit `http://localhost:3000` and start earning SUI!

## 🎯 How Rewards Work

1. User uploads a photo/participates in activity
2. App calls the escrow pool smart contract
3. Contract withdraws 0.003 SUI from the pool
4. SUI is transferred to the user's wallet
5. Pool balance updates in real-time
6. Everyone can see how much SUI is left

## 🔒 Security

- Pool is password-protected
- Only authorized withdrawals via sponsor wallet
- All transactions on-chain and transparent
- No private keys stored in the app

## 🤝 Built For

This project was built for a hackathon as a proof of concept for:
- Gamified social networking
- Automated micro-rewards via smart contracts
- Transparent reward distribution
- On-chain pool management

