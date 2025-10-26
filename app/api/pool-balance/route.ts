import { NextResponse } from 'next/server'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'

export async function GET() {
  try {
    const poolObjectId = process.env.ESCROW_POOL_OBJECT_ID

    if (!poolObjectId) {
      return NextResponse.json({ error: 'Pool not configured' }, { status: 500 })
    }

    // Connect to Sui network
    const client = new SuiClient({ url: getFullnodeUrl('testnet') })

    // Get pool object to check balance
    const poolObject = await client.getObject({
      id: poolObjectId,
      options: { showContent: true }
    })

    if (!poolObject.data) {
      return NextResponse.json({ error: 'Pool not found' }, { status: 500 })
    }

    // Extract balance from the pool object - it's stored in the 'coin' field
    const poolFields = poolObject.data?.content && 'fields' in poolObject.data.content
      ? poolObject.data.content.fields as any
      : null

    if (!poolFields || !poolFields.coin) {
      return NextResponse.json({ error: 'Balance not accessible' }, { status: 500 })
    }

    // Get coin balance - nested structure
    const coinData = poolFields.coin
    const poolBalanceValue = BigInt(coinData.fields?.balance || 0)
    const balanceInSui = Number(poolBalanceValue) / 1_000_000_000

    return NextResponse.json({
      success: true,
      balance: poolBalanceValue.toString(),
      balanceInSui: balanceInSui,
      poolObjectId,
    })
  } catch (error) {
    console.error('Failed to get pool balance:', error)
    return NextResponse.json(
      { error: 'Failed to get pool balance', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

