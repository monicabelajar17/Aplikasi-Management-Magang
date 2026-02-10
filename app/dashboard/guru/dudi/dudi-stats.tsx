// dudi-stats.tsx
import React from "react";
import { Building2, Users, TrendingUp } from "lucide-react";
import { StatCard } from "./stat-card-base";
import { DudiStatsProps } from "./types";

export function DudiStats({ stats }: DudiStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="Total DUDI" 
        value={stats.totalDudi.toString()} 
        sub="Perusahaan mitra aktif" 
        icon={<Building2 className="text-cyan-500" />} 
      />
      <StatCard 
        title="Total Siswa Magang" 
        value={stats.totalSiswaAktif.toString()} 
        sub="Siswa aktif di semua mitra" 
        icon={<Users className="text-blue-500" />} 
      />
      <StatCard 
        title="Rata-rata Siswa" 
        value={stats.rataRata} 
        sub="Per perusahaan" 
        icon={<TrendingUp className="text-emerald-500" />} 
      />
    </div>
  );
}