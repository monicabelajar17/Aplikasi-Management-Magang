// page.tsx
import React from "react";
import { Users, Building, GraduationCap, BookOpen } from "lucide-react";
import { StatCard } from "./stat-cards";
import { RecentMagangSection } from "./recent-magang";
import { RecentLogbooksSection } from "./recent-logbooks";
import { ActiveDudiSection } from "./active-dudi";
import { 
  getGuruId, 
  getDashboardStats, 
  getRecentMagang, 
  getRecentLogbooks, 
  getActiveDudi 
} from "./data-fetching";

export default async function GuruDashboardPage() {
  try {
    const guruId = await getGuruId();
    
    // Fetch data secara paralel
    const [
      stats,
      recentMagang,
      recentLogbooks,
      activeDudi
    ] = await Promise.all([
      getDashboardStats(guruId),
      getRecentMagang(guruId),
      getRecentLogbooks(guruId),
      getActiveDudi(guruId)
    ]);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">
            Dashboard Guru
          </h1>
          <p className="text-slate-500 mt-1">
            Ringkasan aktivitas pemantauan magang siswa
          </p>
        </div>

        {/* STAT CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Siswa"
            value={stats.totalSiswa.toString()}
            sub="Siswa terdaftar"
            icon={<Users className="text-cyan-500" />}
          />
          <StatCard
            title="DUDI Partner"
            value={stats.totalDudi.toString()}
            sub="Perusahaan mitra"
            icon={<Building className="text-blue-500" />}
          />
          <StatCard
            title="Siswa Magang"
            value={stats.siswaMagang.toString()}
            sub="Aktif magang"
            icon={<GraduationCap className="text-indigo-500" />}
          />
          <StatCard
            title="Logbook Hari Ini"
            value={stats.logbookToday.toString()}
            sub="Laporan masuk"
            icon={<BookOpen className="text-emerald-500" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAGANG & LOGBOOK */}
          <div className="lg:col-span-2 space-y-6">
            <RecentMagangSection data={recentMagang} />
            <RecentLogbooksSection data={recentLogbooks} />
          </div>

          {/* DUDI AKTIF */}
          <ActiveDudiSection data={activeDudi} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in GuruDashboardPage:", error);
    
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">
            Dashboard Guru
          </h1>
          <p className="text-slate-500 mt-1">
            Ringkasan aktivitas pemantauan magang siswa
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">
            Terjadi kesalahan saat memuat data. Silakan refresh halaman atau hubungi administrator.
          </p>
          <p className="text-sm text-red-500 mt-2">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }
}