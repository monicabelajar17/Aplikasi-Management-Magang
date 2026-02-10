"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// 1. Ambil Statistik & Data Tabel
export async function getDashboardData() {
  const supabase = await createClient()

  const { count: total } = await supabase.from('siswa').select('*', { count: 'exact', head: true })
  const { count: pend } = await supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  const { count: acc } = await supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'diterima')
  const { count: rej } = await supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'ditolak')

  const { data: magang } = await supabase
    .from('magang')
    .select(`
      id,
      status,
      siswa ( id, nama, kelas ),
      dudi ( id, nama_perusahaan ),
      guru ( id, nama )
    `)
    .order('created_at', { ascending: false })

  return {
    stats: {
      totalSiswa: total || 0,
      pending: pend || 0,
      diterima: acc || 0,
      ditolak: rej || 0
    },
    magangData: magang || []
  }
}

// 2. Ambil Data untuk Dropdown (Siswa, DUDI, Guru)
export async function getDropdownOptions() {
  const supabase = await createClient()
  const { data: s } = await supabase.from('siswa').select('id, nama')
  const { data: d } = await supabase.from('dudi').select('id, nama_perusahaan')
  const { data: g } = await supabase.from('guru').select('id, nama')

  return { siswa: s || [], dudi: d || [], guru: g || [] }
}

// 3. Tambah atau Update Data Magang
export async function upsertMagang(id: number | null, formData: any) {
  const supabase = await createClient()

  if (id) {
    // Mode EDIT: Update Guru Pembimbing saja sesuai logic aslimu
    const { error } = await supabase
      .from('magang')
      .update({ guru_id: formData.guru_id })
      .eq('id', id)
    if (error) return { success: false, error: error.message }
  } else {
    // Mode TAMBAH
    const { error } = await supabase
      .from('magang')
      .insert([{
        siswa_id: formData.siswa_id,
        dudi_id: formData.dudi_id,
        guru_id: formData.guru_id,
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai,
        status: formData.status
      }])
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/admin')
  return { success: true }
}

// 4. Hapus Data Magang
export async function deleteMagang(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('magang').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard/admin')
  return { success: true }
}