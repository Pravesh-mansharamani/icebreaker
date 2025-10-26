import 'dotenv/config'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

async function fixSecretKey() {
  const sponsorSecretKey = process.env.SPONSOR_SECRET_KEY

  if (!sponsorSecretKey) {
    console.log(`${colors.yellow}No secret key found. Generating a new one...${colors.reset}\n`)
    
    const keypair = new Ed25519Keypair()
    const address = keypair.toSuiAddress()
    const secretKey = Array.from(keypair.getSecretKey())
    
    console.log(`${colors.green}✅ New wallet generated!${colors.reset}\n`)
    console.log(`${colors.bright}Wallet Address:${colors.reset} ${address}`)
    console.log(`\n${colors.yellow}Add this to your .env file:${colors.reset}`)
    console.log(`${colors.cyan}SPONSOR_SECRET_KEY='${JSON.stringify(secretKey)}'${colors.reset}\n`)
    return
  }

  console.log(`${colors.cyan}Attempting to fix secret key...${colors.reset}\n`)

  try {
    // Remove quotes and parse JSON
    const cleaned = sponsorSecretKey.replace(/^['"]|['"]$/g, '')
    const secretKeyArray = JSON.parse(cleaned)
    
    // Convert string array to numeric array
    const numericArray = secretKeyArray.map((item: string | number) => 
      typeof item === 'string' ? item.charCodeAt(0) : item
    )
    
    const secretKeyBytes = new Uint8Array(numericArray)
    
    // Try to create keypair
    const sponsorKeypair = Ed25519Keypair.fromSecretKey(secretKeyBytes)
    const sponsorAddress = sponsorKeypair.toSuiAddress()
    
    console.log(`${colors.green}✅ Secret key is valid!${colors.reset}\n`)
    console.log(`${colors.bright}Wallet Address:${colors.reset} ${sponsorAddress}\n`)
    
  } catch (error) {
    console.error(`${colors.red}Secret key is invalid or corrupted${colors.reset}`)
    console.log(`\n${colors.yellow}Generating a new wallet...${colors.reset}\n`)
    
    const keypair = new Ed25519Keypair()
    const address = keypair.toSuiAddress()
    const secretKey = Array.from(keypair.getSecretKey())
    
    console.log(`${colors.green}✅ New wallet generated!${colors.reset}\n`)
    console.log(`${colors.bright}Wallet Address:${colors.reset} ${address}`)
    console.log(`\n${colors.yellow}Add this to your .env file:${colors.reset}`)
    console.log(`${colors.cyan}SPONSOR_SECRET_KEY='${JSON.stringify(secretKey)}'${colors.reset}\n`)
  }
}

fixSecretKey()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

