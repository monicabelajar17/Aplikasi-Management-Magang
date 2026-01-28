import { User } from "lucide-react"

export default function SiswaDashboardPage() {
  // Nantinya "Bagus Hidayat" ini akan diambil dari data session login
  const namaSiswa = "Monica Karina"

  return (
    <div className="min-h-[60vh] flex items-start pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">
          Selamat datang, <span className="text-[#0A2659]">{namaSiswa}!</span>
        </h1>
        <p className="text-slate-500">
          Silakan kelola data magang dan jurnal harian Anda melalui menu di samping.
        </p>
      </div>
    </div>
  )
}