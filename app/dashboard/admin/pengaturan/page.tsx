"use client"

import React, { useState, useEffect } from "react"
import { 
  Settings, Edit3, Upload, School, MapPin, Phone, Mail, 
  Globe, UserCircle, Hash, Eye, Layout, FileText, Printer, Save, X, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Import Server Actions
import { getSchoolSettings, updateSchoolSettings, updateLogoUrl } from "./action"

export default function PengaturanSekolahPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  const [formData, setFormData] = useState<any>({
    id: null, nama_sekolah: "", npsn: "", alamat: "", telepon: "", 
    email: "", website: "", kepala_sekolah: "", logo_url: ""
  })
  
  const [originalData, setOriginalData] = useState<any>(null)

  // 1. Fetch Initial Data
  useEffect(() => {
    async function init() {
      const data = await getSchoolSettings()
      if (data) {
        setFormData(data)
        setOriginalData(data)
      }
      setIsLoading(false)
    }
    init()
  }, [])

  // 2. Handle Save
  async function handleSave() {
    if (!formData.id) return toast.error("ID data sekolah tidak ditemukan!")
    setIsSaving(true)
    
    const res = await updateSchoolSettings(formData.id, formData)
    if (res.success) {
      toast.success("Pengaturan sekolah berhasil diperbarui!")
      setOriginalData(formData)
      setIsEditing(false)
      setTimeout(() => router.refresh(), 500)
    } else {
      toast.error("Gagal: " + res.error)
    }
    setIsSaving(false)
  }

  // 3. Handle Upload Logo
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error("Maksimal 2MB.")

      const fileExt = file.name.split('.').pop()
      const fileName = `logo-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('Gambar Alat')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('Gambar Alat')
        .getPublicUrl(filePath)

      setFormData({ ...formData, logo_url: publicUrl })
      
      if (formData.id) {
        const res = await updateLogoUrl(formData.id, publicUrl)
        if (res.success) toast.success("Logo berhasil diperbarui!")
      }
    } catch (error: any) {
      toast.error("Gagal upload: " + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  function handleCancel() {
    setFormData(originalData)
    setIsEditing(false)
    toast.info("Perubahan dibatalkan")
  }

  if (isLoading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-cyan-500" />
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Pengaturan Sekolah</h1>
        <p className="text-slate-500 mt-1">Konfigurasi identitas instansi dan format dokumen sistem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-[#0A2659]">
                <Settings className="text-cyan-500" size={20} />
                Informasi Sekolah
              </div>
              {!isEditing ? (
  <Button onClick={() => setIsEditing(true)} size="sm" className="bg-cyan-500 hover:bg-cyan-600 rounded-xl gap-2">
    <Edit3 size={14} /> Edit
  </Button>
) : (
  <div className="flex gap-2">
    <Button 
      onClick={handleCancel} // Gunakan fungsi handleCancel
      variant="outline" 
      size="sm" 
      className="rounded-xl text-slate-500"
    >
      <X size={14} /> Batal
    </Button>
    <Button 
      onClick={handleSave} 
      disabled={isSaving} 
      size="sm" 
      className="bg-green-600 hover:bg-green-700 rounded-xl gap-2 text-white"
    >
      {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Simpan
    </Button>
  </div>
)}
            </div>

            <div className="p-8 space-y-6">
               {/* Logo Section */}
<div className="space-y-2">
  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
    <Upload size={14} /> Logo Sekolah
  </label>
  <div className="flex items-center gap-4">
    <label className="relative cursor-pointer group">
      <input 
        type="file" 
        className="hidden" 
        accept="image/*" 
        onChange={handleUpload} 
        disabled={isUploading}
      />
      <div className="h-24 w-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 overflow-hidden group-hover:bg-slate-100 transition-all">
        {isUploading ? (
          <Loader2 className="animate-spin text-cyan-500" />
        ) : formData.logo_url ? (
          <img src={formData.logo_url} className="h-full w-full object-contain p-2" alt="Logo preview" />
        ) : (
          <>
            <School size={32} className="group-hover:scale-110 transition-transform" />
            <span className="text-[9px] mt-2 font-bold uppercase">Upload</span>
          </>
        )}
      </div>
      {/* Overlay Edit saat Hover */}
      {formData.logo_url && !isUploading && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
          <Edit3 size={20} className="text-white" />
        </div>
      )}
    </label>
    <div className="space-y-1">
      <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">
        Klik kotak untuk mengganti logo. Gunakan .png transparan untuk hasil terbaik.
      </p>
      {formData.logo_url && (
         <button 
           onClick={() => setFormData({...formData, logo_url: ""})}
           className="text-[9px] text-red-500 font-bold uppercase hover:underline"
         >
           Hapus Logo
         </button>
      )}
    </div>
  </div>
</div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                  disabled={!isEditing} icon={<School size={16} />} label="Nama Sekolah" 
                  value={formData.nama_sekolah} 
                  onChange={(e: any) => setFormData({...formData, nama_sekolah: e.target.value})}
                />
                <InputField 
                  disabled={!isEditing} icon={<Hash size={16} />} label="NPSN" 
                  value={formData.npsn}
                  onChange={(e: any) => setFormData({...formData, npsn: e.target.value})}
                />
                <div className="md:col-span-2">
                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <MapPin size={14} /> Alamat Lengkap
                   </label>
                   <Textarea 
                    disabled={!isEditing}
                    className="rounded-xl border-slate-200 min-h-[100px] text-sm" 
                    value={formData.alamat}
                    onChange={(e: any) => setFormData({...formData, alamat: e.target.value})}
                   />
                </div>
                <InputField disabled={!isEditing} icon={<Phone size={16} />} label="Telepon" value={formData.telepon} onChange={(e: any) => setFormData({...formData, telepon: e.target.value})} />
                <InputField disabled={!isEditing} icon={<Mail size={16} />} label="Email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
                <InputField disabled={!isEditing} icon={<Globe size={16} />} label="Website" value={formData.website} onChange={(e: any) => setFormData({...formData, website: e.target.value})} />
                <InputField disabled={!isEditing} icon={<UserCircle size={16} />} label="Kepala Sekolah" value={formData.kepala_sekolah} onChange={(e: any) => setFormData({...formData, kepala_sekolah: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW (Sudah otomatis terupdate karena pakai state formData) */}
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
      </div>
    </div>
  )
}

function InputField({ icon, label, value, onChange, disabled }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        {icon} {label}
      </label>
      <Input disabled={disabled} onChange={onChange} className="rounded-xl border-slate-200 h-11 text-sm focus-visible:ring-cyan-500" value={value} />
    </div>
  )
}
function PreviewSection({ icon, title, desc, children }: any) {
  return (
    <div className="space-y-3">
      <div>
        <h5 className="text-[11px] font-bold text-slate-800 flex items-center gap-2">
          {icon} {title}
        </h5>
        {/* Tambahkan baris desc di bawah ini */}
        {desc && <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}