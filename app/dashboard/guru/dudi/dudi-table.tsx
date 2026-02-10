// dudi-table.tsx
import React from "react";
import { Building2, Mail, Phone, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TableRow } from "./table-row";
import { DudiTableProps } from "./types";

export function DudiTable({ data, searchTerm, loading, onSearch }: DudiTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="text-cyan-500" size={20} />
          <h3 className="font-bold text-[#0A2659]">Daftar DUDI</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Cari perusahaan, alamat..." 
              className="pl-9 w-[350px] border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" 
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Perusahaan</th>
              <th className="px-6 py-4">Kontak</th>
              <th className="px-6 py-4">Penanggung Jawab</th>
              <th className="px-6 py-4">Siswa Magang</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-300" />
                  <p className="text-xs text-slate-400 mt-2">Memuat data...</p>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((dudi) => (
                <TableRow 
                  key={dudi.id}
                  company={dudi.nama_perusahaan} 
                  address={dudi.alamat}
                  email={dudi.email}
                  phone={dudi.telepon}
                  pic={dudi.penanggung_jawab}
                  count={dudi.siswa_count}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-slate-400 text-sm">
                  Data DUDI tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}