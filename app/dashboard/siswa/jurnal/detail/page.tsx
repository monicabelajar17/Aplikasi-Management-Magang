"use client"

import React, { useEffect, useState } from "react"
import { 
  X, FileText, Trash2, AlertTriangle, Clock, 
  MessageSquare, Download, User, Building2, Upload 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FormJurnalModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "tambah" | "edit" | "delete" | "view"
  data?: any
  onConfirmDelete?: () => void // UBAH: tanpa parameter
  onSave?: (formData: any) => void
}

export default function FormJurnalModal({ isOpen, onClose, mode, data, onConfirmDelete, onSave }: FormJurnalModalProps) {
  const [deskripsi, setDeskripsi] = useState("")
  const [kendala, setKendala] = useState("")
  const [tanggal, setTanggal] = useState("")
  
  useEffect(() => {
  if (isOpen) {
    if ((mode === "edit" || mode === "view") && data) {
      setDeskripsi(data.kegiatan || "")
      setKendala(data.kendala || "")
      setTanggal(data.tanggal || "")
    } else if (mode === "tambah") {
      setDeskripsi("")
      setKendala("")
      setTanggal(new Date().toISOString().split('T')[0])
    }
  }
}, [mode, data, isOpen])

  // Fungsi untuk mengirim data saat tombol simpan diklik
  const handleSubmit = () => {
  if (!tanggal || !deskripsi) {
    alert("Tanggal dan Kegiatan harus diisi!");
    return;
  }
  
  if (onSave) {
    onSave({
      tanggal: tanggal,
      kegiatan: deskripsi,
      kendala: kendala
    });
  }
};

  if (!isOpen) return null

  // --- 1. MODE DELETE ---
  if (mode === "delete") {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden text-center p-8">
          <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#0A2659] mb-2">Hapus Jurnal?</h3>
          <p className="text-sm text-slate-500 mb-6">
            Yakin ingin menghapus jurnal tanggal <br/>
            <span className="font-bold text-slate-700">
              {data?.tanggal ? new Date(data.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' }) : ""}
            </span>?
          </p>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl">Batal</Button>
            <Button 
  onClick={onConfirmDelete} // LANGSUNG panggil tanpa parameter
  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold"
>
  Ya, Hapus
</Button>

          </div>
        </div>
      </div>
    )
  }

  // --- 2. MODE VIEW ---
  if (mode === "view") {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-left">
        <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500 p-2 rounded-xl text-white"><FileText size={20} /></div>
              <h3 className="text-xl font-bold text-[#0A2659]">Detail Jurnal</h3>
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500"><X size={24} /></button>
          </div>
          <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="flex items-center justify-between py-2 border-b">
               <p className="text-sm font-bold text-slate-600">
                  {data?.tanggal && new Date(data.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
               </p>
               <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${data?.status_verifikasi === 'disetujui' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                 {data?.status_verifikasi}
               </span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Kegiatan</label>
                <div className="p-4 bg-slate-50 rounded-2xl text-sm mt-1">{data?.kegiatan}</div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Kendala</label>
                <div className="p-4 bg-slate-50 rounded-2xl text-sm mt-1">{data?.kendala || "Tidak ada kendala"}</div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t bg-slate-50/50 text-right">
            <Button onClick={onClose} className="bg-[#0A2659] text-white rounded-xl px-8 font-bold">Tutup</Button>
          </div>
        </div>
      </div>
    )
  }

  // --- 3. MODE TAMBAH & EDIT ---
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-left">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-[#0A2659]">{mode === "tambah" ? "Tambah Jurnal" : "Edit Jurnal"}</h3>
            <p className="text-xs text-slate-400">Dokumentasikan aktivitas magang Anda</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Tanggal</label>
              <Input 
                type="date" 
                value={tanggal} 
                onChange={(e) => setTanggal(e.target.value)} 
                disabled={mode === "edit"} 
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Status</label>
              <div className="bg-slate-50 border px-4 py-2 rounded-xl text-xs text-slate-400 font-bold italic flex items-center gap-2 h-10">
                <Clock size={14}/> {mode === "tambah" ? "Menunggu Verifikasi" : "Draft Perbaikan"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Kegiatan Harian</label>
            <textarea 
              className="w-full min-h-[120px] border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Apa yang anda kerjakan hari ini?"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Kendala (Opsional)</label>
            <textarea 
              className="w-full min-h-[80px] border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Apa kendala yang dihadapi?"
              value={kendala}
              onChange={(e) => setKendala(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost" className="rounded-xl font-bold">Batal</Button>
          <Button 
  onClick={handleSubmit}
  className="bg-[#0A2659] hover:bg-[#1A3A79] text-white rounded-xl font-bold px-8"
>
  Simpan Perubahan
</Button>
        </div>
      </div>
    </div>
  )
}