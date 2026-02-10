"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// 1. Ambil semua data magang untuk guru yang sedang login
export async function getMagangData() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const guruId = Number(cookieStore.get("guru_id")?.value)

  if (!guruId) return { data: [], error: "Sesi berakhir" }

  const { data, error } = await supabase
    .from("magang")
    .select(`
      id, status, tanggal_mulai, tanggal_selesai, nilai_akhir,
      siswa ( id, nama, nis, kelas ), 
      dudi ( id, nama_perusahaan )
    `)
    .eq("guru_id", guruId)

  return { data: data || [], error }
}

// 2. Ambil data untuk dropdown (Siswa & DUDI)
export async function getDropdownOptions() {
  const supabase = await createClient()
  const { data: siswa } = await supabase.from('siswa').select('id, nama')
  const { data: dudi } = await supabase.from('dudi').select('id, nama_perusahaan')
  
  return { siswa: siswa || [], dudi: dudi || [] }
}

// 3. Simpan data (Tambah/Edit/Hapus)
export async function manageMagang(type: "tambah" | "edit" | "hapus", payload: any, id?: number) {
  const supabase = await createClient()
  
  try {
    if (type === "tambah") {
      const { error } = await supabase.from('magang').insert([payload])
      if (error) throw error
    } 
    else if (type === "edit" && id) {
      const { error } = await supabase.from('magang').update(payload).eq('id', id)
      if (error) throw error
    } 
    else if (type === "hapus" && id) {
      const { error } = await supabase.from('magang').delete().eq('id', id)
      if (error) throw error
    }

    revalidatePath("/dashboard/guru/magang")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}