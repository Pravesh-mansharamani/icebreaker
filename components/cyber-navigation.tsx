"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Camera, Home, Trophy, User } from "lucide-react"
import { useIcebreaker } from "@/app/providers"

export function CyberNavigation() {
  const pathname = usePathname()
  const { userData } = useIcebreaker()

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

        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
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
