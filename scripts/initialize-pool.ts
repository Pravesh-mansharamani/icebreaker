import 'dotenv/config'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

async function initializePool() {
  console.log(`${colors.cyan}${colors.bright}Initializing Icebreaker Reward Pool...${colors.reset}\n`)

  try {
    const packageId = process.env.ESCROW_POOL_PACKAGE_ID
    if (!packageId) {
      console.error(`${colors.red}Error: ESCROW_POOL_PACKAGE_ID not set${colors.reset}`)
      console.log(`Run the deploy script first and add the package ID to .env`)
      process.exit(1)
    }

    const sponsorSecretKey = process.env.SPONSOR_SECRET_KEY
    if (!sponsorSecretKey) {
      console.error(`${colors.red}Error: SPONSOR_SECRET_KEY not set${colors.reset}`)
      process.exit(1)
    }

    const initialFunding = process.env.POOL_INITIAL_FUNDING || '0.5' // Default 0.5 SUI
    
    // Parse the secret key
    const secretKeyArray = JSON.parse(sponsorSecretKey)
    const secretKeyBytes = new Uint8Array(secretKeyArray)
    const sponsorKeypair = Ed25519Keypair.fromSecretKey(secretKeyBytes)
    const sponsorAddress = sponsorKeypair.toSuiAddress()

    console.log(`${colors.yellow}Using sponsor address: ${sponsorAddress}${colors.reset}`)

    const client = new SuiClient({ url: getFullnodeUrl('testnet') })
    console.log(`${colors.yellow}Connected to Sui Testnet${colors.reset}\n`)

    // Check balance
    const balance = await client.getBalance({ owner: sponsorAddress })
    const balanceInSui = Number(balance.totalBalance) / 1_000_000_000
    const fundingAmountMist = parseFloat(initialFunding) * 1_000_000_000

    console.log(`${colors.cyan}Sponsor balance: ${balanceInSui} SUI${colors.reset}`)
    console.log(`${colors.cyan}Initial funding amount: ${initialFunding} SUI${colors.reset}`)

    // Need gas fees too, so check for funding + 0.2 SUI for gas
    if (Number(balance.totalBalance) < fundingAmountMist + 200_000_000) {
      console.error(`${colors.red}Error: Insufficient balance to fund the pool${colors.reset}`)
      console.log(`${colors.yellow}Need: ${(fundingAmountMist + 200_000_000) / 1_000_000_000} SUI (${initialFunding} SUI for pool + 0.2 SUI for gas)${colors.reset}`)
      console.log(`${colors.yellow}Have: ${balanceInSui} SUI${colors.reset}`)
      process.exit(1)
    }

    // Get coins
    const coins = await client.getCoins({ owner: sponsorAddress, coinType: '0x2::sui::SUI' })
    if (coins.data.length === 0) {
      console.error(`${colors.red}Error: No SUI coins found${colors.reset}`)
      process.exit(1)
    }

    console.log(`\n${colors.cyan}Creating transaction...${colors.reset}`)

    // Create password (you can change this to any password)
    const password = 'icebreaker2024'
    const passwordBytes = new TextEncoder().encode(password)

    // Build transaction
    const tx = new Transaction()
    
    // Serialize password bytes properly for Move vector<u8>
    const { bcs } = await import('@mysten/sui/bcs')
    const passwordBcs = bcs.vector(bcs.u8()).serialize(passwordBytes)
    
    // Split the funding coin - leave enough for gas
    const primaryCoin = coins.data[0].coinObjectId
    const [fundingCoin] = tx.splitCoins(primaryCoin, [fundingAmountMist])
    
    // Call initialize_pool with the funding coin  
    tx.moveCall({
      target: `${packageId}::escrow_pool::initialize_pool`,
      arguments: [
        fundingCoin, 
        tx.pure(passwordBcs)
      ],
    })

    console.log(`${colors.cyan}Executing transaction with gas budget...${colors.reset}`)

    const result = await client.signAndExecuteTransaction({
      signer: sponsorKeypair,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
      config: {
        gas: primaryCoin
      }
    })

    console.log(`\n${colors.green}✅ Pool initialized successfully!${colors.reset}`)

    // Find the pool object ID from the object changes
    const poolObjectId = result.objectChanges?.find(
      (change) => change.type === 'created' && change.objectType?.includes('Pool')
    )?.objectId

    if (poolObjectId) {
      console.log(`\n${colors.bright}Pool Object ID: ${poolObjectId}${colors.reset}`)
      console.log(`\nAdd these to your .env file:`)
      console.log(`ESCROW_POOL_OBJECT_ID="${poolObjectId}"`)
      console.log(`ESCROW_POOL_PASSWORD="${password}"`)
      console.log(`\n${colors.yellow}⚠️  Keep the password secure!${colors.reset}`)
    }

    console.log(`\n${colors.green}Your reward pool is ready to use!${colors.reset}`)
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error instanceof Error ? error.message : 'Unknown error'}${colors.reset}`)
    console.error(error)
    process.exit(1)
  }
}

initializePool()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

