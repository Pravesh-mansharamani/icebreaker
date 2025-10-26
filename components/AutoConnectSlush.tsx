"use client"

import { useEffect, useRef } from "react"
import { useConnectWallet, useWallets, useCurrentAccount } from "@mysten/dapp-kit"

export function AutoConnectSlush() {
  const wallets = useWallets()
  const account = useCurrentAccount()
  const { mutate: connect } = useConnectWallet()
  const hasTriedConnect = useRef(false)

  useEffect(() => {
    // Only try to auto-connect once and only if not already connected
    if (hasTriedConnect.current || account) {
      return
    }

    const slush = wallets.find((w) => w.name.toLowerCase().includes("slush"))
    if (slush && wallets.length > 0) {
      hasTriedConnect.current = true
      connect({ wallet: slush })
    }
  }, [wallets, connect, account])

  return null
}

