import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

export async function POST(request: Request) {
  try {
    // Get the user's wallet address from the auth cookie
    const cookieStore = await cookies()
    const userAddress = cookieStore.get('slush_auth_token')?.value

    if (!userAddress) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get sponsor wallet private key from environment
    const sponsorSecretKey = process.env.SPONSOR_SECRET_KEY

    if (!sponsorSecretKey) {
      return NextResponse.json({ error: 'Sponsor wallet not configured' }, { status: 500 })
    }

    // Parse the secret key - it's stored as an array string in .env
    const secretKeyArray = JSON.parse(sponsorSecretKey)
    const secretKeyBytes = new Uint8Array(secretKeyArray)

    // Create sponsor keypair from private key
    const sponsorKeypair = Ed25519Keypair.fromSecretKey(secretKeyBytes)
    const sponsorAddress = sponsorKeypair.toSuiAddress()

    // Connect to Sui network
    const client = new SuiClient({ url: getFullnodeUrl('testnet') })

    // Check sponsor wallet balance
    const balance = await client.getBalance({
      owner: sponsorAddress,
    })

    if (Number(balance.totalBalance) < 3_000_000) {
      return NextResponse.json(
        { error: 'Sponsor wallet has insufficient balance', 
          required: '0.003 SUI',
          current: `${Number(balance.totalBalance) / 1_000_000_000} SUI` },
        { status: 500 }
      )
    }

    // Get coins from the wallet
    const coins = await client.getCoins({
      owner: sponsorAddress,
      coinType: '0x2::sui::SUI'
    })

    if (coins.data.length === 0) {
      return NextResponse.json(
        { error: 'No SUI coins found in sponsor wallet' },
        { status: 500 }
      )
    }

    // Create transaction to transfer 0.0030 SUI (3,000,000 MIST)
    const tx = new Transaction()
    
    // Use the first coin for the transfer (it will also handle gas automatically)
    const primaryCoin = coins.data[0].coinObjectId
    
    // Split 0.003 SUI (3,000,000 MIST) from the primary coin and transfer it
    const [coin] = tx.splitCoins(primaryCoin, [3000000])
    tx.transferObjects([coin], userAddress)

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

