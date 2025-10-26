import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function RootPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("slush_auth_token")?.value

  if (authToken) {
    redirect("/feed")
  } else {
    redirect("/auth")
  }
}
