"use client"

import React from "react"
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  MessageSquare,
  ClipboardList
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManajemenJurnalGuru() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen Jurnal Harian Magang</h1>
        <p className="text-slate-500 mt-1">Verifikasi dan berikan feedback pada laporan aktivitas harian siswa</p>
      </div>

      {/* STATS GRID - 4 Kolom sesuai gambar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Logbook" value="5" sub="Laporan terdaftar" icon={<BookOpen className="text-cyan-500" />} />
        <StatCard title="Belum Diverifikasi" value="2" sub="Menunggu verifikasi" icon={<Clock className="text-amber-500" />} />
        <StatCard title="Disetujui" value="2" sub="Sudah diverifikasi" icon={<CheckCircle className="text-emerald-500" />} />
        <StatCard title="Ditolak" value="1" sub="Perlu perbaikan" icon={<XCircle className="text-rose-500" />} />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#0A2659]">
            <ClipboardList className="text-cyan-500" size={20} />
            Daftar Logbook Siswa
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Cari siswa, kegiatan, atau kendala..." className="pl-9 border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" />
            </div>
            <Button variant="outline" className="rounded-xl gap-2 text-slate-500 border-slate-200">
              <Filter size={16} /> Tampilkan Filter
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="px-8 py-4">Siswa & Tanggal</th>
                <th className="px-8 py-4">Kegiatan & Kendala</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4">Catatan Guru</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <JurnalTableRow 
                name="Ahmad Rizki" nis="2024001" kelas="XII RPL 1" date="1 Mar 2024"
                kegiatan="Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk interface yang user-friendly."
                kendala="Kesulitan menentukan skema warna yang tepat dan konsisten untuk seluruh aplikasi."
                status="disetujui"
                feedback="Bagus, lanjutkan dengan implementasi!"
              />
              <JurnalTableRow 
                name="Ahmad Rizki" nis="2024001" kelas="XII RPL 1" date="2 Mar 2024"
                kegiatan="Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing."
                kendala="Error saat menjalankan migration database dan kesulitan memahami relationship antar tabel."
                status="pending"
                feedback="Belum ada catatan"
              />
              <JurnalTableRow 
                name="Siti Nurhaliza" nis="2024002" kelas="XII RPL 1" date="1 Mar 2024"
                kegiatan="Setup server Linux Ubuntu untuk deployment aplikasi web. Konfigurasi Apache dan MySQL."
                kendala="Belum familiar dengan command line interface dan permission system di Linux."
                status="ditolak"
                feedback="Perbaiki deskripsi kegiatan, terlalu singkat."
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-extrabold text-[#0A2659] my-1">{value}</h2>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">{icon}</div>
    </div>
  )
}

function JurnalTableRow({ name, nis, kelas, date, kegiatan, kendala, status, feedback }: any) {
  const statusConfig: any = {
    disetujui: "bg-emerald-50 text-emerald-500 border-emerald-100",
    pending: "bg-amber-50 text-amber-500 border-amber-100",
    ditolak: "bg-rose-50 text-rose-500 border-rose-100",
  }

  const statusLabel: any = {
    disetujui: "Disetujui",
    pending: "Belum Diverifikasi",
    ditolak: "Ditolak",
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-8 py-5 text-center">
        <input type="checkbox" className="rounded border-slate-300" />
      </td>
      <td className="px-8 py-5">
        <div className="min-w-[140px]">
          <p className="text-sm font-bold text-slate-800 leading-tight">{name}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">NIS: {nis}</p>
          <p className="text-[10px] text-slate-400 font-medium">{kelas}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-cyan-600 bg-cyan-50 w-fit px-2 py-0.5 rounded">
            {date}
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="max-w-[400px] space-y-3">
          <div>
            <p className="text-[10px] font-extrabold text-slate-700 uppercase tracking-tighter mb-1">Kegiatan:</p>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">{kegiatan}</p>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-tighter mb-1">Kendala:</p>
            <p className="text-[11px] text-amber-500/80 leading-relaxed italic">{kendala}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <span className={`text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider border ${statusConfig[status]}`}>
          {statusLabel[status]}
        </span>
      </td>
      <td className="px-8 py-5">
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[200px]">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare size={10} className="text-slate-400" />
            <p className="text-[9px] font-bold text-slate-400 uppercase">Catatan:</p>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            {feedback === "Belum ada catatan" ? <span className="text-slate-300 italic">{feedback}</span> : feedback}
          </p>
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <button className="p-2.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-2xl transition-all border border-transparent hover:border-cyan-100 shadow-sm">
          <Eye size={18} />
        </button>
      </td>
    </tr>
  )
}