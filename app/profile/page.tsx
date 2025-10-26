"use client"

import { useIcebreaker } from "../providers"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Camera, MessageSquare, Video, Share2 } from "lucide-react"
import Link from "next/link"
import { CyberNavigation } from "@/components/cyber-navigation"

const LEVELS = [
  { name: "NEWBIE", threshold: 0 },
  { name: "SOCIALIZER", threshold: 50 },
  { name: "INFLUENCER", threshold: 100 },
  { name: "EVENT STAR", threshold: 200 },
  { name: "LEGEND", threshold: 500 },
]

export default function ProfilePage() {
  const { userData } = useIcebreaker()

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
    video: userData.media.filter((item) => item.type === "video").length,
    text: userData.media.filter((item) => item.type === "text").length,
    meme: userData.media.filter((item) => item.type === "meme").length,
  }

  return (
    <main className="flex min-h-screen flex-col">
      <CyberNavigation />

      <div className="container px-4 py-8 flex-1">
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

          <div className="barcode"></div>
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
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="cyber-font text-primary">{questCounts.video} VIDEOS</p>
                <p className="text-sm text-primary/70">Recorded</p>
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
