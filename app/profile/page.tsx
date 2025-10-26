"use client"

import { useIcebreaker } from "../providers"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Camera, MessageSquare, Share2, Wallet, ExternalLink, Coins } from "lucide-react"
import Link from "next/link"
import { CyberNavigation } from "@/components/cyber-navigation"
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit"
import { useEffect, useState } from "react"

const LEVELS = [
  { name: "NEWBIE", threshold: 0 },
  { name: "SOCIALIZER", threshold: 50 },
  { name: "INFLUENCER", threshold: 100 },
  { name: "EVENT STAR", threshold: 200 },
  { name: "LEGEND", threshold: 500 },
]

export default function ProfilePage() {
  const { userData } = useIcebreaker()
  const account = useCurrentAccount()
  const client = useSuiClient()
  const [walletBalance, setWalletBalance] = useState<string>("0")
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [poolBalance, setPoolBalance] = useState<number | null>(null)

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account?.address) return
      
      setBalanceLoading(true)
      try {
        const balance = await client.getBalance({
          owner: account.address,
        })
        const suiBalance = (Number(balance.totalBalance) / 1_000_000_000).toFixed(4)
        setWalletBalance(suiBalance)
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      } finally {
        setBalanceLoading(false)
      }
    }

    fetchBalance()
  }, [account?.address, client])

  // Fetch pool balance
  useEffect(() => {
    const fetchPoolBalance = async () => {
      try {
        const res = await fetch('/api/pool-balance')
        if (!res.ok) return
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json()
          if (data.success) {
            setPoolBalance(data.balanceInSui)
          }
        }
      } catch (err) {
        console.error('Failed to fetch pool balance:', err)
      }
    }

    fetchPoolBalance()
    const interval = setInterval(fetchPoolBalance, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calculate current level
  const currentLevel = LEVELS.reduce((prev, curr) => {
    return userData.points >= curr.threshold ? curr : prev
  }, LEVELS[0])

  // Find next level
  const nextLevelIndex = LEVELS.findIndex((level) => level.name === currentLevel.name) + 1
  const nextLevel = nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex] : null

  // Calculate progress to next level
  const progressPercentage = nextLevel
    ? ((userData.points - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
    : 100

  // Count completed quests by type
  const questCounts = {
    photo: userData.media.filter((item) => item.type === "photo").length,
    text: userData.media.filter((item) => item.type === "text").length,
    meme: userData.media.filter((item) => item.type === "meme").length,
  }

  return (
    <main className="flex min-h-screen flex-col">
      <CyberNavigation />

      <div className="container mx-auto max-w-4xl px-4 py-8 flex-1">
        {/* Wallet Info */}
        {account && (
          <div className="cyber-card mb-6 rounded-md relative overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-5 w-5 text-primary" />
                <p className="text-sm text-primary/70">Wallet Details</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-primary/70 mb-1">Address</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-primary text-xs break-all">{account.address}</p>
                  <Link 
                    href={`https://suiexplorer.com/address/${account.address}?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <p className="text-sm text-primary/70">Balance:</p>
                <p className="cyber-font text-2xl text-primary">
                  {balanceLoading ? "..." : walletBalance} SUI
                </p>
              </div>
            </div>
            
            <div className="px-4 pb-4">
              <Link 
                href={`https://suiexplorer.com/address/${account.address}?network=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View transactions on Sui Explorer</span>
              </Link>
            </div>
          </div>
        )}

        {/* Reward Pool Info */}
        {poolBalance !== null && (
          <div className="cyber-card mb-6 rounded-md relative overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="h-5 w-5 text-primary" />
                <p className="text-sm text-primary/70">Reward Pool Balance</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-primary/70 mb-1">Pool Object</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-primary text-xs break-all">0x94bd6487e22a...c7447e</p>
                  <a 
                    href={`https://suiexplorer.com/object/0x94bd6487e22a711507bd85144aca335e34996962065bbe9189c7aa7ac4c7447e?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-sm text-primary/70">Available:</p>
                <p className="cyber-font text-2xl text-primary">
                  {poolBalance.toFixed(3)} SUI
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-primary/20 mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                  style={{ width: `${Math.min((poolBalance / 0.5) * 100, 100)}%` }}
                />
              </div>

              <p className="text-xs text-primary/50">
                Rewards sent: 0.003 SUI per upload • {Math.floor(poolBalance / 0.003)} rewards remaining
              </p>
            </div>
          </div>
        )}

        <div className="cyber-card mb-6 rounded-md relative overflow-hidden">
          <div className="p-4 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="cyber-font text-xl text-primary">YOUR PROGRESS</h2>
            </div>
            <p className="text-primary/70 text-sm">Keep completing quests to level up!</p>
          </div>

          <div className="p-4 pt-2 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="cyber-font text-xl text-secondary">{currentLevel.name}</h3>
                <p className="text-sm text-primary/70">
                  {nextLevel
                    ? `${nextLevel.threshold - userData.points} points to next level`
                    : "Maximum level reached!"}
                </p>
              </div>
              <div className="text-3xl cyber-font text-primary glow-text">{userData.points}</div>
            </div>

            <Progress value={progressPercentage} className="h-2 bg-muted" indicatorClassName="bg-primary glow" />

            {nextLevel && (
              <div className="flex justify-between text-sm text-primary/70">
                <span>{currentLevel.threshold}</span>
                <span>{nextLevel.threshold}</span>
              </div>
            )}
          </div>
        </div>

        <h2 className="cyber-font text-xl text-primary mb-4 glow-text">YOUR ACHIEVEMENTS</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="cyber-card rounded-md">
            <div className="p-4 flex items-center gap-3">
              <div className="bg-muted p-2 rounded-full">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="cyber-font text-primary">{questCounts.photo} PHOTOS</p>
                <p className="text-sm text-primary/70">Shared</p>
              </div>
            </div>
          </div>

          <div className="cyber-card rounded-md">
            <div className="p-4 flex items-center gap-3">
              <div className="bg-muted p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="cyber-font text-primary">{questCounts.text} HOT TAKES</p>
                <p className="text-sm text-primary/70">Shared</p>
              </div>
            </div>
          </div>

          <div className="cyber-card rounded-md">
            <div className="p-4 flex items-center gap-3">
              <div className="bg-muted p-2 rounded-full">
                <Share2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="cyber-font text-primary">{questCounts.meme} MEMES</p>
                <p className="text-sm text-primary/70">Created</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/quests">
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-black cyber-font">
              COMPLETE MORE QUESTS
            </Button>
          </Link>
        </div>
      </div>

      <div className="wave-bg h-20 w-full"></div>
    </main>
  )
}
