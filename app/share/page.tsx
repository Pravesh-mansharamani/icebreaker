"use client"

import { useIcebreaker } from "../providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PointsAnimation } from "@/components/points-animation"

export default function SharePage() {
  const { userData, addPoints, completeQuest } = useIcebreaker()
  const [showAnimation, setShowAnimation] = useState(false)
  const [shared, setShared] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out Icebreaker!",
          text: `I've earned ${userData.points} points at this event using Icebreaker!`,
          url: window.location.origin,
        })

        // Award points for sharing
        if (!shared) {
          addPoints(5)
          completeQuest("share")
          setShared(true)
          setShowAnimation(true)
          setTimeout(() => setShowAnimation(false), 1500)
        }
      } else {
        // Fallback for browsers that don't support the Web Share API
        alert(`Share this: I've earned ${userData.points} points at this event using Icebreaker!`)

        // Still award points
        if (!shared) {
          addPoints(5)
          completeQuest("share")
          setShared(true)
          setShowAnimation(true)
          setTimeout(() => setShowAnimation(false), 1500)
        }
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="w-full bg-primary py-4 px-6 flex justify-between items-center">
        <Link href="/">
          <h1 className="logo-font text-3xl text-black">Icebreaker</h1>
        </Link>
        <Link href="/quests">
          <Button variant="outline" className="bg-black/10 border-black/20">
            Back to Quests
          </Button>
        </Link>
      </header>

      <div className="container px-4 py-8 flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md relative">
          {showAnimation && <PointsAnimation points={5} />}

          <CardHeader>
            <CardTitle>Share with Friends</CardTitle>
            <CardDescription>Let others know about your achievements!</CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <div className="bg-secondary/20 p-6 rounded-lg mb-4">
              <p className="text-lg">
                I've earned <span className="font-bold">{userData.points} points</span> at this event using Icebreaker!
              </p>
            </div>

            <p className="text-sm text-muted-foreground">Share your progress with friends and earn 5 bonus points!</p>
          </CardContent>

          <CardFooter>
            <Button className="w-full gap-2" onClick={handleShare} disabled={shared}>
              <Share2 className="h-4 w-4" />
              {shared ? "Shared!" : "Share Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
