"use server"

import { createClient } from "@/utils/supabase/server"

export async function getAdminStats() {
  const supabase = await createClient()

  const [
    { count: totalSiswa },
    { count: totalDudi },
    { count: siswaMagang },
    { count: logbookToday }
  ] = await Promise.all([
    supabase.from('siswa').select('*', { count: 'exact', head: true }),
    supabase.from('dudi').select('*', { count: 'exact', head: true }),
    supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'berlangsung'),
    supabase.from('logbook').select('*', { count: 'exact', head: true }).eq('tanggal', new Date().toISOString().split('T')[0])
  ])

  return {
    totalSiswa: totalSiswa || 0,
    totalDudi: totalDudi || 0,
    siswaMagang: siswaMagang || 0,
    logbookToday: logbookToday || 0
  }
}

export async function getRecentActivities() {
  const supabase = await createClient()

  const { data: recentMagang } = await supabase //array
    .from('magang')
    .select(
        `id, 
        status, 
        tanggal_mulai, 
        tanggal_selesai, 
        siswa ( nama ), 
        dudi ( nama_perusahaan )`
    )
    .order('created_at', { ascending: false })
    .limit(2)

  const { data: recentLogbook } = await supabase
    .from('logbook')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return { 
    recentMagang: recentMagang || [], 
    recentLogbook 
  }
}

export async function getDudiPartners() {
  const supabase = await createClient()

  const { data: dudiAktif } = await supabase.from('dudi').select('*').limit(5)

  if (!dudiAktif) return []

  const dudiWithStudentCount = await Promise.all(
    dudiAktif.map(async (dudi) => {
      const { count } = await supabase
        .from('magang')
        .select('*', { count: 'exact', head: true })
        .eq('dudi_id', dudi.id)
        .eq('status', 'berlangsung')
      
      return { ...dudi, siswa_count: count || 0 }
    })
  )

  return dudiWithStudentCount
}