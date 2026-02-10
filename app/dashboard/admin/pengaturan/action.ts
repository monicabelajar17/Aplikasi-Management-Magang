"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// 1. Ambil Pengaturan (Server Side)
export async function getSchoolSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('school_settings')
    .select('*')
    .single()

  if (error) return null
  return data
}

// 2. Update Informasi Sekolah
export async function updateSchoolSettings(id: number, formData: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('school_settings')
    .update({
      nama_sekolah: formData.nama_sekolah,
      npsn: formData.npsn,
      alamat: formData.alamat,
      telepon: formData.telepon,
      email: formData.email,
      website: formData.website,
      kepala_sekolah: formData.kepala_sekolah,
      updated_at: new Date()
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard/admin/pengaturan')
  return { success: true }
}

// 3. Update Logo URL secara langsung
export async function updateLogoUrl(id: number, publicUrl: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('school_settings')
    .update({ logo_url: publicUrl })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard/admin/pengaturan')
  return { success: true }
}