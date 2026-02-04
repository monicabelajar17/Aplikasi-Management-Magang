"use client"

import React, { useEffect, useState } from "react"
import { 
  X, Info, Upload, FileText, Trash2, 
  AlertTriangle, CheckCircle2, Clock, MessageSquare, Download, User, Building2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FormJurnalModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "tambah" | "edit" | "delete" | "view"
  data?: any
  onConfirmDelete?: () => void
}

export default function FormJurnalModal({ isOpen, onClose, mode, data, onConfirmDelete }: FormJurnalModalProps) {
  const [deskripsi, setDeskripsi] = useState("")
  
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && data) {
      setDeskripsi(data.kegiatan)
    } else {
      setDeskripsi("")
    }
  }, [mode, data, isOpen])

  if (!isOpen) return null

  // --- 1. TAMPILAN MODE DELETE ---
  if (mode === "delete") {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
          <div className="flex justify-end p-4">
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors"><X size={20} /></button>
          </div>
          <div className="px-8 pb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4 text-rose-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0A2659] mb-2">Hapus Jurnal?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Yakin ingin menghapus jurnal tanggal <span className="font-bold text-slate-700">{data?.date}</span>?
            </p>
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl py-6 font-bold border-slate-200 text-slate-500">Batal</Button>
              <Button onClick={onConfirmDelete} className="flex-1 rounded-xl py-6 font-bold bg-rose-500 hover:bg-rose-600 shadow-lg">Ya, Hapus</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- 2. TAMPILAN MODE VIEW / DETAIL ---
if (mode === "view") {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden text-left">
          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500 p-2 rounded-xl text-white">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-bold text-[#0A2659]">Detail Jurnal Harian</h3>
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500"><X size={24} /></button>
          </div>

          <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Informasi Siswa & Tempat Magang (Card Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <User size={14} /> Informasi Siswa
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Ahmad Rizki</p>
                  <p className="text-[11px] text-slate-500">NIS: 2024001 • XII RPL 1</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <Building2 size={14} /> Tempat Magang
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">PT. Teknologi Nusantara</p>
                  <p className="text-[11px] text-slate-500">PIC: Budi Santoso</p>
                </div>
              </div>
            </div>

            {/* Tanggal & Status */}
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                <Clock size={16} className="text-slate-400" /> {data?.date || "Sabtu, 2 Maret 2024"}
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest
                ${data?.status === 'disetujui' ? 'bg-emerald-50 text-emerald-500' : 
                  data?.status === 'ditolak' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                {data?.status === 'disetujui' ? 'Disetujui' : data?.status === 'ditolak' ? 'Ditolak' : 'Belum Diverifikasi'}
              </span>
            </div>

            {/* Konten Utama */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kegiatan Hari Ini</label>
                <div className="p-5 bg-white border border-slate-100 rounded-2xl text-sm text-slate-600 leading-relaxed shadow-sm">
                  {data?.kegiatan}
                </div>
              </div>

              {/* Dokumentasi */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dokumentasi</label>
                <div className="flex items-center justify-between p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl">
                  <div className="flex items-center gap-3 text-emerald-600 font-medium text-xs">
                    <FileText size={18} /> documento2.pdf
                  </div>
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-100 gap-2 font-bold text-[10px]">
                    <Download size={14} /> UNDUH
                  </Button>
                </div>
              </div>

              {/* Catatan/Feedback Guru (Hanya Muncul Jika Ditolak atau Ada Isinya) */}
              {(data?.status === 'ditolak' || data?.feedback) && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">Catatan Guru / Feedback</label>
                  <div className="p-5 bg-rose-50/30 border border-rose-100 rounded-2xl text-sm text-rose-700 font-medium italic">
                    <MessageSquare size={16} className="inline mr-2 opacity-50" />
                    "{data?.feedback || "Belum ada catatan dari guru"}"
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-right">
            <Button onClick={onClose} className="bg-[#0A2659] hover:bg-[#1a3a7a] text-white rounded-xl px-10 font-bold shadow-lg">Tutup</Button>
          </div>
        </div>
      </div>
    )
  }


  // --- 3. TAMPILAN MODE TAMBAH & EDIT ---
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-left">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-[#0A2659]">{mode === "tambah" ? "Tambah Jurnal" : "Edit Jurnal"}</h3>
            <p className="text-xs text-slate-400 font-medium tracking-tight">Dokumentasikan aktivitas magang Anda</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Tanggal</label>
              <Input type="date" className="rounded-xl border-slate-200 focus:ring-cyan-500" defaultValue={data?.dateRaw} />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Status</label>
              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-xs text-slate-400 font-bold italic flex items-center gap-2">
                <Clock size={14}/> {mode === "tambah" ? "Menunggu Verifikasi" : "Draft Perbaikan"}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center">
               <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Kegiatan Harian</label>
               <span className={`text-[10px] font-bold ${deskripsi.length < 50 ? 'text-rose-400' : 'text-emerald-500'}`}>{deskripsi.length}/50 min</span>
            </div>
            <textarea 
              className="w-full min-h-[140px] bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="Jelaskan apa saja yang Anda kerjakan hari ini..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <div className="space-y-3 text-left">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Lampiran</label>
            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-cyan-200 hover:bg-cyan-50/50 cursor-pointer transition-all group">
               <Upload size={20} className="text-slate-300 group-hover:text-cyan-500" />
               <p className="text-[11px] font-bold text-slate-400">Tarik file atau klik untuk upload</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost" className="rounded-xl font-bold text-slate-400">Batal</Button>
          <Button className="bg-[#00A9C1] hover:bg-cyan-600 text-white rounded-xl px-10 font-bold shadow-lg shadow-cyan-100">
            {mode === "tambah" ? "Simpan Jurnal" : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  )
}