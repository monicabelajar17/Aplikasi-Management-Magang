import { getDashboardData } from "./action"
import { StatCard } from "./card"
import { MagangSection } from "./magang"
import { LogbookSection } from "./logbook"
import { DudiSection } from "./dudi"
import { GuruChart } from "./guru-chart"
import { Users, Building, GraduationCap, BookOpen } from "lucide-react"

export default async function DashboardPage() {
  const { stats, recentMagang, recentLogbook, dudiWithCount, guruChartData } = await getDashboardData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Dashboard Admin</h1>
        <p className="text-slate-500 mt-1">Data real-time SMK Brantas Karangkates</p>
      </div>

      {/* 4 Card Statistik di Atas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value={stats.totalSiswa || 0} sub="Siswa terdaftar" icon={<Users className="text-blue-500" />} />
        <StatCard title="Siswa Magang" value={stats.siswaMagang || 0} sub="Sedang aktif magang" icon={<GraduationCap className="text-indigo-500" />} />
        <StatCard title="Logbook" value={stats.logbookToday || 0} sub="Laporan hari ini" icon={<BookOpen className="text-emerald-500" />} />
        <StatCard title="Total DUDI" value={stats.totalDudi || 0} sub="Mitra industri" icon={<Building className="text-orange-500" />} />
      </div>

      {/* Diagram Guru di Bawah Card (Full Width) */}
      <div className="w-full">
        <GuruChart data={guruChartData} />
      </div>

      {/* Bagian Tabel-Tabel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MagangSection data={recentMagang} />
          <LogbookSection data={recentLogbook} />
        </div>
        <DudiSection data={dudiWithCount} />
      </div>
    </div>
  )
}