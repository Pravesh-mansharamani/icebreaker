import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

console.log(`${colors.cyan}${colors.bright}Generating New Wallet Keypair...${colors.reset}\n`)

// Generate a new Ed25519 keypair
const keypair = new Ed25519Keypair()
const address = keypair.toSuiAddress()
const secretKey = keypair.getSecretKey()

// Convert secret key to array format
const secretKeyArray = Array.from(secretKey)

console.log(`${colors.green}✅ Wallet generated successfully!${colors.reset}\n`)
console.log(`${colors.bright}Wallet Address:${colors.reset} ${address}`)
console.log(`\n${colors.yellow}Add this to your .env file:${colors.reset}`)
console.log(`${colors.cyan}SPONSOR_SECRET_KEY='${JSON.stringify(secretKeyArray)}'${colors.reset}\n`)
console.log(`${colors.yellow}⚠️  Keep this secret key safe! Never share it or commit it to version control.${colors.reset}`)
console.log(`\n${colors.yellow}Next steps:${colors.reset}`)
console.log(`1. Fund this wallet with at least 2-3 SUI on Sui Testnet`)
console.log(`2. Get testnet SUI from: https://discord.com/channels/916194776698146847/1037810567662760096`)
console.log(`3. Add the SPONSOR_SECRET_KEY to your .env file`)
console.log(`4. Run: pnpm run deploy:contract`)

