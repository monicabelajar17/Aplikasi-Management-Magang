import React from "react"
import { CheckCircle, X } from "lucide-react"

interface DudiToastProps {
  show: boolean
  onClose: () => void
}

export default function DudiToast({ show, onClose }: DudiToastProps) {
  if (!show) return null

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-full duration-300">
      <div className="bg-[#84CC16] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-lime-400">
        <CheckCircle size={20} />
        <p className="text-sm font-medium">
          Pendaftaran magang berhasil dikirim! Menunggu verifikasi dari guru.
        </p>
        <button
          onClick={onClose}
          className="ml-4 hover:bg-white/20 p-1 rounded-full"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}