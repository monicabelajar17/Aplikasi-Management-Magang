// active-dudi.tsx
import React from "react";
import { Building } from "lucide-react";
import { DudiItem } from "./dudi-item";
import { ActiveDudi } from "./types";

interface ActiveDudiSectionProps {
  data: ActiveDudi[];
}

export function ActiveDudiSection({ data }: ActiveDudiSectionProps) {
  if (!data || data.length === 0) {
    return (
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <Building className="text-orange-500" size={20} />
          <h3 className="font-bold text-[#0A2659]">DUDI Aktif</h3>
        </div>
        <p className="text-sm text-slate-400 text-center py-8">
          Belum ada DUDI aktif
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <Building className="text-orange-500" size={20} />
        <h3 className="font-bold text-[#0A2659]">DUDI Aktif</h3>
      </div>

      <div className="space-y-4">
        {data.map((dudi) => (
          <DudiItem
            key={dudi.id}
            name={dudi.nama_perusahaan}
            address={dudi.alamat}
            count={dudi.siswa_count}
          />
        ))}
      </div>
    </section>
  );
}