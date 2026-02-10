// action.ts - Server Actions (tetap seperti yang ada)
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Mengambil daftar jurnal berdasarkan ID Guru dari Cookie
export async function getJurnalData() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const rawId = cookieStore.get("guru_id")?.value

  if (!rawId) return { data: [], error: "Sesi tidak ditemukan" }
  const guruId = parseInt(rawId, 10)

  const { data, error } = await supabase
    .from('logbook')
    .select(`
      *,
      magang!inner (
        id,
        guru_id,
        siswa:siswa_id (nama, nis, kelas)
      )
    `)
    .eq('magang.guru_id', guruId)
    .eq('is_deleted', false)
    .order('tanggal', { ascending: false })

  return { data: data || [], error: error?.message }
}

// Melakukan verifikasi (Terima/Tolak) jurnal
export async function verifikasiJurnal(id: number, status: 'diterima' | 'ditolak', catatan: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('logbook')
    .update({ 
      status_verifikasi: status,
      catatan_guru: catatan || null 
    })
    .eq('id', id)

  if (!error) {
    revalidatePath("/dashboard/guru/jurnal")
  }

  return { success: !error, error: error?.message }
}