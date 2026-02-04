"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
  return match ? decodeURIComponent(match.split("=")[1]) : null
}

export default function SiswaDashboardPage() {
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const name = getCookie("full_name")
    if (name) setFullName(name)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-start pt-10">
      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-slate-800">
          Selamat datang,{" "}
          <span className="text-[#0A2659]">{fullName || "Siswa"}!</span>
        </h1>
        <p className="text-slate-500">
          Silakan kelola data magang dan jurnal harian Anda melalui menu di samping.
        </p>
      </div>
    </div>
  )
}
