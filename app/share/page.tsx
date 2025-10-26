"use client"

import { useIcebreaker } from "../providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PointsAnimation } from "@/components/points-animation"
import { useSearchParams } from "next/navigation"
import { CyberNavigation } from "@/components/cyber-navigation"

export default function SharePage() {
  const { userData, addPoints, completeQuest } = useIcebreaker()
  const searchParams = useSearchParams()
  const questId = searchParams.get("questId")
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
          if (questId) {
            completeQuest(questId)
          }
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
          if (questId) {
            completeQuest(questId)
          }
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
      <CyberNavigation />

      <div className="container px-4 py-8 flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md relative cyber-card">
          {showAnimation && <PointsAnimation points={5} />}

          <CardHeader>
            <CardTitle className="cyber-font text-primary">SHARE WITH FRIENDS</CardTitle>
            <CardDescription className="text-primary/70">Let others know about your achievements!</CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <div className="bg-muted p-6 rounded-lg mb-4 border border-primary/30">
              <p className="text-lg text-primary">
                I've earned <span className="font-bold cyber-font">{userData.points} POINTS</span> at this event using Icebreaker!
              </p>
            </div>

            <p className="text-sm text-primary/70">Share your progress with friends and earn 5 bonus points!</p>
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full gap-2 bg-primary text-black cyber-font hover:bg-primary/80" 
              onClick={handleShare} 
              disabled={shared}
            >
              <Share2 className="h-4 w-4" />
              {shared ? "SHARED!" : "SHARE NOW"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="wave-bg h-20 w-full"></div>
    </main>
  )
}
