import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to feed page as the main landing page
  redirect("/feed")
}
