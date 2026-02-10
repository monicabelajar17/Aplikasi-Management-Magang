// jurnal-table.tsx
import React from "react";
import { ClipboardList, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JurnalTableRow } from "./jurnal-table-row";
import { JurnalData } from "./types";

interface JurnalTableProps {
  data: JurnalData[];
  loading: boolean;
  onView: (jurnal: JurnalData) => void;
}

export function JurnalTable({ data, loading, onView }: JurnalTableProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-[#0A2659]">
          <ClipboardList className="text-cyan-500" size={20} />
          Daftar Logbook Siswa
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari siswa, kegiatan, atau kendala..." 
              className="pl-9 border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" 
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-8 py-4">Siswa & Tanggal</th>
              <th className="px-8 py-4">Kegiatan & Kendala</th>
              <th className="px-8 py-4 text-center">Status</th>
              <th className="px-8 py-4">Catatan Guru</th>
              <th className="px-8 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  Belum ada jurnal bimbingan
                </td>
              </tr>
            ) : (
              data.map((jurnal) => (
                <JurnalTableRow 
                  key={jurnal.id}
                  data={{
                    name: jurnal.magang?.siswa?.nama || "Tanpa Nama",
                    date: new Date(jurnal.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' }),
                    kegiatan: jurnal.kegiatan,
                    status: jurnal.status_verifikasi,
                    feedback: jurnal.catatan_guru || "Belum ada catatan"
                  }}
                  onView={() => onView(jurnal)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}