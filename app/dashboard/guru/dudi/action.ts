"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function getDudiGuruData() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const guruId = Number(cookieStore.get("guru_id")?.value)

  if (!guruId) {
    return { error: "Guru belum login", data: [] }
  }

  // Ambil data DUDI yang memiliki relasi magang dengan siswa bimbingan guru ini
  const { data, error } = await supabase
    .from("dudi")
    .select(`
      id,
      nama_perusahaan,
      alamat,
      email,
      telepon,
      penanggung_jawab,
      magang!inner (
        id,
        status,
        siswa!inner ( guru_id )
      )
    `)
    .eq("magang.status", "berlangsung")
    .eq("magang.siswa.guru_id", guruId)
    .eq("is_deleted", false)

  if (error) {
    console.error("Fetch DUDI Error:", error)
    return { error: error.message, data: [] }
  }

  // Format data untuk menghitung jumlah siswa per DUDI
  const formattedData = data.map((dudi: any) => ({
    id: dudi.id,
    nama_perusahaan: dudi.nama_perusahaan,
    alamat: dudi.alamat,
    email: dudi.email,
    telepon: dudi.telepon,
    penanggung_jawab: dudi.penanggung_jawab,
    siswa_count: dudi.magang.length
  }))

  return { data: formattedData, error: null }
}