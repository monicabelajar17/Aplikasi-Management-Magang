"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { 
  Building2, Plus, Search, Mail, Phone, Edit, 
  Trash2, CheckCircle2, XCircle, Users, Loader2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

// --- MAIN PAGE ---
export default function ManajemenDudiPage() {
  const supabase = createClient()
  const [dudiList, setDudiList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [dudiToDelete, setDudiToDelete] = useState<any>(null)

  const fetchDudi = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('dudi')
      .select(`
        *,
        magang(count)
      `)
      .order('nama_perusahaan', { ascending: true })
    
    if (error) {
      console.error("Error fetch DUDI:", error.message)
    } else {
      const formattedData = data.map(item => ({
        ...item,
        jumlah_siswa: item.magang?.[0]?.count || 0
      }))
      setDudiList(formattedData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDudi()
  }, [])

  // Fungsi untuk menghapus DUDI
  const handleDelete = async () => {
    if (!dudiToDelete) return

    const { error } = await supabase
      .from('dudi')
      .delete()
      .eq('id', dudiToDelete.id)

    if (error) {
      alert("Gagal menghapus: " + error.message)
    } else {
      setIsDeleteOpen(false)
      setDudiToDelete(null)
      fetchDudi() // Refresh data
    }
  }

  // --- LOGIKA STATISTIK ---
  const totalDudi = dudiList.length
  const dudiAktif = dudiList.filter(d => d.status === 'Aktif').length
  const dudiTidakAktif = dudiList.filter(d => d.status === 'Tidak Aktif').length
  const totalSiswa = dudiList.reduce((acc, curr) => acc + (curr.jumlah_siswa || 0), 0)

  const filteredDudi = dudiList.filter(d => 
    d.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.penanggung_jawab?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen DUDI</h1>
        <p className="text-slate-500 mt-1">Kelola data mitra Dunia Usaha dan Dunia Industri</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total DUDI" value={totalDudi} sub="Perusahaan mitra" icon={<Building2 className="text-cyan-500" />} />
        <StatCard title="DUDI Aktif" value={dudiAktif} sub="Perusahaan aktif" icon={<CheckCircle2 className="text-emerald-500" />} />
        <StatCard title="DUDI Tidak Aktif" value={dudiTidakAktif} sub="Perusahaan tidak aktif" icon={<XCircle className="text-red-500" />} />
        <StatCard title="Total Siswa Magang" value={totalSiswa} sub="Siswa magang aktif" icon={<Users className="text-blue-500" />} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-cyan-500" size={20} />
            <h3 className="font-bold text-[#0A2659]">Daftar DUDI</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari perusahaan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[250px] border-slate-200 rounded-xl" 
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Perusahaan</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Penanggung Jawab</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Siswa Magang</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400">
                    <Loader2 className="animate-spin inline mr-2" /> Memuat data DUDI...
                  </td>
                </tr>
              ) : filteredDudi.map((dudi) => (
                <TableRow 
                  key={dudi.id} 
                  dudi={dudi}
                  onDeleteClick={() => {
                    setDudiToDelete(dudi)
                    setIsDeleteOpen(true)
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-[#0A2659]">
              Hapus DUDI
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">Apakah Anda yakin?</h3>
            <p className="text-slate-500 text-sm">
              Anda akan menghapus <span className="font-semibold text-[#0A2659]">{dudiToDelete?.nama_perusahaan}</span>. 
              Data yang dihapus <span className="font-bold text-red-500">tidak dapat dikembalikan</span>.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50"
              onClick={() => {
                setIsDeleteOpen(false)
                setDudiToDelete(null)
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
            >
              Ya, Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// --- SUB-COMPONENTS (Pindahkan ke bawah atau file terpisah) ---

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-4 right-4 bg-slate-50 p-2 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <h2 className="text-3xl font-extrabold text-[#0A2659] my-2">{value}</h2>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
  )
}

function TableRow({ dudi, onDeleteClick }: { 
  dudi: any, 
  onDeleteClick: () => void 
}) {
  const isAktif = dudi.status === "Aktif"
  const count = dudi.jumlah_siswa || 0

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-cyan-100 flex items-center justify-center rounded-xl text-cyan-600">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">{dudi.nama_perusahaan}</p>
            <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[200px]">{dudi.alamat}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Mail size={12} className="text-slate-300" /> {dudi.email}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Phone size={12} className="text-slate-300" /> {dudi.telepon}
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400 text-uppercase">
            {dudi.penanggung_jawab?.charAt(0) || "P"}
          </div>
          <p className="text-sm font-semibold text-slate-700">{dudi.penanggung_jawab}</p>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
          isAktif ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
        }`}>
          {dudi.status?.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="bg-lime-500 text-white text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap">
            {count} Siswa
          </span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex justify-center gap-2">
          <button className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all">
            <Edit size={16} />
          </button>
          <button 
            onClick={onDeleteClick}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}