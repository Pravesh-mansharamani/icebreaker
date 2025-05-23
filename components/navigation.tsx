"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Camera, Home, Trophy, User } from "lucide-react"
import { useIcebreaker } from "@/app/providers"

export function Navigation() {
  const pathname = usePathname()
  const { userData } = useIcebreaker()

  return (
    <header className="w-full bg-black border-b border-gray-800 py-4 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/feed">
          <h1 className="logo-font text-3xl color-changing-text">Icebreaker</h1>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/feed" className={`nav-item ${pathname === "/feed" ? "active" : ""}`}>
            <Home className="icon-lg text-primary" />
          </Link>

          <Link href="/quests" className={`nav-item ${pathname === "/quests" ? "active" : ""}`}>
            <Trophy className="icon-lg text-secondary" />
          </Link>

          <Link href="/upload" className={`nav-item ${pathname === "/upload" ? "active" : ""}`}>
            <Camera className="icon-lg text-accent" />
          </Link>

          <Link
            href="/profile"
            className={`nav-item ${pathname === "/profile" ? "active" : ""} flex items-center gap-2`}
          >
            <User className="icon-lg text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
              {userData.points}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
