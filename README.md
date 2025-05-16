# ❄️ Icebreaker – Gamified Web3 Networking for Events


## Demo:
<div align="center>
    <a href="https://www.loom.com/share/f996f1d49e9545f38ee2128209de5006">
      <p>Icebreakers Demo</p>
    </a>
    <a href="https://www.loom.com/share/f996f1d49e9545f38ee2128209de5006">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/f996f1d49e9545f38ee2128209de5006-4c81538e33c012c8-full-play.gif">
    </a>
  </div>


## 🚀 Overview  
**Icebreaker** is a gamified event networking platform built for conferences, powered by **Next.js**, **localStorage**, and **Aptos blockchain**. It transforms awkward networking into an interactive game: users earn points by completing quests like taking selfies, posting hot takes, visiting sponsor booths, and sharing content.

Attendees compete in a social PvP format where memes and posts are voted on with W/L reactions, climbing the leaderboard to win real rewards—distributed seamlessly via Aptos keyless accounts. Organizers get detailed behavioral analytics from attendee activity without users needing any crypto knowledge.

---

## 🧩 Problem We Solve  
- **Attendees** often find event networking awkward and inefficient.  
- **Organizers** struggle to track engagement or prove sponsor ROI.  
- **Sponsors** lack insights into attendee interaction and booth traction.

---

## 🏗 Features

### 🎮 Gamified Quest System
- Attendees complete fun, low-friction quests (e.g. “Post a Meme”, “Take a Selfie”) to earn points.
- Each quest rewards users differently based on effort (e.g. 20 points for video, 5 for text).

### 💥 PvP Feed & Social Voting
- Users post content which appears in the **event feed**.
- Other users react with “W” or “L” (like or loss), determining top posts.
- Highly ranked posts can enter **head-to-head PvP voting rounds**.

### 🧠 Adaptive Leveling & Leaderboard
- Users level up from **NEWBIE** to **LEGEND** as they earn points.
- Each level unlocks perks or recognition.
- Organizer/sponsor prizes are distributed based on leaderboard position.

### 💎 Aptos Keyless Blockchain Integration
- Reward payouts are powered by **Aptos Keyless Accounts**.
- Attendees don’t need wallets or keys—accounts are created in the background.
- Sponsors deposit reward pools in Aptos, distributed to winners securely.

---

### 🏢 Benefits for Event Organizers

- **Boost attendee engagement** through gamified incentives.
- **Drive booth traffic** with quests and QR check-ins.
- **Gain real-time insights** on user behavior, content trends, and most visited areas.
- **Identify high-value attendees** for targeted follow-ups or rewards.
- **Generate sponsor reports** backed by actionable event analytics.
- **Reward top users** using seamless blockchain-powered payouts—no wallets required.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js Progressive WebApp, Typescript, Google Auth
- **UI System:** Tailwind CSS + Shadcn/ui
- **Icons:** Lucide
- **State Management:** React Context API (`useIcebreaker`)

### Web3 & Blockchain
- **Chain:** Aptos
- **Onboarding:** Aptos Keyless Accounts 
- **Rewards:** On-chain reward pool 

### PWA / Offline Support
- **Service Worker:** Custom Workbox caching
- **Routes Cached:** `/`, `/feed`, `/quests`, `/profile`, `/upload`
- Allows basic usage without connectivity.

---

## 📱 User Flow

1. **Login / Onboard** 
2. **Complete Quests** like taking a selfie or recording a video
3. **Earn Points** and level up
4. **Post to Event Feed**, compete in PvP votes
5. **Track Your Progress** and share with friends
6. **Claim Rewards** on Aptos if you place on the leaderboard

---

## 🔐 Aptos Integration
- Generate keyless user accounts 
- Link points earned to on-chain reward distribution
- Allow token claim without wallet knowledge

---

## 🎯 Future Features
- Event-wide **PvP brackets** with elimination rounds
- **Booth scan-ins** using QR to track physical traffic
- **Badge/NFT unlocks** tied to specific behaviors
- AI-driven content moderation & meme surfacing
- Leaderboard **filters by user type** or content style

---

## 📩 Team  
  
**Members:**
- Zayaan Siddiqui  
- Pravesh Mansharamani 
- Amy Qin  

💡 *We turn networking into a game worth playing.*
