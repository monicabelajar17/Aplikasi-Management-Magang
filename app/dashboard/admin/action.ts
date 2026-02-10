"use server"
import { createClient } from "@/utils/supabase/server"

export async function getDashboardData() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  // Statistik Utama
  const { count: totalSiswa } = await supabase.from('siswa').select('*', { count: 'exact', head: true })
  const { count: totalDudi } = await supabase.from('dudi').select('*', { count: 'exact', head: true })
  const { count: siswaMagang } = await supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'berlangsung')
  const { count: logbookToday } = await supabase.from('logbook').select('*', { count: 'exact', head: true }).eq('tanggal', today)

  // Magang Terbaru
  const { data: recentMagang } = await supabase
    .from('magang')
    .select('id, status, tanggal_mulai, tanggal_selesai, siswa(nama), dudi(nama_perusahaan)')
    .order('created_at', { ascending: false })
    .limit(2)

  // Logbook Terbaru
  const { data: recentLogbook } = await supabase
    .from('logbook')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // DUDI Aktif & Hitung Siswa
  const { data: dudiAktif } = await supabase.from('dudi').select('*').limit(5)
  
  const dudiWithCount = await Promise.all(
    (dudiAktif || []).map(async (dudi) => {
      const { count } = await supabase
        .from('magang')
        .select('*', { count: 'exact', head: true })
        .eq('dudi_id', dudi.id)
        .eq('status', 'berlangsung')
      return { ...dudi, siswa_count: count || 0 }
    })
  )

  return {
    stats: { totalSiswa, totalDudi, siswaMagang, logbookToday },
    recentMagang,
    recentLogbook,
    dudiWithCount
  }
}