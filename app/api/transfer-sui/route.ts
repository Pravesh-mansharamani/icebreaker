import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { bcs } from '@mysten/sui/bcs'

const REWARD_AMOUNT = 3_000_000 // 0.003 SUI in MIST

export async function POST(request: Request) {
  try {
    // Get the user's wallet address from the auth cookie
    const cookieStore = await cookies()
    const userAddress = cookieStore.get('slush_auth_token')?.value

    if (!userAddress) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get pool configuration from environment
    const poolObjectId = process.env.ESCROW_POOL_OBJECT_ID
    const poolPassword = process.env.ESCROW_POOL_PASSWORD
    const packageId = process.env.ESCROW_POOL_PACKAGE_ID

    if (!poolObjectId || !poolPassword || !packageId) {
      return NextResponse.json({ 
        error: 'Pool not configured. Please run initialization scripts.' 
      }, { status: 500 })
    }

    // Get sponsor wallet private key from environment
    const sponsorSecretKey = process.env.SPONSOR_SECRET_KEY

    if (!sponsorSecretKey) {
      return NextResponse.json({ error: 'Sponsor wallet not configured' }, { status: 500 })
    }

    // Parse the secret key
    const secretKeyArray = JSON.parse(sponsorSecretKey)
    const secretKeyBytes = new Uint8Array(secretKeyArray)

    // Create sponsor keypair from private key
    const sponsorKeypair = Ed25519Keypair.fromSecretKey(secretKeyBytes)

    // Connect to Sui network
    const client = new SuiClient({ url: getFullnodeUrl('testnet') })

    // Check pool balance
    const poolObject = await client.getObject({
      id: poolObjectId,
      options: { showContent: true }
    })

    if (!poolObject.data) {
      return NextResponse.json({ error: 'Pool not found' }, { status: 500 })
    }

    // Get the balance from the pool object - it's stored in the 'coin' field
    const poolFields = poolObject.data?.content && 'fields' in poolObject.data.content
      ? poolObject.data.content.fields as any
      : null

    if (!poolFields || !poolFields.coin) {
      return NextResponse.json({ error: 'Pool balance not accessible' }, { status: 500 })
    }

    // Get coin balance - nested structure
    const coinData = poolFields.coin
    const poolBalanceValue = BigInt(coinData.fields?.balance || 0)
    
    if (poolBalanceValue < BigInt(REWARD_AMOUNT)) {
      return NextResponse.json(
        { 
          error: 'Pool has insufficient balance',
          required: `${REWARD_AMOUNT / 1_000_000_000} SUI`,
          available: `${Number(poolBalanceValue) / 1_000_000_000} SUI`
        },
        { status: 500 }
      )
    }

    // Create transaction to withdraw from pool and transfer to user
    const tx = new Transaction()
    
    // Convert password to bytes
    const passwordBytes = new TextEncoder().encode(poolPassword)
    const passwordBcs = bcs.vector(bcs.u8()).serialize(passwordBytes)
    
    // Call withdraw_shared_and_transfer to withdraw and transfer in one operation
    tx.moveCall({
      target: `${packageId}::escrow_pool::withdraw_shared_and_transfer`,
      arguments: [
        tx.object(poolObjectId), // Pool object
        tx.pure.u64(REWARD_AMOUNT), // Amount to withdraw
        tx.pure.address(userAddress), // Recipient address
        tx.pure(passwordBcs), // Password (bytes)
      ],
    })

    // Execute the transaction
    const result = await client.signAndExecuteTransaction({
      signer: sponsorKeypair,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })

    return NextResponse.json({
      success: true,
      digest: result.digest,
      effects: result.effects,
    })
  } catch (error) {
    console.error('Failed to transfer SUI:', error)
    return NextResponse.json(
      { error: 'Failed to transfer SUI', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

