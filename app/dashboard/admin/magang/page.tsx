"use client"

import React, { useState, useEffect } from "react"
import { 
  Users, Building, GraduationCap, BookOpen, MapPin, 
  Search, Plus, Edit, Trash2, Clock, CheckCircle, XCircle,
  User as UserIcon 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

export default function DashboardAdminPage() {
  const supabase = createClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    totalSiswa: 0,
    pending: 0,
    diterima: 0,
    ditolak: 0
  })
  const [magangData, setMagangData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
const [deleteId, setDeleteId] = useState<number | null>(null)
  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      // 1. Ambil Statistik Real-time
      const { count: total } = await supabase.from('siswa').select('*', { count: 'exact', head: true })
      const { count: pend } = await supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      const { count: acc } = await supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'diterima')
      const { count: rej } = await supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'ditolak')

      setStats({
        totalSiswa: total || 0,
        pending: pend || 0,
        diterima: acc || 0,
        ditolak: rej || 0
      })

      // 2. Ambil Data Magang untuk Tabel (Join Siswa & DUDI)
      const { data } = await supabase
  .from('magang')
  .select(`
    id,
    status,
    siswa ( id, nama, kelas ),
    dudi ( id, nama_perusahaan ),
    guru ( id, nama )
  `)
  .order('created_at', { ascending: false })

      setMagangData(data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

const [toast, setToast] = useState<{
  show: boolean
  message: string
}>({
  show: false,
  message: ""
})
  const filteredData = magangData.filter(m => 
    m.siswa?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.dudi?.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase())
  )

// Tambahkan di dalam komponen DashboardAdminPage
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [selectedId, setSelectedId] = useState<number | null>(null);

// Form State
const [formData, setFormData] = useState({
  siswa_id: "",
  guru_id: "",
  dudi_id: "",
  tanggal_mulai: "",
  tanggal_selesai: "",
  status: "pending"
});

// Dropdown Data
const [dropdowns, setDropdowns] = useState({
  siswa: [] as any[],
  dudi: [] as any[],
  guru: [] as any[]
});

// Fetch data dropdown saat modal dibuka
async function fetchDropdownData() {
  const { data: s } = await supabase.from('siswa').select('id, nama');
  const { data: d } = await supabase.from('dudi').select('id, nama_perusahaan');
  const { data: g } = await supabase.from('guru').select('id, nama');
  setDropdowns({ siswa: s || [], dudi: d || [], guru: g || [] });
}

// Fungsi Hapus dengan Konfirmasi
async function handleDelete() {
  if (!deleteId) return

  const { error } = await supabase
    .from("magang")
    .delete()
    .eq("id", deleteId)

  if (!error) {
    fetchDashboardData()

    setToast({
      show: true,
      message: "Data magang berhasil dihapus"
    })
  } else {
    alert("Gagal menghapus data")
  }

  // reset state
  setIsDeleteOpen(false)
  setDeleteId(null)
}


useEffect(() => {
  if (!toast.show) return

  const t = setTimeout(() => {
    setToast(prev => ({
      ...prev,
      show: false
    }))
  }, 3000)

  return () => clearTimeout(t)
}, [toast.show])

// Fungsi Simpan (Tambah & Edit)
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  try {
    if (isEditMode && selectedId) {
      // Hanya update GURU PEMBIMBING
      const { error } = await supabase
        .from('magang')
        .update({ 
          guru_id: formData.guru_id 
        })
        .eq('id', selectedId);

      if (error) throw error;
    } else {
      // Mode TAMBAH: Insert data baru secara lengkap
      const { error } = await supabase
        .from('magang')
        .insert([{
          siswa_id: formData.siswa_id,
          dudi_id: formData.dudi_id,
          guru_id: formData.guru_id,
          tanggal_mulai: formData.tanggal_mulai,
          tanggal_selesai: formData.tanggal_selesai,
          status: formData.status
        }]);

      if (error) throw error;
    }
    setToast({
  show: true,
  message: isEditMode
    ? "Guru pembimbing berhasil diperbarui"
    : "Data magang berhasil ditambahkan"
})
closeModal();
  } catch (error: any) {
    alert("Terjadi kesalahan: " + error.message);
  } finally {
    setLoading(false);
  }
}

