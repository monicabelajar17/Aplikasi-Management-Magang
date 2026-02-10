// magang-table.tsx
import React from "react";
import { GraduationCap, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagangTableProps } from "./types";

export function MagangTable({
  data,
  searchTerm,
  loading,
  onEdit,
  onDelete,
  onSearch,
  onAddNew
}: MagangTableProps) {
  const filteredData = data.filter(m => 
    m.siswa?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.dudi?.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    if (status === 'pending') {
      return 'bg-amber-100 text-amber-600 border-amber-200';
    } else if (status === 'diterima' || status === 'berlangsung') {
      return 'bg-emerald-100 text-emerald-600 border-emerald-200';
    } else if (status === 'ditolak' || status === 'dibatalkan') {
      return 'bg-rose-100 text-rose-600 border-rose-200';
    } else if (status === 'selesai') {
      return 'bg-slate-100 text-slate-500 border-slate-200';
    }
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-[#0A2659]">
            <GraduationCap className="text-cyan-500" size={20} /> Data Magang Siswa
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Cari siswa/perusahaan..." 
              className="pl-10 w-64 rounded-xl border-slate-200 focus-visible:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <Button 
            onClick={onAddNew}
            className="bg-[#0A2659] hover:bg-cyan-600 rounded-xl gap-2"
          >
            <Plus size={18} /> Tambah
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-100">
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider pl-4 text-center w-20">Profil</th>
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Nama & Kelas</th>
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Perusahaan</th>
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Pembimbing</th>
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Status</th>
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 pl-4">
                  <div className="h-10 w-10 mx-auto bg-[#0A2659] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                    {m.siswa?.nama?.charAt(0).toUpperCase()}
                  </div>
                </td>
                <td className="py-4">
                  <p className="font-bold text-slate-700 text-sm">{m.siswa?.nama}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{m.siswa?.kelas}</p>
                </td>
                <td className="py-4">
                  <p className="text-sm font-semibold text-slate-600">{m.dudi?.nama_perusahaan}</p>
                </td>
                <td className="py-4">
                  <p className="text-xs text-slate-500 italic">
                    {m.guru?.nama || "Belum Ditugaskan"}
                  </p>
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(m.status)}`}>
                    {m.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => onEdit(m)}
                      className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(m.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && !loading && (
          <p className="text-center py-10 text-slate-400 text-sm italic">Tidak ada data magang ditemukan.</p>
        )}
      </div>
    </div>
  );
}