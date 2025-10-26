"use client"

import { useEffect } from "react"
import { useConnectWallet, useWallets } from "@mysten/dapp-kit"

export function AutoConnectSlush() {
  const wallets = useWallets()
  const { mutate: connect } = useConnectWallet()

  useEffect(() => {
    const slush = wallets.find((w) => w.name.toLowerCase().includes("slush"))
    if (slush && wallets.length > 0) {
      connect({ wallet: slush })
    }
  }, [wallets, connect])

  return null
}

