"use client"

import React, { useState } from "react"
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  MessageSquare,
  ClipboardList,
  X,
  AlertCircle,
  FileText,
  Download,
  Edit2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManajemenJurnalGuru() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedJurnal, setSelectedJurnal] = useState<any>(null)

  const openDetail = (data: any) => {
    setSelectedJurnal(data)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8 relative">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen Jurnal Harian Magang</h1>
        <p className="text-slate-500 mt-1">Verifikasi dan berikan feedback pada laporan aktivitas harian siswa</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Logbook" value="5" sub="Laporan terdaftar" icon={<BookOpen className="text-cyan-500" />} />
        <StatCard title="Belum Diverifikasi" value="2" sub="Menunggu verifikasi" icon={<Clock className="text-amber-500" />} />
        <StatCard title="Disetujui" value="2" sub="Sudah diverifikasi" icon={<CheckCircle className="text-emerald-500" />} />
        <StatCard title="Ditolak" value="1" sub="Perlu perbaikan" icon={<XCircle className="text-rose-500" />} />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
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
              <JurnalTableRow 
                data={{
                  name: "Ahmad Rizki", nis: "2024001", kelas: "XII RPL 1", date: "Sabtu, 2 Maret 2024",
                  kegiatan: "Belajar backend Laravel untuk membangun REST API sistem kasir.",
                  kendala: "Error saat menjalankan migration database dan kesulitan memahami relationship antar tabel",
                  status: "pending", feedback: "Belum ada catatan"
                }}
                onView={() => openDetail({
                  name: "Ahmad Rizki", date: "Sabtu, 2 Maret 2024",
                  kendala: "Error saat menjalankan migration database dan kesulitan memahami relationship antar tabel",
                  status: "pending", feedback: ""
                })}
              />
              <JurnalTableRow 
                data={{
                  name: "Siti Nurhaliza", nis: "2024002", kelas: "XII RPL 1", date: "Jumat, 1 Maret 2024",
                  kegiatan: "Setup server Linux Ubuntu untuk deployment aplikasi web.",
                  kendala: "Belum familiar dengan command line interface.",
                  status: "disetujui", feedback: "Bagus, dokumentasi sudah lengkap."
                }}
                onView={() => openDetail({
                  name: "Siti Nurhaliza", date: "Jumat, 1 Maret 2024",
                  kendala: "Belum familiar dengan command line interface.",
                  status: "disetujui", feedback: "Bagus, dokumentasi sudah lengkap."
                })}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DETAIL JURNAL (Persis Gambar) --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <div className="bg-cyan-500 p-2.5 rounded-xl text-white shadow-lg shadow-cyan-100">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A2659]">Detail Jurnal Harian</h3>
                  <p className="text-xs text-slate-400 font-medium">{selectedJurnal?.date}</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-300 hover:text-slate-500 p-1">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              {/* Section Kendala (Warna Kuning persis gambar) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <AlertCircle size={16} className="text-orange-500" />
                  Kendala yang Dihadapi
                </div>
                <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedJurnal?.kendala}
                  </p>
                </div>
              </div>

              {/* Section Dokumentasi */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <FileText size={16} className="text-emerald-500" />
                  Dokumentasi
                </div>
                <div className="bg-emerald-50/30 border border-emerald-100 p-3 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-emerald-600"><FileText size={20} /></div>
                    <span className="text-sm font-medium text-slate-600 italic tracking-tight">documento2.pdf</span>
                  </div>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-2 px-4 h-9">
                    <Download size={14} /> Unduh
                  </Button>
                </div>
              </div>

              {/* Section Catatan Guru */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                    <MessageSquare size={16} className="text-indigo-500" />
                    Catatan Guru
                  </div>
                  {/* Tombol Edit hanya jika pending */}
                  {selectedJurnal?.status === "pending" && (
                    <Button variant="ghost" className="h-8 text-blue-600 hover:bg-blue-50 gap-2 rounded-lg text-xs font-bold px-3">
                      <Edit2 size={12} /> Edit
                    </Button>
                  )}
                </div>
                <div className="border-2 border-dashed border-slate-100 p-6 rounded-2xl text-center">
                  <p className="text-sm text-slate-400 font-medium">
                    {selectedJurnal?.feedback || "Belum ada catatan dari guru"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer (Aksi hanya jika Pending) */}
            <div className="px-8 py-6 bg-slate-50/50 flex justify-between items-center">
              <div className="text-[10px] text-slate-400 font-medium">
                Dibuat: 2/3/2024 <span className="mx-2">•</span> Diperbarui: 2/3/2024
              </div>
              
              <div className="flex gap-3">
                {selectedJurnal?.status === "pending" ? (
                  <>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 font-bold gap-2">
                      <CheckCircle size={16} /> Setujui
                    </Button>
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6 font-bold gap-2">
                      <X size={16} /> Tolak
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setModalOpen(false)} variant="outline" className="rounded-xl px-8 font-bold border-slate-200">
                    Tutup
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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

function JurnalTableRow({ data, onView }: any) {
  const statusConfig: any = {
    disetujui: "bg-emerald-50 text-emerald-500 border-emerald-100",
    pending: "bg-amber-50 text-amber-500 border-amber-100",
    ditolak: "bg-rose-50 text-rose-500 border-rose-100",
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-8 py-5">
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{data.name}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">{data.date}</p>
        </div>
      </td>
      <td className="px-8 py-5">
        <p className="text-[11px] text-slate-500 leading-relaxed italic line-clamp-1">{data.kegiatan}</p>
      </td>
      <td className="px-8 py-5 text-center">
        <span className={`text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider border ${statusConfig[data.status]}`}>
          {data.status}
        </span>
      </td>
      <td className="px-8 py-5">
        <p className="text-[11px] text-slate-400 italic line-clamp-1">{data.feedback}</p>
      </td>
      <td className="px-8 py-5 text-center">
        <button onClick={onView} className="p-2.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-2xl transition-all shadow-sm border border-transparent hover:border-cyan-100">
          <Eye size={18} />
        </button>
      </td>
    </tr>
  )
}