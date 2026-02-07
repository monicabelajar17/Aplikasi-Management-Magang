"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { 
  BookOpen, Plus, Search, Filter, CheckCircle2, 
  Clock, XCircle, Edit, Trash2, Eye, AlertCircle, 
  MessageSquare, ChevronDown 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FormJurnalModal from "./detail/page"

export default function JurnalHarianSiswa() {
  const supabase = createClient()
  
  // --- STATES ---
  const [jurnals, setJurnals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"tambah" | "edit" | "delete" | "view">("tambah")
  const [selectedData, setSelectedData] = useState<any>(null)
  
  // State untuk Peringatan & Filter
  const [hasJournalToday, setHasJournalToday] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("Semua Status")

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    const cookies = document.cookie.split('; ');
    const siswaIdCookie = cookies.find(row => row.startsWith('siswa_id='));
    const loggedInSiswaId = siswaIdCookie ? siswaIdCookie.split('=')[1] : null;

    if (!loggedInSiswaId) {
      setLoading(false);
      return;
    }

    try {
      const { data: magangData, error: magangError } = await supabase
        .from('magang')
        .select('id')
        .eq('siswa_id', loggedInSiswaId)
        .single();

      if (magangError || !magangData) {
        setJurnals([]);
        return;
      }

      const { data: logbookData, error: logbookError } = await supabase
        .from('logbook')
        .select('*')
        .eq('magang_id', magangData.id)
        .eq('is_deleted', false)
        .order('tanggal', { ascending: false });

      if (!logbookError && logbookData) {
        setJurnals(logbookData);
        
        // LOGIKA PERINGATAN: Cek apakah ada jurnal tanggal hari ini
        const today = new Date().toISOString().split('T')[0];
        const foundToday = logbookData.some(j => j.tanggal === today);
        setHasJournalToday(!!foundToday);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleTambah = () => {
    setModalMode("tambah")
    setSelectedData(null)
    setModalOpen(true)
  }
const handleView = (data: any) => {

  setModalMode("view")

  setSelectedData(data) // Mengirim seluruh baris logbook

  setModalOpen(true)

}
const handleDelete = (data: any) => {

  setModalMode("delete")

  setSelectedData(data) // Kirim object lengkap (termasuk ID), jangan cuma tanggalnya

  setModalOpen(true)

}
  const handleEdit = (data: any) => {
    setModalMode("edit")
    setSelectedData(data)
    setModalOpen(true)
  }

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      if (modalMode === "edit") {
        const { error } = await supabase
          .from('logbook')
          .update({
            tanggal: formData.tanggal,
            kegiatan: formData.kegiatan,
            kendala: formData.kendala,
            status_verifikasi: 'pending' 
          })
          .eq('id', selectedData.id);

        if (error) throw error;
        toast.success("Jurnal berhasil diperbarui!");
      } else {
        const cookies = document.cookie.split('; ');
        const siswaId = cookies.find(row => row.startsWith('siswa_id='))?.split('=')[1];
        const { data: magang } = await supabase.from('magang').select('id').eq('siswa_id', siswaId).single();
        if (!magang) throw new Error("Data magang tidak ditemukan");

        const { error } = await supabase.from('logbook').insert([{
          magang_id: magang.id,
          tanggal: formData.tanggal,
          kegiatan: formData.kegiatan,
          kendala: formData.kendala,
          status_verifikasi: 'pending',
          is_deleted: false
        }]);

        if (error) throw error;
        toast.success("Jurnal baru berhasil ditambahkan!");
      }
      setModalOpen(false);
      fetchData(); 
    } catch (error: any) {
      toast.error("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!selectedData?.id) return;
    try {
      const { error } = await supabase.from('logbook').update({ is_deleted: true }).eq('id', selectedData.id);
      if (error) throw error;
      toast.success("Jurnal berhasil dihapus");
      setModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error("Gagal menghapus: " + error.message);
    }
  };

  // --- LOGIKA FILTERING ---
  const filteredJurnals = jurnals.filter(j => {
    const matchesSearch = j.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (j.kendala?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua Status" || j.status_verifikasi === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalJurnal = jurnals.length
  const disetujui = jurnals.filter(j => j.status_verifikasi === 'disetujui').length
  const pending = jurnals.filter(j => j.status_verifikasi === 'pending').length
  const ditolak = jurnals.filter(j => j.status_verifikasi === 'ditolak').length
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Jurnal Harian Magang</h1>
          <p className="text-slate-500 mt-1">Catat aktivitas dan kendala selama pelaksanaan magang</p>
        </div>
        <Button onClick={handleTambah} className="bg-[#0A2659] ...">
        <Plus size={20} /> Tambah Jurnal
      </Button>
      </div>

      {/* Tampilkan Banner hanya jika belum ada jurnal hari ini dan tidak sedang loading */}
{!loading && !hasJournalToday && (
  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between shadow-sm shadow-amber-50 animate-in fade-in slide-in-from-top-4">
    <div className="flex items-center gap-3">
      <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
        <AlertCircle size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-amber-800">Jangan Lupa Jurnal Hari Ini!</p>
        <p className="text-[11px] text-amber-700/80">
          Anda belum membuat jurnal untuk hari ini ({new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}).
        </p>
      </div>
    </div>
    <Button 
      onClick={handleTambah} // Sama fungsinya dengan tombol tambah di atas
      size="sm" 
      className="bg-[#E67E22] hover:bg-orange-600 text-white rounded-xl text-[11px] font-bold px-4"
    >
      Buat Sekarang
    </Button>
  </div>
)}

      {/* STATS GRID - 4 Kolom sesuai gambar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard 
    title="Total Jurnal" 
    value={totalJurnal.toString()} 
    sub="Jurnal yang telah dibuat" 
    icon={<BookOpen className="text-[#0A2659]" />} 
  />
  <StatCard 
    title="Disetujui" 
    value={disetujui.toString()} 
    sub="Jurnal disetujui guru" 
    icon={<CheckCircle2 className="text-emerald-500" />} 
  />
  <StatCard 
    title="Menunggu" 
    value={pending.toString()} 
    sub="Belum diverifikasi" 
    icon={<Clock className="text-blue-500" />} 
  />
  <StatCard 
    title="Ditolak" 
    value={ditolak.toString()} 
    sub="Perlu diperbaiki" 
    icon={<XCircle className="text-rose-500" />} 
  />
</div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar & Filter */}
        <div className="p-6 border-b border-slate-50 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-[#0A2659]">
              <BookOpen className="text-[#0A2659]" size={20} />
              Riwayat Jurnal
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Cari kegiatan atau kendala..." className="pl-9 border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" />
            </div>
            <Button variant="outline" className="rounded-xl gap-2 text-slate-500 border-slate-200 text-xs font-bold">
              <Filter size={14} /> Sembunyikan Filter
            </Button>
          </div>

          {/* Filter Bar sesuai gambar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <FilterSelect label="Status" placeholder="Semua Status" />
            <FilterSelect label="Bulan" placeholder="Semua Bulan" />
            <FilterSelect label="Tahun" placeholder="Semua Tahun" />
            <div className="flex items-end">
               <Button variant="ghost" className="text-[11px] font-bold text-slate-400 hover:text-cyan-600">Reset Filter</Button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-4">Tanggal</th>
                <th className="px-8 py-4">Kegiatan & Kendala</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4">Feedback Guru</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
  {loading ? (
    <tr>
      <td colSpan={5} className="text-center py-10 text-slate-400 text-xs italic">
        Memuat data jurnal...
      </td>
    </tr>
  ) : jurnals.length === 0 ? (
    <tr>
      <td colSpan={5} className="text-center py-10 text-slate-400 text-xs">
        Belum ada jurnal untuk ditampilkan.
      </td>
    </tr>
  ) : (
    filteredJurnals.map((jurnal) => (
  <RiwayatTableRow 
    key={jurnal.id}
    date={new Date(jurnal.tanggal).toLocaleDateString('id-ID', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })}
    kegiatan={jurnal.kegiatan}
    status={jurnal.status_verifikasi} 
    feedback={jurnal.catatan_guru || "Belum ada feedback"}
    onView={() => handleView(jurnal)}
    onEdit={() => handleEdit(jurnal)}
    // PERBAIKI INI: Kirim jurnal (object lengkap), bukan cuma tanggal
    onDelete={() => handleDelete(jurnal)} 
  />
))
  )}
</tbody>
          </table>
        </div>
      </div>
      <FormJurnalModal 
  isOpen={modalOpen} 
  onClose={() => setModalOpen(false)} 
  mode={modalMode}
  data={selectedData}
  onConfirmDelete={executeDelete}
  onSave={handleSave} // TAMBAHKAN INI
/>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-extrabold text-[#0A2659] my-1">{value}</h2>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">{icon}</div>
    </div>
  )
}

function FilterSelect({ label, placeholder }: any) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="relative">
        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium">
          <option>{placeholder}</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400" />
      </div>
    </div>
  )
}

function RiwayatTableRow({ date, kegiatan, status, feedback, onEdit, onDelete, onView }: any) {
  const statusConfig: any = {
    disetujui: "bg-emerald-50 text-emerald-500",
    pending: "bg-amber-50 text-amber-500",
    ditolak: "bg-rose-50 text-rose-500",
  }

  const statusLabel: any = {
    disetujui: "Disetujui",
    pending: "Menunggu Verifikasi",
    ditolak: "Ditolak",
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-6 align-top">
        <p className="text-xs font-bold text-slate-700 leading-tight min-w-[100px]">{date}</p>
      </td>
      <td className="px-8 py-6">
        <div className="max-w-[400px] space-y-3">
          <div>
            <p className="text-[10px] font-extrabold text-slate-700 uppercase tracking-tighter mb-1">Kegiatan:</p>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">{kegiatan}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-6 text-center align-top">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider ${statusConfig[status]}`}>
            {statusLabel[status]}
          </span>
          {status === 'ditolak' && <p className="text-[8px] text-rose-400 font-bold uppercase">Perlu diperbaiki</p>}
        </div>
      </td>
      <td className="px-8 py-6 align-top">
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[180px]">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare size={10} className="text-slate-400" />
            <p className="text-[9px] font-bold text-slate-400 uppercase">Catatan Guru:</p>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            {feedback === "Belum ada feedback" ? <span className="text-slate-300 italic">{feedback}</span> : feedback}
          </p>
        </div>
      </td>
      <td className="px-8 py-6 text-center align-top">
        <div className="flex justify-center gap-2">
          {/* Tombol Mata (View) - Selalu Ada di Semua Status */}
          <button 
            onClick={onView} 
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Eye size={16} />
          </button>

          {/* Tombol Edit & Delete - Hanya Ada jika status BUKAN disetujui */}
          {status !== 'disetujui' && (
            <>
              <button 
                onClick={onEdit} 
                className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={onDelete} 
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}