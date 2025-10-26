import 'dotenv/config'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

const poolObjectId = process.env.ESCROW_POOL_OBJECT_ID || '0x94bd6487e22a711507bd85144aca335e34996962065bbe9189c7aa7ac4c7447e'
const packageId = process.env.ESCROW_POOL_PACKAGE_ID || '0xcc55d1b3e2b8f5ad42aeba278ac680fdcc7d0ccb602971346e60177ca7d9b761'

async function depositToPool() {
  console.log('💸 Adding funds to pool...\n')

  const sponsorSecretKey = process.env.SPONSOR_SECRET_KEY
  if (!sponsorSecretKey) {
    console.error('❌ SPONSOR_SECRET_KEY not set in .env')
    process.exit(1)
  }

  const secretKeyBytes = new Uint8Array(JSON.parse(sponsorSecretKey))
  const keypair = Ed25519Keypair.fromSecretKey(secretKeyBytes)
  const client = new SuiClient({ url: getFullnodeUrl('testnet') })
  
  // Get your wallet balance
  const address = keypair.toSuiAddress()
  const balance = await client.getBalance({ owner: address })
  
  console.log(`📍 Your wallet: ${address}`)
  console.log(`💰 Balance: ${Number(balance.totalBalance) / 1e9} SUI\n`)
  
  // Get amount from command line or use default
  const args = process.argv.slice(2)
  const amountInSui = parseFloat(args[0] || '0.5')
  const amountInMist = amountInSui * 1_000_000_000
  
  console.log(`💵 Adding ${amountInSui} SUI to the pool...\n`)

  if (Number(balance.totalBalance) < amountInMist + 100_000_000) {
    console.error('❌ Insufficient balance (need gas too)')
    process.exit(1)
  }

  const coins = await client.getCoins({ owner: address })
  if (coins.data.length === 0) {
    console.error('❌ No coins found in wallet')
    process.exit(1)
  }

  // Create transaction
  const tx = new Transaction()
  const [depositCoin] = tx.splitCoins(coins.data[0].coinObjectId, [amountInMist])
  
  tx.moveCall({
    target: `${packageId}::escrow_pool::deposit_shared`,
    arguments: [
      tx.object(poolObjectId),
      depositCoin,
    ],
  })
  
  const result = await client.signAndExecuteTransaction({ 
    signer: keypair, 
    transaction: tx,
    options: { showEffects: true }
  })
  
  console.log('✅ Successfully added funds to pool!')
  console.log(`📝 Transaction: https://suiexplorer.com/txblock/${result.digest}?network=testnet\n`)
  
  // Check new balance
  const poolObject = await client.getObject({ id: poolObjectId, options: { showContent: true } })
  const poolFields = (poolObject.data?.content as any)?.fields
  const newBalance = Number(poolFields?.coin?.fields?.balance || 0) / 1e9
  
  console.log(`💰 New pool balance: ${newBalance.toFixed(3)} SUI`)
}

depositToPool().catch(console.error)

