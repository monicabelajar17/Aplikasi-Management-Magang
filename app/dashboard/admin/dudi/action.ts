"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// 1. Fetch data DUDI dengan penghitungan siswa aktif
export async function getDudiData() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('dudi')
    .select(`
      *,
      magang (
        id,
        status
      )
    `)
    .eq('is_deleted', false)
    .order('nama_perusahaan', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  // Formatting data sebelum dikirim ke client
  return (data || []).map(dudi => ({
    ...dudi,
    jumlah_siswa: (dudi.magang || []).filter(
      (m: any) => m.status?.toLowerCase().trim() === 'berlangsung'
    ).length
  }))
}

// 2. Tambah DUDI baru
export async function createDudiAction(formData: any) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('dudi')
    .insert([{
      ...formData,
      is_deleted: false
    }])

  if (error) return { success: false, message: error.message }
  
  revalidatePath('/dashboard/admin/dudi')
  return { success: true }
}

// 3. Update data DUDI
export async function updateDudiAction(id: string, formData: any) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('dudi')
    .update(formData)
    .eq('id', id)

  if (error) return { success: false, message: error.message }
  
  revalidatePath('/dashboard/admin/dudi')
  return { success: true }
}

// 4. Soft Delete DUDI
export async function deleteDudiAction(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('dudi')
    .update({ is_deleted: true })
    .eq('id', id)

  if (error) return { success: false, message: error.message }
  
  revalidatePath('/dashboard/admin/dudi')
  return { success: true }
}