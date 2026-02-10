import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

interface Dudi {
  id: number
  nama_perusahaan: string
  bidang_dudi: string
  alamat: string
  telepon: string
  email: string
  penanggung_jawab: string
  kuota_magang: number
  deskripsi: string
}

export const useDudiSiswa = () => {
  const [dudiList, setDudiList] = useState<Dudi[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDudi, setSelectedDudi] = useState<Dudi | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [appliedIds, setAppliedIds] = useState<number[]>([])
  const [occupiedCounts, setOccupiedCounts] = useState<Record<number, number>>({})
  const [totalDaftar, setTotalDaftar] = useState(0)

  const MAX_DAFTAR = 3
  const supabase = createClient()

  // Ambil data awal
  const fetchInitialData = async () => {
    setLoading(true)

    // 1. Ambil data DUDI
    const { data: dudiData } = await supabase.from('dudi').select('*')
    if (dudiData) setDudiList(dudiData)

    // 2. Ambil jumlah siswa yang SUDAH diterima per DUDI
    const { data: countData } = await supabase
      .from('magang')
      .select('dudi_id')
      .in('status', ['diterima', 'berlangsung'])

    if (countData) {
      const counts: Record<number, number> = {}
      countData.forEach(item => {
        counts[item.dudi_id] = (counts[item.dudi_id] || 0) + 1
      })
      setOccupiedCounts(counts)
    }

    // 3. Ambil riwayat pendaftaran siswa ini
    const value = `; ${document.cookie}`
    const parts = value.split(`; siswa_id=`)
    const siswaId = parts.length === 2 ? parts.pop()?.split(';').shift() : null

    if (siswaId) {
      const { data: magangRecords } = await supabase
        .from('magang')
        .select('dudi_id')
        .eq('siswa_id', parseInt(siswaId))

      if (magangRecords) {
        const applied = magangRecords.map(m => m.dudi_id)
        setAppliedIds(applied)
        setTotalDaftar(applied.length)
      }
    }

    setLoading(false)
  }

  // Fungsi handle daftar
  const handleDaftar = async (dudiId: number) => {
    if (totalDaftar >= MAX_DAFTAR) {
      alert("Batas maksimal pendaftaran DUDI hanya 3 kali.")
      return
    }

    setLoading(true)
    try {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop()?.split(';').shift()
      }

      const siswaIdStr = getCookie("siswa_id")
      if (!siswaIdStr) {
        alert("Sesi berakhir, silakan login kembali.")
        return
      }

      const siswaId = parseInt(siswaIdStr)

      // Cek apakah sudah pernah daftar
      if (appliedIds.includes(dudiId)) {
        alert("Kamu sudah mendaftar di perusahaan ini!")
        return
      }

      // Cek jumlah pendaftaran dari database
      const { count } = await supabase
        .from('magang')
        .select('*', { count: 'exact', head: true })
        .eq('siswa_id', siswaId)

      if ((count ?? 0) >= 3) {
        alert("Batas maksimal pendaftaran DUDI hanya 3 kali.")
        return
      }

      // Simpan ke database
      const { error: insertError } = await supabase
        .from('magang')
        .insert([
          {
            siswa_id: siswaId,
            dudi_id: dudiId,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) throw insertError

      // Update state
      setAppliedIds(prev => [...prev, dudiId])
      setTotalDaftar(prev => prev + 1)
      setShowToast(true)
      setSelectedDudi(null)

    } catch (error: any) {
      console.error("Error pendaftaran:", error.message)
      alert("Gagal mendaftar: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  return {
    dudiList,
    loading,
    selectedDudi,
    showToast,
    searchTerm,
    appliedIds,
    occupiedCounts,
    totalDaftar,
    handleDaftar,
    setSelectedDudi,
    setShowToast,
    setSearchTerm,
  }
}