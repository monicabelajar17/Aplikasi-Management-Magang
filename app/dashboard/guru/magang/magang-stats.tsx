// magang-stats.tsx
import React from "react";
import { GraduationCap, UserCheck, CheckCircle, Clock } from "lucide-react";
import { StatCard } from "./stat-card-base";
import { StatsData } from "./types";

interface MagangStatsProps {
  stats: StatsData;
}

export function MagangStats({ stats }: MagangStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Bimbingan" 
        value={stats.total} 
        sub="Siswa Anda" 
        icon={<GraduationCap className="text-cyan-500" />} 
      />
      <StatCard 
        title="Berlangsung" 
        value={stats.berlangsung} 
        sub="Sedang magang" 
        icon={<UserCheck className="text-emerald-500" />} 
      />
      <StatCard 
        title="Selesai" 
        value={stats.selesai} 
        sub="Magang selesai" 
        icon={<CheckCircle className="text-blue-500" />} 
      />
      <StatCard 
        title="Pending" 
        value={stats.pending} 
        sub="Menunggu" 
        icon={<Clock className="text-amber-500" />} 
      />
    </div>
  );
}