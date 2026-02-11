// school-preview.tsx
import React from "react";
import { Eye, Layout, FileText, Printer, School, MapPin, Phone, Mail, UserCircle } from "lucide-react";
import { PreviewSection } from "./preview";
import { SchoolPreviewProps } from "./type";

export function SchoolPreview({ formData }: SchoolPreviewProps) {
  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 font-bold text-[#0A2659] mb-6">
          <Eye className="text-cyan-[#0A2659]" size={20} />
          Preview Tampilan
        </div>

        <div className="space-y-8">
          {/* Preview Dashboard Header */}
          <PreviewSection 
            icon={<Layout size={14} />} 
            title="Dashboard Header" 
            desc="Tampilan di bagian atas navigasi sistem"
          >
            <div className="bg-[#F8FAFC] p-3 rounded-xl flex items-center gap-3 border border-slate-100">
              <div className="h-8 w-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                {formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo" className="h-5 w-5 object-contain" />
                ) : (
                  <School size={18} className="text-[#0A2659]" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-[#0A2659] leading-none uppercase">
                  {formData.nama_sekolah || "Nama Sekolah"}
                </p>
                <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Sistem Pelaporan v1.0</p>
              </div>
            </div>
          </PreviewSection>

          {/* Preview Kop Lapor */}
          <PreviewSection 
            icon={<FileText size={14} />} 
            title="Header Rapor/Sertifikat" 
            desc="Digunakan sebagai kop resmi dokumen magang"
          >
            <div className="bg-white border border-slate-200 p-4 rounded-xl text-center space-y-1 relative overflow-hidden">
              <div className="absolute left-4 top-4 h-8 w-8 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center">
                {formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo" className="h-5 w-5 object-contain opacity-50" />
                ) : (
                  <School size={16} className="text-slate-300" />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-800 uppercase">{formData.nama_sekolah || "NAMA SEKOLAH"}</h4>
              <p className="text-[8px] text-slate-500 leading-tight px-8">{formData.alamat || "Alamat belum diatur"}</p>
              <p className="text-[8px] text-slate-400">Telp: {formData.telepon} | Email: {formData.email}</p>
              <div className="h-[1px] bg-slate-800 w-full mt-2" />
              <p className="text-[10px] font-bold mt-2 text-slate-700">SERTIFIKAT MAGANG</p>
            </div>
          </PreviewSection>

          {/* Preview Dokumen Cetak */}
          <PreviewSection 
            icon={<Printer size={14} />} 
            title="Dokumen Cetak" 
            desc="Format footer atau header pada laporan yang dicetak"
          >
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
              {/* Header Dokumen: Logo + Info */}
              <div className="flex gap-4 items-start">
                <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {formData.logo_url ? (
                    <img src={formData.logo_url} alt="Logo" className="h-full w-full object-contain" />
                  ) : (
                    <School size={24} className="text-slate-300" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-800 leading-none">
                    {formData.nama_sekolah || "SMK Negeri 1 Surabaya"}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                    NPSN: {formData.npsn || "20567890"}
                  </p>
                  
                  <div className="pt-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[8px] text-slate-500">
                      <MapPin size={8} className="text-slate-400" />
                      <span className="truncate max-w-[200px]">{formData.alamat || "Alamat sekolah..."}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[8px] text-slate-500">
                      <Phone size={8} className="text-slate-400" />
                      <span>{formData.telepon || "031-xxxxxx"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[8px] text-slate-500">
                      <Mail size={8} className="text-slate-400" />
                      <span>{formData.email || "info@sekolah.sch.id"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Dokumen: Tanda Tangan */}
              <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
                <div className="h-5 w-5 bg-cyan-50 rounded-full flex items-center justify-center">
                  <UserCircle size={10} className="text-cyan-500" />
                </div>
                <p className="text-[9px] text-slate-500 font-medium">
                  Kepala Sekolah: <span className="font-bold text-slate-700">{formData.kepala_sekolah || "-"}</span>
                </p>
              </div>
            </div>
          </PreviewSection>

          {/* Hint Box: Informasi Penggunaan */}
          <div className="mt-8 bg-[#F0F7FF] p-6 rounded-3xl border border-blue-100/50">
            <p className="text-[11px] font-bold text-[#0A2659] mb-4 uppercase tracking-widest flex items-center gap-2">
              Informasi Penggunaan:
            </p>
            <div className="space-y-4">
              {/* Item 1: Dashboard */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Layout size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] leading-relaxed text-slate-600">
                    <span className="font-bold text-blue-700">Dashboard:</span> Logo dan nama sekolah ditampilkan di header navigasi sistem secara real-time.
                  </p>
                </div>
              </div>

              {/* Item 2: Rapor */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] leading-relaxed text-slate-600">
                    <span className="font-bold text-blue-700">Rapor/Sertifikat:</span> Informasi lengkap digunakan sebagai kop resmi pada seluruh dokumen magang siswa.
                  </p>
                </div>
              </div>

              {/* Item 3: Cetak */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Printer size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] leading-relaxed text-slate-600">
                    <span className="font-bold text-blue-700">Dokumen Cetak:</span> Format footer atau header otomatis tersemat pada laporan yang diunduh dalam bentuk PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}