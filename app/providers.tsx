"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import AccountProvider from "./sso"

type UserData = {
  points: number
  completedQuests: string[]
  media: {
    id: string
    type: string
    data: string
    caption?: string
    hashtags?: string[]
    timestamp: number
  }[]
}

type IcebreakerContextType = {
  userData: UserData
  addPoints: (points: number) => void
  completeQuest: (questId: string) => void
  addMedia: (type: string, data: string, caption?: string, hashtags?: string[]) => void
  updateMediaCaption: (id: string, caption: string, hashtags: string[]) => void
}

const defaultUserData: UserData = {
  points: 0,
  completedQuests: [],
  media: [],
}

const IcebreakerContext = createContext<IcebreakerContextType>({
  userData: defaultUserData,
  addPoints: () => {},
  completeQuest: () => {},
  addMedia: () => {},
  updateMediaCaption: () => {},
})

export const useIcebreaker = () => useContext(IcebreakerContext)

export function Providers({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load user data from localStorage
    const storedData = localStorage.getItem("icebreaker_user_data")
    if (storedData) {
      try {
        setUserData(JSON.parse(storedData))
      } catch (e) {
        console.error("Failed to parse stored data", e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    // Save user data to localStorage whenever it changes
    if (isLoaded) {
      localStorage.setItem("icebreaker_user_data", JSON.stringify(userData))
    }
  }, [userData, isLoaded])

  const addPoints = (points: number) => {
    setUserData((prev) => ({
      ...prev,
      points: prev.points + points,
    }))
  }

  const completeQuest = (questId: string) => {
    setUserData((prev) => {
      if (prev.completedQuests.includes(questId)) return prev

      return {
        ...prev,
        completedQuests: [...prev.completedQuests, questId],
        // We don't add points here since they're already awarded in the upload/share pages
      }
    })
  }

  const addMedia = (type: string, data: string, caption?: string, hashtags?: string[]) => {
    const id = Date.now().toString()
    setUserData((prev) => ({
      ...prev,
      media: [
        {
          id,
          type,
          data,
          caption,
          hashtags,
          timestamp: Date.now(),
        },
        ...prev.media,
      ],
    }))
    return id
  }

  const updateMediaCaption = (id: string, caption: string, hashtags: string[]) => {
    setUserData((prev) => ({
      ...prev,
      media: prev.media.map((item) => (item.id === id ? { ...item, caption, hashtags } : item)),
    }))
  }

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <IcebreakerContext.Provider
      value={{
        userData,
        addPoints,
        completeQuest,
        addMedia,
        updateMediaCaption,
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AccountProvider>
        {children}
        </AccountProvider>
      </ThemeProvider>
    </IcebreakerContext.Provider>
  )
}
