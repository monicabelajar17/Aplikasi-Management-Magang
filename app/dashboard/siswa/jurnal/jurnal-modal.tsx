// jurnal-modal.tsx
"use client"

import React, { useState, useEffect } from "react";
import { 
  X, FileText, Trash2, AlertTriangle, Clock, 
  MessageSquare, User, Upload, Image as ImageIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormJurnalModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "tambah" | "edit" | "delete" | "view";
  data?: any;
  onConfirmDelete?: () => void;
  onSave?: (formData: any) => void;
}

export function JurnalModal({ 
  isOpen, 
  onClose, 
  mode, 
  data, 
  onConfirmDelete, 
  onSave 
}: FormJurnalModalProps) {
  const [deskripsi, setDeskripsi] = useState("");
  const [kendala, setKendala] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      if ((mode === "edit" || mode === "view") && data) {
        setDeskripsi(data.kegiatan || "");
        setKendala(data.kendala || "");
        setTanggal(data.tanggal || "");
        setPreviewUrl(data.file || "");
        setSelectedFile(null);
      } else if (mode === "tambah") {
        setDeskripsi("");
        setKendala("");
        setTanggal(new Date().toISOString().split('T')[0]);
        setPreviewUrl("");
        setSelectedFile(null);
      }
    }
  }, [mode, data, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!tanggal || !deskripsi) {
      alert("Tanggal dan Kegiatan harus diisi!");
      return;
    }
    
    if (onSave) {
      onSave({
        tanggal: tanggal,
        kegiatan: deskripsi,
        kendala: kendala,
        file: selectedFile,
        lampiran_url: previewUrl
      });
    }
  };

  if (!isOpen) return null;

  // Delete mode
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
            <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl font-bold text-slate-500">
              Batal
            </Button>
            <Button onClick={onConfirmDelete} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold">
              Ya, Hapus
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View mode
  if (mode === "view") {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 border-b flex justify-between items-center bg-white">
            <div className="flex items-center gap-3 text-left">
              <div className="bg-cyan-500 p-2 rounded-xl text-white">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-bold text-[#0A2659]">Detail Jurnal</h3>
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-8 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between py-2 border-b">
              <p className="text-sm font-bold text-slate-600">
                {data?.tanggal && new Date(data.tanggal).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                data?.status_verifikasi === 'disetujui' 
                  ? 'bg-emerald-50 text-emerald-500' 
                  : 'bg-amber-50 text-amber-500'
              }`}>
                {data?.status_verifikasi}
              </span>
            </div>
            <div className="space-y-4 text-left">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kegiatan</label>
                <div className="p-4 bg-slate-50 rounded-2xl text-sm mt-1 text-slate-600 leading-relaxed">
                  {data?.kegiatan}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kendala</label>
                <div className="p-4 bg-slate-50 rounded-2xl text-sm mt-1 text-slate-600 leading-relaxed">
                  {data?.kendala || "Tidak ada kendala"}
                </div>
              </div>
            </div>
            {/* Photo preview */}
            {previewUrl ? (
              <div className="w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
                <img 
                  src={previewUrl} 
                  className="w-full h-auto max-h-[400px] object-contain mx-auto" 
                  alt="Lampiran Jurnal" 
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <ImageIcon size={32} strokeWidth={1} />
                <p className="text-[10px] font-medium mt-2">Tidak ada lampiran foto</p>
              </div>
            )}
          </div>
          <div className="p-6 border-t bg-slate-50/50 flex justify-end">
            <Button onClick={onClose} className="bg-[#0A2659] hover:bg-[#1A3A79] text-white rounded-xl px-10 font-bold">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Tambah & Edit mode
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <div className="text-left">
            <h3 className="text-xl font-bold text-[#0A2659]">
              {mode === "tambah" ? "Tambah Jurnal" : "Edit Jurnal"}
            </h3>
            <p className="text-xs text-slate-400">Lengkapi data aktivitas magang Anda</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tanggal</label>
              <Input 
                type="date" 
                value={tanggal} 
                onChange={(e) => setTanggal(e.target.value)} 
                disabled={mode === "edit"} 
                className="rounded-xl border-slate-200 h-11 focus:ring-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
              <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-[11px] text-slate-400 font-bold flex items-center gap-2 h-11">
                <Clock size={14}/> {mode === "tambah" ? "Menunggu Verifikasi" : "Draft Revisi"}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Kegiatan Harian</label>
            <textarea 
              className="w-full min-h-[120px] border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              placeholder="Jelaskan detail pekerjaan Anda..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Kendala (Opsional)</label>
            <textarea 
              className="w-full min-h-[80px] border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              placeholder="Adakah hambatan saat bertugas?"
              value={kendala}
              onChange={(e) => setKendala(e.target.value)}
            />
          </div>

          {/* Upload & Preview Section */}
          <div className="space-y-3 text-left">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Foto Kegiatan</label>
            <div className="flex flex-col md:flex-row items-start gap-4">
              {previewUrl && (
                <div className="relative group h-32 w-48 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm">
                  <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-[10px] text-white font-bold tracking-tight">Preview Gambar</p>
                  </div>
                </div>
              )}
              
              <label className="flex-1 w-full md:w-auto h-32 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-cyan-200 transition-all cursor-pointer text-slate-400 group">
                <div className="bg-slate-100 p-3 rounded-full group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-600">
                    {previewUrl ? "Ganti Foto" : "Unggah Foto"}
                  </p>
                  <p className="text-[10px]">PNG, JPG up to 2MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost" className="rounded-xl font-bold text-slate-500 px-6">
            Batal
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#0A2659] hover:bg-[#1A3A79] text-white rounded-xl font-bold px-10 transition-all shadow-lg shadow-blue-900/10"
          >
            {mode === "tambah" ? "Simpan Jurnal" : "Update Jurnal"}
          </Button>
        </div>
      </div>
    </div>
  );
}