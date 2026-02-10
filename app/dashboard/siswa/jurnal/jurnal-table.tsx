// jurnal-table.tsx
import React from "react";
import { BookOpen, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JurnalTableRow } from "./jurnal-table-row";
import { FilterSelect } from "./filter-select";
import { Jurnal } from "./types";

interface JurnalTableProps {
  jurnals: Jurnal[];
  loading: boolean;
  onView: (jurnal: Jurnal) => void;
  onEdit: (jurnal: Jurnal) => void;
  onDelete: (jurnal: Jurnal) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function JurnalTable({ 
  jurnals, 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  searchQuery, 
  onSearchChange 
}: JurnalTableProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Toolbar & Filter */}
      <div className="p-6 border-b border-slate-50 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#0A2659]">
            <BookOpen className="text-[#0A2659]" size={20} />
            Riwayat Jurnal
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari kegiatan atau kendala..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" 
            />
          </div>
          <Button variant="outline" className="rounded-xl gap-2 text-slate-500 border-slate-200 text-xs font-bold">
            <Filter size={14} /> Sembunyikan Filter
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <FilterSelect label="Status" placeholder="Semua Status" />
          <FilterSelect label="Bulan" placeholder="Semua Bulan" />
          <FilterSelect label="Tahun" placeholder="Semua Tahun" />
          <div className="flex items-end">
            <Button variant="ghost" className="text-[11px] font-bold text-slate-400 hover:text-cyan-600">
              Reset Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-8 py-4">Tanggal</th>
              <th className="px-8 py-4">Kegiatan & Kendala</th>
              <th className="px-8 py-4 text-center">Status</th>
              <th className="px-8 py-4">Feedback Guru</th>
              <th className="px-8 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400 text-xs italic">
                  Memuat data jurnal...
                </td>
              </tr>
            ) : jurnals.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400 text-xs">
                  Belum ada jurnal untuk ditampilkan.
                </td>
              </tr>
            ) : (
              jurnals.map((jurnal) => (
                <JurnalTableRow 
                  key={jurnal.id}
                  date={new Date(jurnal.tanggal).toLocaleDateString('id-ID', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                  kegiatan={jurnal.kegiatan}
                  status={jurnal.status_verifikasi}
                  feedback={jurnal.catatan_guru || "Belum ada feedback"}
                  onView={() => onView(jurnal)}
                  onEdit={() => onEdit(jurnal)}
                  onDelete={() => onDelete(jurnal)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}