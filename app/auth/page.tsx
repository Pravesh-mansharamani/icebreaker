"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConnectModal, useCurrentWallet, useCurrentAccount } from "@mysten/dapp-kit"
import { toast } from "sonner"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { currentWallet, connectionStatus } = useCurrentWallet()
  const currentAccount = useCurrentAccount()

  useEffect(() => {
    // Check if user is already connected
    if (currentAccount && connectionStatus === "connected") {
      // Call API to set auth cookie and redirect
      fetch("/api/auth/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: currentAccount.address }),
      })
        .then(() => {
          router.push("/feed")
        })
        .catch((error) => {
          console.error("Failed to authenticate:", error)
          toast.error("Failed to authenticate")
        })
    }
  }, [currentAccount, connectionStatus, router])

  const handleSignIn = async () => {
    setLoading(true)
    // The ConnectModal will handle the wallet connection
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="flex flex-col items-center gap-6 mb-12">
        <Image
          src="/icon-192x192.png"
          alt="Icebreaker Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
        <h1 className="cyber-font text-5xl text-primary logo-animation">ICEBREAKER</h1>
      </div>

      <div className="cyber-card p-8 md:p-12 rounded-lg shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2 text-primary/90">Welcome Back!</h2>
        <p className="text-primary/70 mb-8">Sign in to continue your adventure.</p>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-primary/80 cyber-font">Authenticating...</p>
          </div>
        ) : (
          <ConnectModal
            trigger={
              <Button
                onClick={handleSignIn}
                className="w-full bg-white hover:bg-gray-100 text-gray-700 cyber-font text-lg py-3 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3 border border-gray-300 shadow-sm"
              >
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Connect with Slush
              </Button>
            }
          />
        )}

        <p className="text-xs text-primary/50 mt-8">
          Sign in with Slush to create or access your Sui wallet. First-time users will have a wallet created automatically.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm text-primary/60 cyber-font">Gamify Your Events</p>
      </div>
    </main>
  )
} 