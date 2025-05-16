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
    <header className="w-full bg-black border-b border-primary/30 py-4 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/feed" className="flex items-center gap-3">
            <Image 
              src="/icon-192x192.png" 
              alt="Icebreaker Logo" 
              width={40} 
              height={40} 
              className="rounded-full"
            />
            <h1 className="cyber-font text-3xl text-primary logo-animation">ICEBREAKER</h1>
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/feed" className={`nav-item ${pathname === "/feed" ? "active" : ""}`}>
            <Home className="icon-lg text-primary" />
          </Link>

          <Link href="/quests" className={`nav-item ${pathname === "/quests" ? "active" : ""}`}>
            <Trophy className="icon-lg text-primary" />
          </Link>

          <Link href="/upload" className={`nav-item ${pathname === "/upload" ? "active" : ""}`}>
            <Camera className="icon-lg text-primary" />
          </Link>

          <Link
            href="/profile"
            className={`nav-item ${pathname === "/profile" ? "active" : ""} flex items-center gap-2`}
          >
            <User className="icon-lg text-primary" />
            <span className="cyber-font text-primary glow-text">{userData.points}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
