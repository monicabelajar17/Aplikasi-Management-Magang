"use client"

import React from "react"
import { 
  Settings, 
  Edit3, 
  Upload, 
  School, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  UserCircle, 
  Hash,
  Eye,
  Layout,
  FileText,
  Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function PengaturanSekolahPage() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Pengaturan Sekolah</h1>
        <p className="text-slate-500 mt-1">Konfigurasi identitas instansi dan format dokumen sistem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FORM INFORMASI SEKOLAH */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-[#0A2659]">
                <Settings className="text-cyan-500" size={20} />
                Informasi Sekolah
              </div>
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 rounded-xl gap-2">
                <Edit3 size={14} /> Edit
              </Button>
            </div>

            <div className="p-8 space-y-6">
              {/* Logo Upload Section */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Upload size={14} /> Logo Sekolah
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer group">
                    <School size={32} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] mt-2 font-bold uppercase">Upload</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">
                    Gunakan file .png atau .jpg transparan. Maksimal ukuran file 2MB.
                  </p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField icon={<School size={16} />} label="Nama Sekolah/Instansi" value="SMK Brantas Karangkates" />
                <InputField icon={<Hash size={16} />} label="NPSN" value="20517712" />
                <div className="md:col-span-2">
                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <MapPin size={14} /> Alamat Lengkap
                   </label>
                   <Textarea className="rounded-xl border-slate-200 min-h-[100px] text-sm focus-visible:ring-cyan-500" value="JL. LOLARAS 14, Kec. Sumberpucung, Kab. Malang, Prov. Jawa Timur" />
                </div>
                <InputField icon={<Phone size={16} />} label="Telepon" value="0341385876" />
                <InputField icon={<Mail size={16} />} label="Email" value="smk.brantasmalang@gmail.com" />
                <InputField icon={<Globe size={16} />} label="Website" value="www.smkbrantaskarangkates.sch.id/" />
                <InputField icon={<UserCircle size={16} />} label="Kepala Sekolah" value="Mintaasih Utami" />
              </div>
              
              <p className="text-[10px] text-slate-400 italic pt-4 border-t border-slate-50">
                Terakhir diperbarui: 29 Januari 2026 pukul 07:00
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW TAMPILAN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 font-bold text-[#0A2659] mb-6">
              <Eye className="text-cyan-500" size={20} />
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
                    <School size={18} className="text-[#0A2659]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-[#0A2659] leading-none">SMK Brantas Karangkates</p>
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
                     <School size={16} className="text-slate-300" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase">SMK Brantas Karangkates</h4>
                  <p className="text-[8px] text-slate-500 leading-tight px-8">JL. LOLARAS 14, Kec. Sumberpucung, Kab. Malang, Prov. Jawa Timur</p>
                  <p className="text-[8px] text-slate-400">Telp: 0341385876 | Email: smk.brantasmalang@gmail.com</p>
                  <div className="h-[1px] bg-slate-800 w-full mt-2" />
                  <p className="text-[10px] font-bold mt-2 text-slate-700">SERTIFIKAT MAGANG</p>
                </div>
              </PreviewSection>

              {/* Preview Dokumen Cetak */}
              <PreviewSection 
                icon={<Printer size={14} />} 
                title="Dokumen Cetak" 
                desc="Format footer atau tanda tangan dokumen"
              >
                <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 bg-white rounded border border-slate-200 flex items-center justify-center">
                      <School size={12} className="text-slate-300" />
                    </div>
                    <div className="text-[8px]">
                      <p className="font-bold text-slate-600 leading-none">SMK Brantas Karangkates</p>
                      <p className="text-slate-400 mt-0.5 uppercase tracking-tighter">NPSN: 20517712</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex flex-col items-end">
                     <p className="text-[9px] text-slate-400">Kepala Sekolah,</p>
                     <div className="h-8" />
                     <p className="text-[9px] font-bold text-slate-800">Mintaasih Utami</p>
                  </div>
                </div>
              </PreviewSection>
            </div>

            {/* Hint Box */}
            <div className="mt-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <p className="text-[11px] font-bold text-blue-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Info size={14} /> Informasi Penggunaan:
              </p>
              <ul className="space-y-1.5">
                <li className="text-[10px] text-blue-600 flex items-start gap-2">
                  <div className="h-1 w-1 bg-blue-400 rounded-full mt-1.5" /> 
                  Logo dan nama sekolah ditampilkan di navigasi dashboard.
                </li>
                <li className="text-[10px] text-blue-600 flex items-start gap-2">
                  <div className="h-1 w-1 bg-blue-400 rounded-full mt-1.5" /> 
                  Informasi lengkap digunakan sebagai kop dokumen resmi.
                </li>
                <li className="text-[10px] text-blue-600 flex items-start gap-2">
                  <div className="h-1 w-1 bg-blue-400 rounded-full mt-1.5" /> 
                  Data NPSN dan Kepala Sekolah muncul pada lembar sertifikat.
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function InputField({ icon, label, value }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        {icon} {label}
      </label>
      <Input className="rounded-xl border-slate-200 h-11 text-sm focus-visible:ring-cyan-500" value={value} />
    </div>
  )
}

function PreviewSection({ icon, title, desc, children }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <h5 className="text-[11px] font-bold text-slate-800 flex items-center gap-2">
            {icon} {title}
          </h5>
          <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function Info({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
  )
}