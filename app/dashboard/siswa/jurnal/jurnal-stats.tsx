// jurnal-stats.tsx
import React from "react";
import { BookOpen, CheckCircle2, Clock, XCircle } from "lucide-react";
import { StatCard } from "./stat-card";
import type { JurnalStats } from "./types";

interface JurnalStatsProps {
  stats: JurnalStats;
}

export function JurnalStats({ stats }: JurnalStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Jurnal" 
        value={stats.total.toString()} 
        sub="Jurnal yang telah dibuat" 
        icon={<BookOpen className="text-[#0A2659]" />} 
      />
      <StatCard 
        title="Disetujui" 
        value={stats.disetujui.toString()} 
        sub="Jurnal disetujui guru" 
        icon={<CheckCircle2 className="text-emerald-500" />} 
      />
      <StatCard 
        title="Menunggu" 
        value={stats.pending.toString()} 
        sub="Belum diverifikasi" 
        icon={<Clock className="text-blue-500" />} 
      />
      <StatCard 
        title="Ditolak" 
        value={stats.ditolak.toString()} 
        sub="Perlu diperbaiki" 
        icon={<XCircle className="text-rose-500" />} 
      />
    </div>
  );
}