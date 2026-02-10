"use client"

import React, { useState, useEffect } from "react"
import { 
  Users, Building, GraduationCap, Search, Plus, Edit, Trash2, 
  Clock, CheckCircle, XCircle, Loader2 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Import Server Actions
import { 
  getDashboardData, 
  getDropdownOptions, 
  upsertMagang, 
  deleteMagang 
} from "./action"

export default function DashboardAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalSiswa: 0, pending: 0, diterima: 0, ditolak: 0 })
  const [magangData, setMagangData] = useState<any[]>([])
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState({ show: false, message: "" })
  
  const [formData, setFormData] = useState({
    siswa_id: "", guru_id: "", dudi_id: "", 
    tanggal_mulai: "", tanggal_selesai: "", status: "pending"
  })

  const [dropdowns, setDropdowns] = useState({ siswa: [], dudi: [], guru: [] })

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true)
    const res = await getDashboardData()
    setStats(res.stats)
    setMagangData(res.magangData)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  // --- HANDLERS ---
  const handleShowToast = (msg: string) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: "" }), 3000)
  }

  const openAddModal = async () => {
    const opts = await getDropdownOptions()
    setDropdowns(opts as any)
    setIsModalOpen(true)
  }

  const openEditModal = async (m: any) => {
    const opts = await getDropdownOptions()
    setDropdowns(opts as any)
    setIsEditMode(true)
    setSelectedId(m.id)
    setFormData({
      ...formData,
      guru_id: m.guru?.id || "",
      siswa_id: m.siswa?.id || "",
      dudi_id: m.dudi?.id || ""
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await upsertMagang(selectedId, formData)
    if (res.success) {
      handleShowToast(isEditMode ? "Guru pembimbing diperbarui" : "Data magang ditambahkan")
      closeModal()
      fetchData()
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    const res = await deleteMagang(deleteId)
    if (res.success) {
      handleShowToast("Data magang berhasil dihapus")
      setIsDeleteOpen(false)
      fetchData()
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setSelectedId(null)
    setFormData({ siswa_id: "", guru_id: "", dudi_id: "", tanggal_mulai: "", tanggal_selesai: "", status: "pending" })
  }

  const filteredData = magangData.filter(m => 
    m.siswa?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.dudi?.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Dashboard Admin</h1>
        <p className="text-slate-500 mt-1">Kelola pendaftaran dan statistik real-time</p>
      </div>

      {/* CARD STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value={stats.totalSiswa} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Pending" value={stats.pending} icon={<Clock className="text-amber-600" />} color="bg-amber-50" />
        <StatCard title="Diterima" value={stats.diterima} icon={<CheckCircle className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="Ditolak" value={stats.ditolak} icon={<XCircle className="text-rose-600" />} color="bg-rose-50" />
      </div>

      {/* TABEL DATA */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 font-bold text-[#0A2659]">
            <GraduationCap className="text-cyan-500" size={20} /> Data Magang Siswa
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Cari siswa/perusahaan..." 
                className="pl-10 w-64 rounded-xl border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openAddModal} className="bg-[#0A2659] hover:bg-cyan-600 rounded-xl gap-2">
              <Plus size={18} /> Tambah
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase pl-4 text-center w-20">Profil</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Nama & Kelas</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Perusahaan</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Pembimbing</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Status</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 pl-4">
                    <div className="h-10 w-10 mx-auto bg-[#0A2659] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {m.siswa?.nama?.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-slate-700 text-sm">{m.siswa?.nama}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{m.siswa?.kelas}</p>
                  </td>
                  <td className="py-4 text-sm font-semibold text-slate-600">{m.dudi?.nama_perusahaan}</td>
                  <td className="py-4 text-xs text-slate-500 italic">{m.guru?.nama || "Belum Ditugaskan"}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border
                      ${m.status === 'pending' ? 'bg-amber-100 text-amber-600 border-amber-200' : 
                        (m.status === 'diterima' || m.status === 'berlangsung') ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 
                        'bg-rose-100 text-rose-600 border-rose-200'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEditModal(m)} className="p-2 text-slate-400 hover:text-cyan-500 rounded-xl transition-all"><Edit size={16} /></button>
                      <button onClick={() => { setDeleteId(m.id); setIsDeleteOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#0A2659]">{isEditMode ? "Tugaskan Pembimbing" : "Tambah Data Magang"}</h2>
              </div>
              <button onClick={closeModal} className="text-slate-400"><XCircle /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Siswa</label>
                  {isEditMode ? (
                    <div className="p-3 bg-slate-50 border rounded-xl text-sm font-bold text-slate-700">
                      {dropdowns.siswa.find((s:any) => String(s.id) === String(formData.siswa_id))?.['nama'] || "Siswa Terpilih"}
                    </div>
                  ) : (
                    <select className="w-full p-3 rounded-xl border text-sm" value={formData.siswa_id} onChange={(e) => setFormData({...formData, siswa_id: e.target.value})} required>
                      <option value="">Pilih Siswa</option>
                      {dropdowns.siswa.map((s:any) => <option key={s.id} value={s.id}>{s.nama}</option>)}
                    </select>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Guru Pembimbing</label>
                  <select className="w-full p-3 rounded-xl border text-sm" value={formData.guru_id} onChange={(e) => setFormData({...formData, guru_id: e.target.value})} required>
                    <option value="">Pilih Guru</option>
                    {dropdowns.guru.map((g:any) => <option key={g.id} value={g.id}>{g.nama}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">DUDI (Tempat Magang)</label>
                {isEditMode ? (
                  <div className="p-3 bg-slate-50 border rounded-xl text-sm font-bold text-slate-700">
                    {dropdowns.dudi.find((d:any) => String(d.id) === String(formData.dudi_id))?.['nama_perusahaan'] || "Perusahaan Terpilih"}
                  </div>
                ) : (
                  <select className="w-full p-3 rounded-xl border text-sm" value={formData.dudi_id} onChange={(e) => setFormData({...formData, dudi_id: e.target.value})} required>
                    <option value="">Pilih DUDI</option>
                    {dropdowns.dudi.map((d:any) => <option key={d.id} value={d.id}>{d.nama_perusahaan}</option>)}
                  </select>
                )}
              </div>

              {!isEditMode && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Tanggal Mulai */}
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
      Tanggal Mulai
    </label>
    <Input 
      type="date" 
      value={formData.tanggal_mulai} 
      onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})} 
      required 
      className="rounded-xl"
    />
  </div>

  {/* Tanggal Selesai */}
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
      Tanggal Selesai
    </label>
    <Input 
      type="date" 
      value={formData.tanggal_selesai} 
      onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})} 
      required 
      className="rounded-xl"
    />
  </div>

  {/* Status */}
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
      Status
    </label>
    <select 
      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
      value={formData.status}
      onChange={(e) => setFormData({...formData, status: e.target.value})}
    >
      <option value="pending">Pending</option>
      <option value="diterima">Diterima</option>
    </select>
  </div>
</div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={closeModal}>Batal</Button>
                <Button type="submit" className="bg-blue-600 text-white px-8 rounded-xl font-bold">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-slate-800">Konfirmasi Hapus</h3>
            <p className="text-sm text-slate-500 mt-2">Data ini akan dihapus permanen. Lanjutkan?</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
              <Button onClick={confirmDelete} className="bg-red-600 text-white rounded-xl">Ya, Hapus</Button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[9999] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-5">
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
      <div className={`${color} p-4 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-black text-[#0A2659]">{value}</p>
      </div>
    </div>
  )
}