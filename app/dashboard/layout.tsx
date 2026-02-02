import DashboardClientLayout from "./DashboardClientLayout"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (!token) redirect("/login")

  let profile: {
    full_name: string
    role: "admin" | "guru" | "siswa"
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "kode-rahasia-simmas"
    ) as any

    profile = {
      full_name: decoded.full_name,
      role: decoded.role,
    }
  } catch (error) {
    console.error("JWT Error:", error)
    redirect("/login")
  }

  // Bungkus children dengan Client Layout dan kirim data profile
  return (
    <DashboardClientLayout profile={profile}>
      {children}
    </DashboardClientLayout>
  )
}