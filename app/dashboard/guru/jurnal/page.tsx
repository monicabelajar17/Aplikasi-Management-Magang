"use client"

import React, { useState, useEffect } from "react"
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  MessageSquare,
  ClipboardList,
  X,
  AlertCircle,
  FileText,
  Download,
  Edit2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client" // Pastikan path ini benar
import { toast } from "sonner"

export default function ManajemenJurnalGuru() {
  const supabase = createClient()
  
  // --- STATES ---
  const [jurnals, setJurnals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedJurnal, setSelectedJurnal] = useState<any>(null)
  const [catatan, setCatatan] = useState("")

  // --- LOGIKA FETCH DATA ---
// --- LOGIKA FETCH DATA ---
// Ganti bagian fetchData di ManajemenJurnalGuru kamu
const fetchData = async () => {
  setLoading(true)
  try {
    // Fungsi pembantu ambil cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const rawId = getCookie("guru_id");
    console.log("ID Guru dari Cookie:", rawId); // Cek di console F12

    if (!rawId) {
      toast.error("Sesi guru tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    const loggedInGuruId = parseInt(rawId, 10);

    const { data, error } = await supabase
      .from('logbook')
      .select(`
        *,
        magang!inner (
          id,
          guru_id,
          siswa:siswa_id (nama, nis, kelas)
        )
      `)
      .eq('magang.guru_id', loggedInGuruId)
      .eq('is_deleted', false)
      .order('tanggal', { ascending: false });

    if (error) throw error;
    setJurnals(data || []);
  } catch (err: any) {
    console.error("Fetch Error:", err);
    toast.error("Gagal memuat data");
  } finally {
    setLoading(false);
  }
};

  // 4. Gunakan useEffect untuk memanggil fetchData saat halaman dimuat
  useEffect(() => {
    fetchData()
  }, [])

  // --- HANDLER VERIFIKASI ---
 const handleVerifikasi = async (status: 'diterima' | 'ditolak') => {
    if (!selectedJurnal) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('logbook')
        .update({ 
          status_verifikasi: status,
          catatan_guru: catatan || null // Pastikan mengirim null jika kosong
        })
        .eq('id', selectedJurnal.id);

      if (error) throw error;
      
      toast.success(`Jurnal berhasil ${status === 'diterima' ? 'diterima' : 'ditolak'}`);
      setModalOpen(false);
      fetchData(); // Refresh data tabel
    } catch (err: any) {
      console.error("Update Error:", err);
      toast.error(`Gagal update: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setLoading(false);
    }
  }

const handleDownload = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Ambil nama file dari URL
    const fileName = url.split('/').pop() || 'dokumentasi-jurnal';
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Gagal mengunduh file secara otomatis");
    // Fallback jika fetch gagal: buka di tab baru
    window.open(url, '_blank');
  }
};

const openDetail = (data: any) => {
    setSelectedJurnal(data)
    setCatatan(data.catatan_guru || "") // Isi feedback lama jika ada
    setModalOpen(true)
  }

  const totalLogbook = jurnals.length
const pendingLogbook = jurnals.filter(j => j.status_verifikasi === 'pending').length
const disetujuiLogbook = jurnals.filter(j => j.status_verifikasi === 'diterima').length
const ditolakLogbook = jurnals.filter(j => j.status_verifikasi === 'ditolak').length
  return (
    <div className="space-y-8 relative">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen Jurnal Harian Magang</h1>
        <p className="text-slate-500 mt-1">Verifikasi dan berikan feedback pada laporan aktivitas harian siswa</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
  <StatCard 
    title="Total Logbook" 
    value={totalLogbook.toString()} 
    sub="Laporan terdaftar" 
    icon={<BookOpen className="text-cyan-500" />} 
  />
  <StatCard 
    title="Belum Diverifikasi" 
    value={pendingLogbook.toString()} 
    sub="Menunggu verifikasi" 
    icon={<Clock className="text-amber-500" />} 
  />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
  <StatCard 
    title="Disetujui" 
    value={disetujuiLogbook.toString()} 
    sub="Sudah diverifikasi" 
    icon={<CheckCircle className="text-emerald-500" />} 
  />
  <StatCard 
    title="Ditolak" 
    value={ditolakLogbook.toString()} 
    sub="Perlu perbaikan" 
    icon={<XCircle className="text-rose-500" />} 
  />
</div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#0A2659]">
            <ClipboardList className="text-cyan-500" size={20} />
            Daftar Logbook Siswa
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Cari siswa, kegiatan, atau kendala..." className="pl-9 border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-4">Siswa & Tanggal</th>
                <th className="px-8 py-4">Kegiatan & Kendala</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4">Catatan Guru</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
  {loading ? (
    <tr><td colSpan={5} className="text-center py-10 text-slate-400">Memuat data...</td></tr>
  ) : jurnals.length === 0 ? (
    <tr><td colSpan={5} className="text-center py-10 text-slate-400">Belum ada jurnal bimbingan</td></tr>
  ) : (
    jurnals.map((jurnal) => (
  <JurnalTableRow 
    key={jurnal.id}
    data={{
      // Akses nama siswa: jurnal -> magang -> siswa -> nama
      name: jurnal.magang?.siswa?.nama || "Tanpa Nama", 
      date: new Date(jurnal.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' }),
      kegiatan: jurnal.kegiatan,
      status: jurnal.status_verifikasi,
      feedback: jurnal.catatan_guru || "Belum ada catatan"
    }}
    onView={() => {
      setSelectedJurnal(jurnal)
      setCatatan(jurnal.catatan_guru || "")
      setModalOpen(true)
    }}
  />
))
  )}
</tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DETAIL JURNAL (Persis Gambar) --- */}
      {/* --- MODAL DETAIL JURNAL --- */}
{modalOpen && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
      
      {/* Modal Header */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="bg-cyan-500 p-2.5 rounded-xl text-white shadow-lg shadow-cyan-100">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0A2659]">Detail Jurnal Harian</h3>
            <p className="text-xs text-slate-400 font-medium">
              {selectedJurnal?.magang?.siswa?.nama} • {new Date(selectedJurnal?.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}
            </p>
          </div>
        </div>
        <button onClick={() => setModalOpen(false)} className="text-slate-300 hover:text-slate-500 p-1">
          <X size={24} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Section Kegiatan */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <BookOpen size={16} className="text-cyan-500" />
            Kegiatan
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">{selectedJurnal?.kegiatan}</p>
          </div>
        </div>

        {/* Section Kendala */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <AlertCircle size={16} className="text-orange-500" />
            Kendala yang Dihadapi
          </div>
          <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {selectedJurnal?.kendala || "Tidak ada kendala dilaporkan"}
            </p>
          </div>
        </div>

        {/* Section Dokumentasi */}
<div className="space-y-3">
  <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
    <FileText size={16} className="text-emerald-500" />
    Dokumentasi
  </div>
  
  {selectedJurnal?.file ? (
    <div className="flex items-center gap-2">
      {/* Area Kotak: Klik untuk Lihat/Preview */}
      <div 
        onClick={() => window.open(selectedJurnal.file, '_blank')}
        className="flex-1 bg-emerald-50/30 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-emerald-50 transition-all group"
      >
        <div className="text-emerald-600 group-hover:scale-110 transition-transform">
          <FileText size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-600 truncate max-w-[180px]">
            {selectedJurnal.file.split('/').pop()}
          </span>
          <span className="text-[10px] text-emerald-500 font-semibold">Klik untuk melihat foto</span>
        </div>
      </div>

      {/* Tombol Download: Klik untuk Unduh Otomatis */}
      <Button 
        size="sm" 
        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-2 px-4 h-[52px] shadow-sm shadow-emerald-100"
        onClick={(e) => {
          e.stopPropagation(); // Agar fungsi 'lihat' di kotak tidak ikut terpicu
          handleDownload(selectedJurnal.file);
        }}
      >
        <Download size={16} />
      </Button>
    </div>
  ) : (
    <div className="bg-slate-50 border border-dashed border-slate-200 p-4 rounded-2xl text-center">
      <p className="text-xs text-slate-400 italic">Tidak ada file terlampir</p>
    </div>
  )}
</div>

        {/* Section Input Catatan Guru */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <MessageSquare size={16} className="text-indigo-500" />
            Berikan Catatan / Feedback
          </div>
          <textarea 
            className="w-full min-h-[100px] border-2 border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50 transition-all resize-none"
            placeholder="Tulis masukan untuk siswa di sini..."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
        </div>
      </div>

      {/* Modal Footer */}
<div className="px-8 py-6 bg-slate-50/50 flex justify-between items-center">
  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
    Status Saat Ini: <span className={`font-bold ${
      selectedJurnal?.status_verifikasi === 'disetujui' ? 'text-emerald-500' : 
      selectedJurnal?.status_verifikasi === 'ditolak' ? 'text-rose-500' : 'text-amber-500'
    }`}>
      {selectedJurnal?.status_verifikasi}
    </span>
  </div>
  
  <div className="flex gap-3">
    {/* Jika status masih PENDING, tampilkan tombol aksi lengkap */}
    {selectedJurnal?.status_verifikasi === 'pending' ? (
      <>
        <Button 
          onClick={() => setModalOpen(false)}
          variant="ghost" 
          className="rounded-xl px-6 font-bold text-slate-500"
        >
          Batal
        </Button>
        <Button 
          onClick={() => handleVerifikasi('ditolak')}
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6 font-bold gap-2 shadow-lg shadow-rose-100"
        >
          <XCircle size={16} /> Tolak
        </Button>
        <Button 
          onClick={() => handleVerifikasi('diterima')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 font-bold gap-2 shadow-lg shadow-emerald-100"
        >
          <CheckCircle size={16} /> Setujui
        </Button>
      </>
    ) : (
      /* Jika status sudah DISETUJUI atau DITOLAK, hanya tampilkan tombol Tutup */
      <Button 
        onClick={() => setModalOpen(false)}
        variant="outline" 
        className="rounded-xl px-10 font-bold border-slate-200 text-slate-600 hover:bg-slate-100"
      >
        Tutup
      </Button>
    )}
  </div>
</div>
    </div>
  </div>
)}
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

function JurnalTableRow({ data, onView }: any) {
  const statusConfig: any = {
    diterima: "bg-emerald-50 text-emerald-500 border-emerald-100",
    pending: "bg-amber-50 text-amber-500 border-amber-100",
    ditolak: "bg-rose-50 text-rose-500 border-rose-100",
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-8 py-5">
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{data.name}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">{data.date}</p>
        </div>
      </td>
      <td className="px-8 py-5">
        <p className="text-[11px] text-slate-500 leading-relaxed italic line-clamp-1">{data.kegiatan}</p>
      </td>
      <td className="px-8 py-5 text-center">
        <span className={`text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider border ${statusConfig[data.status]}`}>
          {data.status}
        </span>
      </td>
      <td className="px-8 py-5">
        <p className="text-[11px] text-slate-400 italic line-clamp-1">{data.feedback}</p>
      </td>
      <td className="px-8 py-5 text-center">
        <button onClick={onView} className="p-2.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-2xl transition-all shadow-sm border border-transparent hover:border-cyan-100">
          <Eye size={18} />
        </button>
      </td>
    </tr>
  )
}