const closeModal = () => {
  setIsModalOpen(false);
  setIsEditMode(false);
  setSelectedId(null);
  setFormData({ siswa_id: "", guru_id: "", dudi_id: "", tanggal_mulai: "", tanggal_selesai: "", status: "pending" });
  fetchDashboardData();
};


  return (
    <div className="space-y-8">
      {/* 1. HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Dashboard Admin</h1>
        <p className="text-slate-500 mt-1">Kelola pendaftaran dan statistik real-time</p>
      </div>

      {/* 2. CARD STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value={stats.totalSiswa} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Pending" value={stats.pending} icon={<Clock className="text-amber-600" />} color="bg-amber-50" />
        <StatCard title="Diterima" value={stats.diterima} icon={<CheckCircle className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="Ditolak" value={stats.ditolak} icon={<XCircle className="text-rose-600" />} color="bg-rose-50" />
      </div>

      {/* 3. TABEL DATA MAGANG (Profil & Aksi Samakan) */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold text-[#0A2659]">
                        <GraduationCap className="text-cyan-500" size={20} /> Data Magang Siswa
                      </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Cari siswa/perusahaan..." 
                className="pl-10 w-64 rounded-xl border-slate-200 focus-visible:ring-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
  onClick={() => { fetchDropdownData(); setIsModalOpen(true); }}
  className="bg-[#0A2659] hover:bg-cyan-600 rounded-xl gap-2"
>
  <Plus size={18} /> Tambah
</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider pl-4 text-center w-20">Profil</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Nama & Kelas</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Perusahaan</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Pembimbing</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Status</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 pl-4">
  {/* Warna diubah ke bg-[#0A2659] agar seragam dengan Manajemen User */}
  <div className="h-10 w-10 mx-auto bg-[#0A2659] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
    {m.siswa?.nama?.charAt(0).toUpperCase()}
  </div>
</td>
                  <td className="py-4">
                    <p className="font-bold text-slate-700 text-sm">{m.siswa?.nama}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{m.siswa?.kelas}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-semibold text-slate-600">{m.dudi?.nama_perusahaan}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-xs text-slate-500 italic">
                      {m.guru?.nama || "Belum Ditugaskan"}
                    </p>
                  </td>
                  <td className="py-4">
  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border
    ${m.status === 'pending' 
      ? 'bg-amber-100 text-amber-600 border-amber-200' // OREN
      : (m.status === 'diterima' || m.status === 'berlangsung') 
      ? 'bg-emerald-100 text-emerald-600 border-emerald-200' // HIJAU
      : (m.status === 'ditolak' || m.status === 'dibatalkan') 
      ? 'bg-rose-100 text-rose-600 border-rose-200' // MERAH
      : m.status === 'selesai' 
      ? 'bg-slate-100 text-slate-500 border-slate-200' // ABU-ABU
      : 'bg-gray-100 text-gray-600' // DEFAULT
    }`}>
    {m.status}
  </span>
</td>
                  <td className="py-4">
  <div className="flex justify-center gap-2">
    {/* Warna default slate-400, berubah jadi cyan saat hover */}
    <button 
  onClick={() => {
    fetchDropdownData();
    setIsEditMode(true);
    setSelectedId(m.id);
    // Masukkan data lama ke form agar muncul di input yang di-disable
    setFormData({ 
      ...formData, 
      guru_id: m.guru?.id || "", 
      siswa_id: m.siswa?.id || "", 
      dudi_id: m.dudi?.id || "" 
    });
    setIsModalOpen(true);
  }}
  className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-xl transition-all"
>
  <Edit size={16} />
</button>

<button
  onClick={() => {
    setDeleteId(m.id)
    setIsDeleteOpen(true)
  }}
  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
>
  <Trash2 size={16} />
</button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && !loading && (
            <p className="text-center py-10 text-slate-400 text-sm italic">Tidak ada data magang ditemukan.</p>
          )}
        </div>
      </div>
      {/* MODAL TAMBAH / EDIT */}
{isModalOpen && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#0A2659]">
            {isEditMode ? "Tugaskan Pembimbing" : "Tambah Data Siswa Magang"}
          </h2>
          <p className="text-sm text-slate-500">Masukkan informasi data magang siswa baru</p>
        </div>
        <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><XCircle /></button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bagian Siswa - Disabled jika Edit */}
          <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa</label>
      {isEditMode ? (
        /* Tampilan Teks Statis saat Edit */
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="h-8 w-8 bg-[#0A2659] rounded-full flex items-center justify-center text-white text-xs font-bold">
            {dropdowns.siswa.find(s => String(s.id) === String(formData.siswa_id))?.nama?.charAt(0).toUpperCase() || "S"}
          </div>
          <p className="text-sm font-bold text-slate-700">
            {dropdowns.siswa.find(s => String(s.id) === String(formData.siswa_id))?.nama || "Nama Siswa"}
          </p>
        </div>
      ) : (
        /* Dropdown saat Tambah */
        <select 
          className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
          value={formData.siswa_id}
          onChange={(e) => setFormData({...formData, siswa_id: e.target.value})}
          required
        >
          <option value="">Pilih Siswa</option>
          {dropdowns.siswa.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
        </select>
      )}
    </div>

          {/* Bagian Guru - Selalu Aktif */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Guru Pembimbing</label>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              value={formData.guru_id}
              onChange={(e) => setFormData({...formData, guru_id: e.target.value})}
              required
            >
              <option value="">Pilih Guru Pembimbing</option>
              {dropdowns.guru.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
            </select>
          </div>
        </div>

{/* Dunia Usaha/Dunia Industri */}
<div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tempat Magang (DUDI)</label>
    {isEditMode ? (
      /* Tampilan Kartu Statis saat Edit */
      <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-cyan-600 border border-slate-100 shadow-sm">
          <Building size={20} />
        </div>
        <div>
          <p className="text-sm font-black text-[#0A2659]">
            {dropdowns.dudi.find(d => String(d.id) === String(formData.dudi_id))?.nama_perusahaan || "Perusahaan ditemukan"}
          </p>
          <p className="text-[10px] text-slate-400 font-medium italic">Lokasi magang sudah terkunci</p>
        </div>
      </div>
    ) : (
      /* Dropdown saat Tambah */
      <select 
        className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
        value={formData.dudi_id}
        onChange={(e) => setFormData({...formData, dudi_id: e.target.value})}
        required
      >
        <option value="">Pilih Dunia Usaha/Dunia Industri</option>
        {dropdowns.dudi.map(d => <option key={d.id} value={d.id}>{d.nama_perusahaan}</option>)}
      </select>
    )}
  </div>

        {/* Periode & Status - Hidden jika Edit */}
        {!isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Tanggal Mulai</label>
              <Input type="date" value={formData.tanggal_mulai} onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Tanggal Selesai</label>
              <Input type="date" value={formData.tanggal_selesai} onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none"
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
          <Button type="button" variant="ghost" onClick={closeModal} className="rounded-xl font-bold text-slate-400">Batal</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold">Simpan</Button>
        </div>
      </form>
    </div>
  </div>
)}
{isDeleteOpen && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="px-6 pt-6">
        <h3 className="text-lg font-extrabold text-slate-800">
          Konfirmasi Hapus
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Apakah Anda yakin ingin menghapus data ini?  
          <br />
          <span className="text-rose-600 font-semibold">
            Tindakan ini tidak dapat dibatalkan.
          </span>
        </p>
      </div>

      {/* Action */}
      <div className="flex justify-end gap-3 px-6 py-4 mt-4 border-t">
        <Button
          variant="ghost"
          onClick={() => {
            setIsDeleteOpen(false)
            setDeleteId(null)
          }}
          className="rounded-xl font-semibold"
        >
          Batal
        </Button>

        <Button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
        >
          Ya, Hapus
        </Button>
      </div>
    </div>
  </div>
)}
{toast.show && (
  <div className="fixed top-6 right-6 z-[9999] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-5">
    <p className="text-sm font-bold">{toast.message}</p>
  </div>
)}

    </div>
  )
}

// --- REUSABLE COMPONENTS ---
function StatCard({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) {
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