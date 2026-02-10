"use client"

import React, { useEffect, useState } from "react"
import { 
  Building2, Plus, Search, Mail, Phone, Edit, 
  Trash2, CheckCircle2, XCircle, Users, Loader2, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Import Server Actions
import { getDudiData, createDudiAction, updateDudiAction, deleteDudiAction } from "./action"

export default function ManajemenDudiPage() {
  const [dudiList, setDudiList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  // State Modals
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [dudiToDelete, setDudiToDelete] = useState<any>(null)
  const [dudiToEdit, setDudiToEdit] = useState<any>(null)

  // State Toast
  const [toast, setToast] = useState<any>({ show: false, type: 'success', title: '', message: '' })

  const [formData, setFormData] = useState({
    nama_perusahaan: "", email: "", telepon: "", penanggung_jawab: "", alamat: "", status: "aktif"
  })

  // --- LOGIKA FETCH ---
  const fetchDudi = async () => {
    setLoading(true)
    try {
      const data = await getDudiData()
      setDudiList(data)
    } catch (error: any) {
      showToast('error', 'Gagal memuat data', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDudi() }, [])

  const showToast = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    setToast({ show: true, type, title, message })
    setTimeout(() => setToast((prev: any) => ({ ...prev, show: false })), 3000)
  }

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = async () => {
    if (!formData.nama_perusahaan || !formData.email) return showToast('error', 'Validasi Gagal', 'Data utama wajib diisi')
    
    setSubmitting(true)
    const result = await createDudiAction(formData)
    if (result.success) {
      showToast('success', 'Berhasil!', 'Mitra baru telah didaftarkan')
      setIsAddOpen(false)
      fetchDudi()
      setFormData({ nama_perusahaan: "", email: "", telepon: "", penanggung_jawab: "", alamat: "", status: "aktif" })
    } else {
      showToast('error', 'Gagal', result.message || "")
    }
    setSubmitting(false)
  }

  const handleEditSubmit = async () => {
    setSubmitting(true)
    const result = await updateDudiAction(dudiToEdit.id, formData)
    if (result.success) {
      showToast('success', 'Berhasil!', 'Data mitra telah diperbarui')
      setIsEditOpen(false)
      fetchDudi()
    } else {
      showToast('error', 'Gagal', result.message || "")
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    if (!dudiToDelete) return
    const result = await deleteDudiAction(dudiToDelete.id)
    if (result.success) {
      showToast('success', 'Dihapus', `DUDI ${dudiToDelete.nama_perusahaan} berhasil dihapus`)
      setIsDeleteOpen(false)
      fetchDudi()
    } else {
      showToast('error', 'Gagal', result.message || "")
    }
  }

  // Statistik & Filter
  const totalDudi = dudiList.length
  const dudiAktif = dudiList.filter(d => d.status === 'aktif').length
  const dudiTidakAktif = dudiList.filter(d => d.status === 'nonaktif').length
  const totalSiswa = dudiList.reduce((acc, curr) => acc + (curr.jumlah_siswa || 0), 0)
  const filteredDudi = dudiList.filter(d => d.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-8">
      {/* TOAST NOTIFICATION */}
    {toast.show && (
      <div className="fixed top-5 right-5 z-[2000] animate-in slide-in-from-right-10 duration-300">
        <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
          toast.type === 'success' 
            ? 'bg-emerald-500 text-white border-emerald-400' 
            : toast.type === 'error'
            ? 'bg-red-500 text-white border-red-400'
            : 'bg-amber-500 text-white border-amber-400'
        }`}>
          <div className={`p-1 rounded-full ${
            toast.type === 'success' ? 'bg-white/20' 
            : toast.type === 'error' ? 'bg-white/20'
            : 'bg-white/20'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : toast.type === 'error' ? (
              <XCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-sm">{toast.title}</p>
            <p className="text-xs opacity-90">{toast.message}</p>
          </div>
        </div>
      </div>
    )}
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-slate-50">
  <div className="flex items-center gap-2">
    <Building2 className="text-cyan-500" size={20} />
    <h3 className="font-bold text-[#0A2659]">Daftar DUDI</h3>
  </div>
  
  <div className="flex items-center gap-3">
    {/* Input Pencarian */}
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
      <Input 
        placeholder="Cari perusahaan..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 w-[200px] lg:w-[250px] border-slate-200 rounded-xl focus:ring-cyan-500" 
      />
    </div>

    {/* Tombol Tambah */}
    <Button 
      onClick={() => {
        setFormData({ nama_perusahaan: "", email: "", telepon: "", penanggung_jawab: "", alamat: "", status: "aktif" })
        setIsAddOpen(true)
      }}
      className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl gap-2 shadow-lg shadow-cyan-100"
    >
      <Plus size={18} />
      <span className="hidden sm:inline">Tambah DUDI</span>
    </Button>
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
  // Di dalam TableRow mapping, update onEditClick:
onEditClick={() => {
  setDudiToEdit(dudi)
  // Isi form dengan data yang akan diedit
  setFormData({
    nama_perusahaan: dudi.nama_perusahaan || "",
    email: dudi.email || "",
    telepon: dudi.telepon || "",
    penanggung_jawab: dudi.penanggung_jawab || "",
    alamat: dudi.alamat || "",
    status: dudi.status || "aktif"
  })
  setIsEditOpen(true)
}}
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

{/* DIALOG HAPUS */}
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

{/* MODAL FORM (TAMBAH / EDIT) */}
<Dialog open={isAddOpen || isEditOpen} onOpenChange={(val) => val ? null : (setIsAddOpen(false), setIsEditOpen(false))}>
  <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 border-none overflow-hidden bg-white">
    <div className="bg-[#0A2659] p-6 text-white">
      <DialogTitle className="text-xl font-bold flex items-center gap-2">
        {isEditOpen ? <Edit size={20} /> : <Plus size={20} />}
        {isEditOpen ? "Edit Data Mitra" : "Tambah Mitra Baru"}
      </DialogTitle>
      <p className="text-cyan-200 text-xs mt-1 italic">Lengkapi informasi detail mitra DUDI</p>
    </div>

    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Nama Perusahaan</label>
          <Input 
            name="nama_perusahaan"
            value={isEditOpen ? formData.nama_perusahaan : formData.nama_perusahaan}
            onChange={handleInputChange}
            placeholder="Contoh: PT. Teknologi Indonesia" 
            className="rounded-xl border-slate-200 focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Email</label>
            <Input 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="hrd@perusahaan.com" 
              className="rounded-xl border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Telepon/WA</label>
            <Input 
              name="telepon"
              value={formData.telepon}
              onChange={handleInputChange}
              placeholder="0812..." 
              className="rounded-xl border-slate-200"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Penanggung Jawab (PIC)</label>
          <Input 
            name="penanggung_jawab"
            value={formData.penanggung_jawab}
            onChange={handleInputChange}
            placeholder="Nama Manager / HRD" 
            className="rounded-xl border-slate-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Alamat Kantor</label>
          <textarea 
            name="alamat"
            value={formData.alamat}
            onChange={handleInputChange}
            className="w-full min-h-[80px] rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            placeholder="Jalan Merdeka No. 123..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Status Kemitraan</label>
          <select 
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-cyan-500 outline-none"
          >
            <option value="aktif">Aktif</option>
<option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          variant="outline" 
          className="flex-1 rounded-xl py-6 border-slate-200 text-slate-500" 
          onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
        >
          Batal
        </Button>
        <Button 
          className="flex-1 rounded-xl py-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
          onClick={isEditOpen ? handleEditSubmit : handleAddSubmit}
        >
          {isEditOpen ? "Simpan Perubahan" : "Daftarkan Mitra"}
        </Button>
      </div>
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

function TableRow({ dudi, onEditClick, onDeleteClick }: { 
  dudi: any, 
  onEditClick: () => void,
  onDeleteClick: () => void 
}) {
  const isAktif = dudi.status === "aktif"
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
            {count}
          </span>
        </div>
      </td>
      <td className="px-6 py-5">
    <div className="flex justify-center gap-2">
      <button 
        onClick={onEditClick}
        className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all"
      >
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