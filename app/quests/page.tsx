"use client"

import { useIcebreaker } from "../providers"
import { Button } from "@/components/ui/button"
import { Camera, MessageSquare, Share2, Smile } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PointsAnimation } from "@/components/points-animation"
import { CyberNavigation } from "@/components/cyber-navigation"

const quests = [
  {
    id: "selfie",
    title: "Take a Selfie",
    description: "Snap a selfie at the event",
    icon: <Camera className="h-6 w-6" />,
    points: 10,
    link: "/upload?type=photo&questId=selfie",
  },
  {
    id: "hot-take",
    title: "Share a Hot Take",
    description: "Post your spicy opinion about the event",
    icon: <Smile className="h-6 w-6" />,
    points: 15,
    link: "/upload?type=text&questId=hot-take",
  },
  {
    id: "meme",
    title: "Create a Meme",
    description: "Make a meme about the event",
    icon: <MessageSquare className="h-6 w-6" />,
    points: 15,
    link: "/upload?type=meme&questId=meme",
  },
  {
    id: "share",
    title: "Share with Friends",
    description: "Share your content with friends",
    icon: <Share2 className="h-6 w-6" />,
    points: 5,
    link: "/share?questId=share",
  },
]

export default function QuestsPage() {
  const { userData } = useIcebreaker()
  const [showAnimation, setShowAnimation] = useState<string | null>(null)

  return (
    <main className="flex min-h-screen flex-col">
      <CyberNavigation />

      <div className="container mx-auto max-w-4xl px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="cyber-font text-2xl text-primary glow-text">QUESTS</h2>
          <div className="flex items-center gap-2">
            <span className="cyber-font text-primary">{userData.points}</span>
            <span className="text-primary/70">POINTS</span>
          </div>
        </div>

        <p className="text-primary/70 mb-6">Complete these challenges to earn points!</p>

        <div className="grid gap-4">
          {quests.map((quest) => {
            const isCompleted = userData.completedQuests.includes(quest.id)

            return (
              <div key={quest.id} className="cyber-card relative overflow-hidden rounded-md">
                {showAnimation === quest.id && <PointsAnimation points={quest.points} />}
                <div className="flex items-center gap-4 p-4">
                  <div className={`p-2 rounded-full ${isCompleted ? "bg-primary/20" : "bg-muted"}`}>{quest.icon}</div>
                  <div>
                    <h3 className="cyber-font text-primary">{quest.title}</h3>
                    <p className="text-primary/70 text-sm">{quest.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center px-4 pb-4 pt-2 border-t border-primary/20">
                  <div className="text-sm font-medium cyber-font text-secondary">{quest.points} POINTS</div>
                  {isCompleted ? (
                    <Button variant="outline" disabled className="border-primary/30 text-primary/50">
                      COMPLETED
                    </Button>
                  ) : (
                    <Link href={quest.link}>
                      <Button
                        className="bg-primary hover:bg-primary/80 text-black cyber-font"
                      >
                        START QUEST
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="wave-bg h-20 w-full"></div>
    </main>
  )
}
