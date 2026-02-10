// page.tsx
"use client"

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SchoolForm } from "./school-form";
import { SchoolPreview } from "./school-preview";
import { fetchSchoolSettings, updateSchoolSettings, uploadLogo, updateLogoInDatabase } from "./action";
import { SchoolSettings } from "./type";

export default function PengaturanSekolahPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // State untuk data sekolah
  const [formData, setFormData] = useState<SchoolSettings>({
    id: null,
    nama_sekolah: "",
    npsn: "",
    alamat: "",
    telepon: "",
    email: "",
    website: "",
    kepala_sekolah: "",
    logo_url: ""
  });
  
  const [originalData, setOriginalData] = useState<SchoolSettings>({
    id: null,
    nama_sekolah: "",
    npsn: "",
    alamat: "",
    telepon: "",
    email: "",
    website: "",
    kepala_sekolah: "",
    logo_url: ""
  });

  // 1. Ambil data dari Database
  useEffect(() => {
    loadSchoolSettings();
  }, []);

  const loadSchoolSettings = async () => {
    try {
      const data = await fetchSchoolSettings();
      setFormData(data);
      setOriginalData(data);
    } catch (error: any) {
      console.error("Error loading settings:", error.message);
      toast.error("Gagal memuat data pengaturan sekolah");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fungsi Update Data
  const handleSave = async () => {
    if (!formData.id) {
      toast.error("ID data sekolah tidak ditemukan!");
      return;
    }

    setIsSaving(true);
    
    try {
      await updateSchoolSettings(formData);
      toast.success("Pengaturan sekolah berhasil diperbarui!");
      setOriginalData(formData);
      setIsEditing(false);
      
      // Memberi jeda sedikit sebelum refresh agar toast terlihat
      setTimeout(() => {
        router.refresh();
      }, 500);

    } catch (error: any) {
      console.error("Error updating:", error);
      toast.error("Gagal memperbarui data: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Fungsi Upload Logo
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadLogo(file);
      
      // Update state
      const updatedFormData = { ...formData, logo_url: publicUrl };
      setFormData(updatedFormData);
      
      // Langsung simpan ke DB agar permanen
      if (formData.id) {
        await updateLogoInDatabase(formData.id, publicUrl);
        setOriginalData(updatedFormData);
        toast.success("Logo berhasil diperbarui!");
      }

    } catch (error: any) {
      console.error(error);
      toast.error("Gagal upload: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // 4. Fungsi Hapus Logo
  const handleDeleteLogo = () => {
    setFormData({ ...formData, logo_url: "" });
    toast.info("Logo dihapus dari form. Klik Simpan untuk menyimpan perubahan.");
  };

  // 5. Fungsi Batal Edit
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    toast.info("Perubahan dibatalkan");
  };

  // 6. Handler perubahan form
  const handleFormChange = (field: keyof SchoolSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Pengaturan Sekolah</h1>
        <p className="text-slate-500 mt-1">Konfigurasi identitas instansi dan format dokumen sistem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-7 space-y-6">
          <SchoolForm
            formData={formData}
            isEditing={isEditing}
            isSaving={isSaving}
            isUploading={isUploading}
            onFormChange={handleFormChange}
            onUpload={handleUpload}
            onDeleteLogo={handleDeleteLogo}
            onToggleEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <SchoolPreview formData={formData} />
      </div>
    </div>
  );
}