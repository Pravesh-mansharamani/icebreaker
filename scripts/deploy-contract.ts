import 'dotenv/config'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import * as fs from 'fs'
import * as path from 'path'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

async function deployContract() {
  console.log(`${colors.cyan}${colors.bright}Deploying Icebreaker Escrow Pool Contract...${colors.reset}\n`)

  try {
    // Get the sponsor wallet private key from environment
    const sponsorSecretKey = process.env.SPONSOR_SECRET_KEY
    if (!sponsorSecretKey) {
      console.error(`${colors.red}Error: SPONSOR_SECRET_KEY environment variable not set${colors.reset}`)
      console.log(`\n${colors.yellow}Instructions:${colors.reset}`)
      console.log(`1. Create a .env file in the project root`)
      console.log(`2. Get your wallet secret key using one of these methods:`)
      console.log(`   ${colors.cyan}Option A:${colors.reset} If you already have a wallet with funds:`)
      console.log(`   - Check your wallet app for the private key`)
      console.log(`   - It should be a JSON array: [1,2,3,...]`)
      console.log(`   ${colors.cyan}Option B:${colors.reset} Generate a new keypair:`)
      console.log(`   - Run: sui keytool generate ed25519`)
      console.log(`   - Save the output`)
      console.log(`\n3. Add to your .env file:`)
      console.log(`   ${colors.bright}SPONSOR_SECRET_KEY='[YOUR_SECRET_KEY_ARRAY]'${colors.reset}`)
      console.log(`\n${colors.yellow}Note:${colors.reset} Make sure the wallet has at least 2-3 SUI on Testnet for deployment.`)
      process.exit(1)
    }

    // Parse the secret key
    let sponsorKeypair: Ed25519Keypair
    
    try {
      // Remove quotes and parse JSON
      const cleaned = sponsorSecretKey.replace(/^['"]|['"]$/g, '')
      const secretKeyArray = JSON.parse(cleaned)
      
      // Convert to Uint8Array - handle both numeric and string arrays
      const bytes = secretKeyArray.map((item: any) => 
        typeof item === 'string' ? item.charCodeAt(0) : item
      )
      
      const secretKeyBytes = new Uint8Array(bytes)
      
      // Ed25519 expects 64 bytes (32 byte private key + 32 byte public key)
      // or 32 bytes (just private key)
      if (secretKeyBytes.length === 32) {
        // Private key only
        sponsorKeypair = Ed25519Keypair.fromSecretKey(secretKeyBytes)
      } else if (secretKeyBytes.length === 64) {
        // Full keypair
        sponsorKeypair = Ed25519Keypair.fromSecretKey(secretKeyBytes)
      } else {
        console.error(`${colors.red}Secret key should be 32 or 64 bytes, got ${secretKeyBytes.length}${colors.reset}`)
        process.exit(1)
      }
    } catch (error) {
      console.error(`${colors.red}Failed to parse secret key: ${error}${colors.reset}`)
      console.log(`Secret key should be a JSON array with 32 or 64 elements`)
      process.exit(1)
    }
    const sponsorAddress = sponsorKeypair.toSuiAddress()

    console.log(`${colors.yellow}Using sponsor address: ${sponsorAddress}${colors.reset}`)

    // Connect to Sui network
    const client = new SuiClient({ url: getFullnodeUrl('testnet') })
    console.log(`${colors.yellow}Connected to Sui Testnet${colors.reset}\n`)

    // Check sponsor wallet balance
    const balance = await client.getBalance({ owner: sponsorAddress })
    const balanceInSui = Number(balance.totalBalance) / 1_000_000_000
    console.log(`${colors.cyan}Sponsor balance: ${balanceInSui} SUI${colors.reset}`)

    // Read the Move contract
    const contractPath = path.join(process.cwd(), 'sources', 'escrow_pool.move')
    if (!fs.existsSync(contractPath)) {
      console.error(`${colors.red}Error: Contract file not found at ${contractPath}${colors.reset}`)
      process.exit(1)
    }

    console.log(`\n${colors.cyan}Publishing package...${colors.reset}`)

    // Publish the package
    const { execSync } = require('child_process')
    
    // Build the package first
    console.log(`Building Move package...`)
    execSync('sui move build', { cwd: process.cwd(), stdio: 'inherit' })
    
    console.log(`Publishing package...`)
    const publishOutput = execSync('sui client publish --gas-budget 100000000 --json', { 
      cwd: process.cwd(),
      encoding: 'utf8' 
    })
    
    const publishResult = JSON.parse(publishOutput)
    
    // Extract package ID from the result
    let packageId = null
    
    if (publishResult.publishedAt) {
      packageId = publishResult.publishedAt
    } else if (publishResult.objectChanges) {
      // Find the package creation in objectChanges
      const packageChange = publishResult.objectChanges.find(
        (change: any) => change.type === 'published'
      )
      packageId = packageChange?.packageId || packageChange
    } else if (publishResult.effects?.created) {
      packageId = publishResult.effects.created[0]?.reference?.objectId
    }
    
    // Fallback: try to extract from output
    if (!packageId && publishResult.transaction) {
      const txResponse = await client.getTransactionBlock({
        digest: publishResult.transaction,
        options: { showObjectChanges: true }
      })
      
      const publishedPackage = txResponse.objectChanges?.find(
        (change: any) => change.type === 'published'
      )
      packageId = publishedPackage?.packageId
    }
    
    console.log(`\n${colors.green}✅ Contract deployed successfully!${colors.reset}`)
    
    if (packageId) {
      console.log(`${colors.bright}Package ID: ${packageId}${colors.reset}`)
      console.log(`\nNext steps:`)
      console.log(`1. Save the package ID in your .env file:`)
      console.log(`   ESCROW_POOL_PACKAGE_ID="${packageId}"`)
      console.log(`2. Run the initialization script to create and fund the pool`)
    } else {
      console.log(`${colors.yellow}⚠️  Could not extract package ID from deployment response${colors.reset}`)
      console.log(`\nPlease check the transaction manually:`)
      console.log(`Transaction: ${publishResult.digest || 'N/A'}`)
      console.log(`Raw response:`, JSON.stringify(publishResult, null, 2))
    }
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error instanceof Error ? error.message : 'Unknown error'}${colors.reset}`)
    console.error(error)
    process.exit(1)
  }
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

