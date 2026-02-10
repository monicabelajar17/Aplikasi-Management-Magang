"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function getDudiInitialData() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const siswaId = cookieStore.get("siswa_id")?.value

  // 1. Ambil data DUDI
  const { data: dudiData } = await supabase.from('dudi').select('*')

  // 2. Ambil jumlah siswa yang sudah diterima/berlangsung per DUDI
  const { data: countData } = await supabase
    .from('magang')
    .select('dudi_id')
    .in('status', ['diterima', 'berlangsung'])

  const occupiedCounts: Record<number, number> = {}
  countData?.forEach(item => {
    occupiedCounts[item.dudi_id] = (occupiedCounts[item.dudi_id] || 0) + 1
  })

  // 3. Ambil riwayat pendaftaran siswa ini
  let appliedIds: number[] = []
  if (siswaId) {
    const { data: myApplications } = await supabase
      .from('magang')
      .select('dudi_id')
      .eq('siswa_id', parseInt(siswaId))
    
    appliedIds = myApplications?.map(m => m.dudi_id) || []
  }

  return {
    dudiList: dudiData || [],
    occupiedCounts,
    appliedIds,
    siswaId: siswaId ? parseInt(siswaId) : null
  }
}

export async function submitPendaftaran(dudiId: number) {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const siswaIdStr = cookieStore.get("siswa_id")?.value

  if (!siswaIdStr) return { success: false, error: "Sesi habis, silakan login kembali." }
  const siswaId = parseInt(siswaIdStr)

  try {
    // 1. Cek limit pendaftaran (Max 3)
    const { count } = await supabase
      .from('magang')
      .select('*', { count: 'exact', head: true })
      .eq('siswa_id', siswaId)

    if ((count ?? 0) >= 3) return { success: false, error: "Batas maksimal pendaftaran (3) telah tercapai." }

    // 2. Insert pendaftaran
    const { error } = await supabase
      .from('magang')
      .insert([{
        siswa_id: siswaId,
        dudi_id: dudiId,
        status: 'pending'
      }])

    if (error) throw error

    revalidatePath("/dashboard/siswa/dudi")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}