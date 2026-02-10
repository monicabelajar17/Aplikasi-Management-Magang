// magang-table.tsx
import React from "react";
import { GraduationCap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MagangTableRow } from "./magang-table-row";
import { MagangData } from "./types";

interface MagangTableProps {
  data: MagangData[];
  searchTerm: string;
  loading: boolean;
  onSearch: (term: string) => void;
  onEdit: (data: MagangData) => void;
  onDelete: (data: MagangData) => void;
}

export function MagangTable({ 
  data, 
  searchTerm, 
  loading, 
  onSearch, 
  onEdit, 
  onDelete 
}: MagangTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
          <p className="text-sm text-slate-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-[#0A2659]">
          <GraduationCap className="text-cyan-500" size={20} /> Daftar Siswa Bimbingan
        </div>
        <Input 
          placeholder="Cari bimbingan..." 
          className="max-w-xs rounded-xl" 
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase font-bold">
            <tr>
              <th className="px-8 py-4">Siswa</th>
              <th className="px-8 py-4">DUDI</th>
              <th className="px-8 py-4">Periode</th>
              <th className="px-8 py-4 text-center">Status</th>
              <th className="px-8 py-4 text-center">Nilai</th>
              <th className="px-8 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((item) => (
                <MagangTableRow 
                  key={item.id}
                  data={{
                    name: item.siswa?.nama || "",
                    nis: item.siswa?.nis || "",
                    dudi: item.dudi?.nama_perusahaan || "",
                    status: item.status,
                    score: item.nilai_akhir,
                    mulai: item.tanggal_mulai,
                    selesai: item.tanggal_selesai
                  }}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-slate-400 text-sm">
                  Tidak ada data bimbingan ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}