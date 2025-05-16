"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

export function PointsAnimation({ points }: { points: number }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Trigger confetti
    const canvas = document.createElement("canvas")
    canvas.style.position = "fixed"
    canvas.style.inset = "0"
    canvas.style.width = "100vw"
    canvas.style.height = "100vh"
    canvas.style.zIndex = "999"
    canvas.style.pointerEvents = "none"
    document.body.appendChild(canvas)

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    })

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#c4a1ff", "#9d7aff", "#e0c3ff"],
    })

    // Remove canvas after animation
    const timeout = setTimeout(() => {
      document.body.removeChild(canvas)
      setVisible(false)
    }, 1500)

    return () => {
      clearTimeout(timeout)
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas)
      }
    }
  }, [])

  if (!visible) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
      <div className="points-animation bg-primary text-black cyber-font text-2xl py-4 px-8 rounded-lg">
        +{points} POINTS!
      </div>
    </div>
  )
}
