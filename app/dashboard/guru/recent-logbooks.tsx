// recent-logbooks.tsx
import React from "react";
import { ClipboardList } from "lucide-react";
import { LogbookItem } from "./logbook-item";
import { RecentLogbook } from "./types";

interface RecentLogbooksProps {
  data: RecentLogbook[];
}

export function RecentLogbooksSection({ data }: RecentLogbooksProps) {
  if (!data || data.length === 0) {
    return (
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="text-emerald-500" size={20} />
          <h3 className="font-bold text-[#0A2659]">Logbook Terbaru</h3>
        </div>
        <p className="text-sm text-slate-400 text-center py-8">
          Belum ada data logbook
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="text-emerald-500" size={20} />
        <h3 className="font-bold text-[#0A2659]">Logbook Terbaru</h3>
      </div>

      <div className="space-y-4">
        {data.map((log) => (
          <LogbookItem
            key={log.id}
            studentName={log.magang?.siswa?.nama || ""}
            title={log.kegiatan}
            date={log.tanggal}
            status={log.status_verifikasi}
            statusColor={
              log.status_verifikasi === "disetujui"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600"
            }
            kendala={log.kendala || "Tidak ada kendala"}
          />
        ))}
      </div>
    </section>
  );
}