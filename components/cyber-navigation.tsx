"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Camera, Home, Trophy, User, Wallet } from "lucide-react"
import { useIcebreaker } from "@/app/providers"
import { useEffect, useState } from "react"

export function CyberNavigation() {
  const pathname = usePathname()
  const { userData } = useIcebreaker()
  const [poolBalance, setPoolBalance] = useState<number | null>(null)

  useEffect(() => {
    // Fetch pool balance
    const fetchBalance = async () => {
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

    fetchBalance()

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="w-full bg-black border-b border-primary/30 py-3 px-2 sm:px-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/feed" className="flex items-center gap-2 sm:gap-3">
            <Image 
              src="/icon-192x192.png" 
              alt="Icebreaker Logo" 
              width={32}
              height={32}
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
            />
            <h1 className="cyber-font text-xl sm:text-2xl md:text-3xl text-primary logo-animation">ICEBREAKER</h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Pool Balance Indicator */}
          {poolBalance !== null && (
            <a 
              href={`https://suiexplorer.com/object/0x94bd6487e22a711507bd85144aca335e34996962065bbe9189c7aa7ac4c7447e?network=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all group"
              title="Click to view pool on Sui Explorer"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="cyber-font text-[10px] text-primary/50">REWARD POOL</span>
                  {/* <Wallet className="w-3 h-3 text-primary/70" /> */}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden border border-primary/20">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                      style={{ width: `${Math.min((poolBalance / 0.5) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="cyber-font text-xs font-bold text-primary">
                    {poolBalance.toFixed(3)} SUI
                  </span>
                </div>
              </div>
            </a>
          )}

          <Link href="/feed" className={`nav-item p-1 ${pathname === "/feed" ? "active" : ""}`}>
            <Home className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </Link>

          <Link href="/quests" className={`nav-item p-1 ${pathname === "/quests" ? "active" : ""}`}>
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </Link>

          <Link href="/upload" className={`nav-item p-1 ${pathname === "/upload" ? "active" : ""}`}>
            <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </Link>

          <Link
            href="/profile"
            className={`nav-item p-1 ${pathname === "/profile" ? "active" : ""} flex items-center gap-1 sm:gap-2`}
          >
            <User className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            <span className="cyber-font text-sm sm:text-base text-primary glow-text">{userData.points}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
