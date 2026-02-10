// recent-magang.tsx
import React from "react";
import { GraduationCap } from "lucide-react";
import { ListMember } from "./list-member";
import { RecentMagang } from "./types";

interface RecentMagangProps {
  data: RecentMagang[];
}

export function RecentMagangSection({ data }: RecentMagangProps) {
  if (!data || data.length === 0) {
    return (
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="text-cyan-500" size={20} />
          <h3 className="font-bold text-[#0A2659]">Magang Terbaru</h3>
        </div>
        <p className="text-sm text-slate-400 text-center py-8">
          Belum ada data magang
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="text-cyan-500" size={20} />
        <h3 className="font-bold text-[#0A2659]">Magang Terbaru</h3>
      </div>

      <div className="space-y-4">
        {data.map((magang) => (
          <ListMember
            key={magang.id}
            name={magang.siswa?.nama || ""}
            company={magang.dudi?.nama_perusahaan || ""}
            date={`${magang.tanggal_mulai} - ${magang.tanggal_selesai}`}
            badge={magang.status}
          />
        ))}
      </div>
    </section>
  );
}