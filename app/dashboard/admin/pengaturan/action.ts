// actions.ts
import { createClient } from "@/utils/supabase/client";
import { SchoolSettings } from "./type";

const supabase = createClient();

export async function fetchSchoolSettings(): Promise<SchoolSettings> {
  const { data, error } = await supabase
    .from('school_settings')
    .select('*')
    .single();

  if (error) {
    console.error("Error fetching school settings:", error.message);
    throw error;
  }

  return data || {
    id: null,
    nama_sekolah: "",
    npsn: "",
    alamat: "",
    telepon: "",
    email: "",
    website: "",
    kepala_sekolah: "",
    logo_url: ""
  };
}

export async function updateSchoolSettings(data: SchoolSettings): Promise<void> {
  if (!data.id) {
    throw new Error("ID data sekolah tidak ditemukan!");
  }

  const { error } = await supabase
    .from('school_settings')
    .update({
      nama_sekolah: data.nama_sekolah,
      npsn: data.npsn,
      alamat: data.alamat,
      telepon: data.telepon,
      email: data.email,
      website: data.website,
      kepala_sekolah: data.kepala_sekolah,
      updated_at: new Date()
    })
    .eq('id', data.id);

  if (error) throw error;
}

export async function uploadLogo(file: File): Promise<string> {
  // Validasi File (Maks 2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Ukuran file terlalu besar! Maksimal 2MB.");
  }

  // Upload ke Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `logo-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('Gambar Alat')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Ambil Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('Gambar Alat')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function updateLogoInDatabase(id: number, logoUrl: string): Promise<void> {
  const { error } = await supabase
    .from('school_settings')
    .update({ logo_url: logoUrl })
    .eq('id', id);

  if (error) throw error;
}