"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function getGuruDashboardData() {
  const supabase = await createClient()

  // 1. Ambil Guru ID dari Cookie
  const cookieStore = await cookies()
  const guruId = Number(cookieStore.get("guru_id")?.value)

  if (!guruId) {
    throw new Error("Guru belum login")
  }

  const today = new Date().toISOString().split('T')[0]

  // 2. Ambil Statistik
  const { count: totalSiswa } = await supabase
    .from('siswa')
    .select('*', { count: 'exact', head: true })
    .eq('guru_id', guruId)

  const { data: dudiData } = await supabase
    .from("magang")
    .select(`dudi_id, siswa!inner ( guru_id )`)
    .eq("siswa.guru_id", guruId)

  const totalDudi = new Set(dudiData?.map(d => d.dudi_id)).size

  const { count: siswaMagang } = await supabase
    .from("magang")
    .select(`id, siswa!inner ( guru_id )`, { count: "exact", head: true })
    .eq("status", "berlangsung")
    .eq("siswa.guru_id", guruId)

  const { count: logbookToday } = await supabase
    .from("logbook")
    .select(`id, magang!inner ( siswa!inner ( guru_id ) )`, { count: "exact", head: true })
    .eq("tanggal", today)
    .eq("magang.siswa.guru_id", guruId)

  // 3. Ambil Magang Terbaru
  const { data: recentMagang } = await supabase
    .from("magang")
    .select(`
      id, status, tanggal_mulai, tanggal_selesai,
      siswa!inner ( nama, guru_id ),
      dudi ( nama_perusahaan )
    `)
    .eq("siswa.guru_id", guruId)
    .order("created_at", { ascending: false })
    .limit(2)

  // 4. Ambil Logbook Terbaru
  const { data: recentLogbooks } = await supabase
    .from("logbook")
    .select(`
      id, kegiatan, tanggal, status_verifikasi, kendala,
      magang!inner ( siswa!inner ( nama, guru_id ) )
    `)
    .eq("magang.siswa.guru_id", guruId)
    .order("created_at", { ascending: false })
    .limit(2)

  // 5. Ambil DUDI Aktif
  const { data: dudiAktif } = await supabase
    .from("dudi")
    .select(`
      id, nama_perusahaan, alamat,
      magang!inner ( id, status, siswa!inner ( guru_id ) )
    `)
    .eq("magang.status", "berlangsung")
    .eq("magang.siswa.guru_id", guruId)
    .eq("is_deleted", false)

  const formattedDudiAktif = dudiAktif?.map(d => ({
    ...d,
    siswa_count: d.magang.length
  }))

  return {
    stats: {
      totalSiswa: totalSiswa || 0,
      totalDudi: totalDudi || 0,
      siswaMagang: siswaMagang || 0,
      logbookToday: logbookToday || 0
    },
    recentMagang: recentMagang || [],
    recentLogbooks: recentLogbooks || [],
    dudiAktif: formattedDudiAktif || []
  }
}