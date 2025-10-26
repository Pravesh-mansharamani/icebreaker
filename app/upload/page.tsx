"use client"

import type React from "react"

import { useIcebreaker } from "../providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { PointsAnimation } from "@/components/points-animation"
import { CyberNavigation } from "@/components/cyber-navigation"
import { toast } from "sonner"

export default function UploadPage() {
  const { addMedia, addPoints, completeQuest } = useIcebreaker()
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "photo"
  const questId = searchParams.get("questId")

  const [mediaData, setMediaData] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [showAnimation, setShowAnimation] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (type === "photo" || type === "video") {
      startCamera()
    }

    return () => {
      stopCamera()
    }
  }, [type])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: type === "video",
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      const data = canvas.toDataURL("image/jpeg")
      setMediaData(data)
      stopCamera()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setMediaData(event.target?.result as string)
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!mediaData && type !== "text") return

    const hashtagArray = hashtags
      .split(" ")
      .filter((tag) => tag.startsWith("#"))
      .map((tag) => tag.substring(1))

    let data = mediaData
    if (type === "text") {
      data = caption
    }

    if (data) {
      addMedia(type, data, caption, hashtagArray)

      // Award points based on type
      const pointsMap: Record<string, number> = {
        photo: 10,
        video: 20,
        meme: 15,
        text: 5,
      }

      const pointsEarned = pointsMap[type] || 10
      addPoints(pointsEarned)

      // Complete the quest if this was part of a quest
      if (questId) {
        completeQuest(questId)
      }

      // Send 0.003 SUI reward
      try {
        const response = await fetch("/api/transfer-sui", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const result = await response.json()
          const transactionUrl = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`
          
          toast.success("🎉 Rewarded 0.003 SUI!", {
            description: "Your reward has been sent to your wallet",
            action: {
              label: "View Transaction",
              onClick: () => window.open(transactionUrl, '_blank')
            },
            duration: 8000,
          })
        } else {
          toast.error("Reward transfer failed, but your post was shared!")
        }
      } catch (error) {
        toast.error("Reward transfer failed, but your post was shared!")
      }

      // Show animation
      setShowAnimation(true)
      setTimeout(() => {
        setShowAnimation(false)
        router.push("/feed")
      }, 1500)
    }
  }

  const renderMediaCapture = () => {
    if (mediaData) {
      return (
        <div className="relative">
          {type === "photo" || type === "meme" ? (
            <img
              src={mediaData || "/placeholder.svg"}
              alt="Captured"
              className="w-full rounded-md border border-primary/30"
            />
          ) : type === "video" ? (
            <video src={mediaData} controls className="w-full rounded-md border border-primary/30" />
          ) : null}

          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={() => {
              setMediaData(null)
              if (type === "photo" || type === "video") {
                startCamera()
              }
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    if (type === "photo" || type === "video") {
      return (
        <>
          <div className="relative aspect-video bg-black rounded-md overflow-hidden border border-primary/30">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>

          <div className="flex justify-center mt-4">
            <Button onClick={capturePhoto} className="bg-primary hover:bg-primary/80 text-black cyber-font">
              {type === "photo" ? "TAKE PHOTO" : "RECORD VIDEO"}
            </Button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </>
      )
    }

    if (type === "meme") {
      return (
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="outline"
            className="h-32 w-full border-dashed border-primary/50 bg-muted hover:bg-muted/80"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-8 w-8 mr-2 text-primary" />
            <span className="cyber-font text-primary">UPLOAD IMAGE</span>
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        </div>
      )
    }

    return null
  }

  const getTitle = () => {
    switch (type) {
      case "photo":
        return "TAKE A SELFIE"
      case "video":
        return "RECORD A VIDEO"
      case "meme":
        return "CREATE A MEME"
      case "text":
        return "SHARE A HOT TAKE"
      default:
        return "UPLOAD CONTENT"
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <CyberNavigation />

      <div className="container mx-auto max-w-4xl px-4 py-8 flex-1">
        <div className="cyber-card rounded-md relative">
          {showAnimation && <PointsAnimation points={type === "video" ? 20 : type === "meme" ? 15 : 10} />}

          <div className="p-4 pb-2 flex justify-between items-center">
            <div>
              <h2 className="cyber-font text-xl text-primary">{getTitle()}</h2>
              <p className="text-primary/70 text-sm">
                {type === "text" ? "Share your thoughts about the event" : "Capture a moment and add a caption"}
              </p>
            </div>
            <div className="alien-symbol grid"></div>
          </div>

          <div className="p-4 space-y-4">
            {renderMediaCapture()}

            <div className="space-y-2">
              <Textarea
                placeholder={type === "text" ? "What's your hot take?" : "Add a caption..."}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={type === "text" ? 4 : 2}
                className="bg-muted border-primary/30 focus:border-primary"
              />

              <Input
                placeholder="Add #hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="bg-muted border-primary/30 focus:border-primary"
              />
            </div>
          </div>

          <div className="p-4 pt-0">
            <Button
              className="w-full bg-primary hover:bg-primary/80 text-black cyber-font"
              onClick={handleSubmit}
              disabled={(type !== "text" && !mediaData) || (type === "text" && !caption)}
            >
              POST & EARN POINTS
            </Button>
          </div>
        </div>
      </div>

      <div className="wave-bg h-20 w-full"></div>
    </main>
  )
}
