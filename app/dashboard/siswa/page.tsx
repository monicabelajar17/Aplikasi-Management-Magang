"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { getStudentProfile } from "./action"

export default function SiswaDashboardPage() {
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getStudentProfile()
        setFullName(data.fullName)
      } catch (error) {
        console.error("Gagal memuat profil:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
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
