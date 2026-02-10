// jurnal-stats.tsx
import React from "react";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import { StatCard } from "./stat-card-base";
import { StatsData } from "./types";

interface JurnalStatsProps {
  stats: StatsData;
}

export function JurnalStats({ stats }: JurnalStatsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Logbook" 
          value={stats.total.toString()} 
          sub="Laporan terdaftar" 
          icon={<BookOpen className="text-cyan-500" />} 
        />
        <StatCard 
          title="Belum Diverifikasi" 
          value={stats.pending.toString()} 
          sub="Menunggu verifikasi" 
          icon={<Clock className="text-amber-500" />} 
        />
        <StatCard 
          title="Disetujui" 
          value={stats.diterima.toString()} 
          sub="Sudah diverifikasi" 
          icon={<CheckCircle className="text-emerald-500" />} 
        />
        <StatCard 
          title="Ditolak" 
          value={stats.ditolak.toString()} 
          sub="Perlu perbaikan" 
          icon={<XCircle className="text-rose-500" />} 
        />
      </div>

    </>
  );
}