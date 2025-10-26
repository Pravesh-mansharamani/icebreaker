"use client"

import Link from "next/link"

import { useIcebreaker } from "../providers"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Share2 } from "lucide-react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { CyberNavigation } from "@/components/cyber-navigation"

export default function FeedPage() {
  const { userData } = useIcebreaker()
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})

  const handleLike = (id: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const renderMedia = (item: (typeof userData.media)[0]) => {
    if (item.type === "photo" || item.type === "meme") {
      return <img src={item.data || "/placeholder.svg"} alt="User content" className="w-full rounded-md" />
    }

    if (item.type === "video") {
      return <video src={item.data} controls className="w-full rounded-md" />
    }

    if (item.type === "text") {
      return (
        <div className="bg-muted p-4 rounded-md border border-primary/30">
          <p className="text-lg font-medium text-primary">{item.data}</p>
        </div>
      )
    }

    return null
  }

  return (
    <main className="flex min-h-screen flex-col">
      <CyberNavigation />

      <div className="container mx-auto max-w-4xl px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="cyber-font text-2xl text-primary glow-text">EVENT FEED</h2>
        </div>

        {userData.media.length === 0 ? (
          <div className="cyber-card p-8 text-center rounded-md">
            <p className="text-primary/70 mb-4">No content yet. Be the first to share something!</p>
            <Link href="/upload">
              <Button className="bg-primary hover:bg-primary/80 text-black cyber-font">CREATE POST</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {userData.media.map((item) => (
              <div key={item.id} className="cyber-card rounded-md p-4">
                <div className="pb-2 flex justify-between items-center">
                  <div className="text-sm text-primary/70">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </div>
                  <div className="alien-symbol smile"></div>
                </div>

                <div className="space-y-4 my-4">
                  {renderMedia(item)}

                  {(item.caption || (item.hashtags && item.hashtags.length > 0)) && (
                    <div>
                      {item.caption && <p className="text-primary/90">{item.caption}</p>}
                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.hashtags.map((tag) => (
                            <span key={tag} className="text-secondary cyber-font text-sm">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between border-t border-primary/20 pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={likedPosts[item.id] ? "text-red-400" : "text-primary"}
                    onClick={() => handleLike(item.id)}
                  >
                    <Heart className="h-5 w-5 mr-1" />
                    {likedPosts[item.id] ? "Liked" : "Like"}
                  </Button>

                  <Button variant="ghost" size="sm" className="text-primary">
                    <MessageSquare className="h-5 w-5 mr-1" />
                    Comment
                  </Button>

                  <Button variant="ghost" size="sm" className="text-primary">
                    <Share2 className="h-5 w-5 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="wave-bg h-20 w-full"></div>
    </main>
  )
}
