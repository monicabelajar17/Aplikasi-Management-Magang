"use client"

import React, { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import { 
  GraduationCap, Plus, Search, Building2, Calendar, 
  Edit, Trash2, UserCheck, Clock, CheckCircle, X, AlertCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { Toaster, toast } from "sonner"

export default function ManajemenMagangGuru() {
  const supabase = createClient()
  const [siswaList, setSiswaList] = useState<any[]>([])
const [dudiList, setDudiList] = useState<any[]>([])
  // --- STATE DATA ---
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [magangData, setMagangData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // --- STATE MODAL & FORM ---
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"tambah" | "edit" | "hapus">("tambah")
  const [selectedData, setSelectedData] = useState<any>(null)
  const [formData, setFormData] = useState({
    siswa_id: "",
    dudi_id: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    status: "pending",
    nilai: ""
  })

  // --- 1. AMBIL DATA USER & FILTER TABEL ---
useEffect(() => {
  const getInitialData = async () => {
    const guruIdFromCookie = Cookies.get("guru_id")
    const fullNameFromCookie = Cookies.get("full_name")

    console.log("COOKIE guru_id:", guruIdFromCookie)

    if (guruIdFromCookie) {
      const guruIdNumber = Number(guruIdFromCookie)

      setCurrentUser({
        id: guruIdNumber,
        nama: fullNameFromCookie
      })

      fetchMagangData(guruIdNumber)
      fetchDropdownData()
    } else {
      console.error("Guru ID tidak ditemukan")
      setLoading(false)
    }
  }

  getInitialData()
}, [])


// Fungsi untuk ambil data dropdown (Siswa & DUDI)
async function fetchDropdownData() {
  const { data: siswa } = await supabase.from('siswa').select('id, nama');
  const { data: dudi } = await supabase.from('dudi').select('id, nama_perusahaan');
  setSiswaList(siswa || []);
  setDudiList(dudi || []);
}

  async function fetchMagangData(guruId: number) {
  setLoading(true)

  // Pastikan guruId benar-benar angka
  const targetId = Number(guruId)

  const { data, error } = await supabase
    .from("magang")
    .select(`
      id, 
      status, 
      tanggal_mulai, 
      tanggal_selesai, 
      nilai_akhir,
      siswa ( id, nama, nis, kelas ), 
      dudi ( id, nama_perusahaan )
    `)
    .eq("guru_id", targetId) // Filter berdasarkan ID Guru

  if (error) {
    console.error("Kesalahan Fetch:", error.message)
  } else {
    console.log("Data dari DB:", data) // Cek di console apakah array ini ada isinya
    setMagangData(data || [])
  }
  setLoading(false)
}

  // --- 2. FUNGSI MODAL ---
  const openModal = (type: "tambah" | "edit" | "hapus", data: any = null) => {
    setModalType(type)
    setSelectedData(data)
    if (type === "edit" && data) {
      setFormData({
        siswa_id: data.siswa?.id || "",
        dudi_id: data.dudi?.id || "",
        tanggal_mulai: data.tanggal_mulai || "",
        tanggal_selesai: data.tanggal_selesai || "",
        status: data.status || "pending",
        nilai: data.nilai || ""
      })
    } else {
      setFormData({ siswa_id: "", dudi_id: "", tanggal_mulai: "", tanggal_selesai: "", status: "pending", nilai: "" })
    }
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  const currentGuruId = currentUser?.id;
  if (!currentGuruId) return toast.error("Sesi berakhir, silakan login ulang");

  const payload = {
    siswa_id: Number(formData.siswa_id),
    dudi_id: Number(formData.dudi_id),
    guru_id: Number(currentGuruId),
    tanggal_mulai: formData.tanggal_mulai || null,
    tanggal_selesai: formData.tanggal_selesai || null,
    status: formData.status,
    nilai_akhir: formData.nilai ? Number(formData.nilai) : null 
  };

  try {
    if (modalType === "tambah") {
      const { error } = await supabase.from('magang').insert([payload]);
      if (error) throw error;
      toast.success("Berhasil!", { description: "Penempatan magang baru telah ditambahkan." });
    } 
    else if (modalType === "edit") {
      const { error } = await supabase.from('magang').update(payload).eq('id', selectedData.id);
      if (error) throw error;
      toast.success("Berhasil diperbarui!", { description: "Data magang siswa telah diupdate." });
    }
    else if (modalType === "hapus") {
      const { error } = await supabase.from('magang').delete().eq('id', selectedData.id);
      if (error) throw error;
      toast.success("Berhasil dihapus!", { description: "Data magang telah dihapus dari sistem." });
    }

    setModalOpen(false);
    fetchMagangData(currentGuruId);
  } catch (err: any) {
    console.error("Detail Error:", err);
    toast.error("Terjadi Kesalahan", { description: err.message });
  }
};

  // Filter Search
  const filteredData = magangData.filter(m => 
    m.siswa?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.dudi?.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 relative">
      <Toaster position="top-right" expand={false} richColors />
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen Siswa Magang</h1>
          <p className="text-slate-500 mt-1">Halo, <b>{currentUser?.nama || "Guru"}</b>. Pantau progres bimbingan Anda.</p>
        </div>
        <Button 
          onClick={() => openModal("tambah")}
          className="bg-[#00A9C1] hover:bg-cyan-600 rounded-xl gap-2 shadow-lg py-6 px-6 text-sm font-bold"
        >
          <Plus size={20} /> Tambah Penempatan
        </Button>
      </div>

      {/* STATS GRID (Dinamis dari Data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bimbingan" value={magangData.length} sub="Siswa Anda" icon={<GraduationCap className="text-cyan-500" />} />
        <StatCard title="Berlangsung" value={magangData.filter(m => m.status === 'berlangsung').length} sub="Sedang magang" icon={<UserCheck className="text-emerald-500" />} />
        <StatCard title="Selesai" value={magangData.filter(m => m.status === 'selesai').length} sub="Magang selesai" icon={<CheckCircle className="text-blue-500" />} />
        <StatCard title="Pending" value={magangData.filter(m => m.status === 'pending').length} sub="Menunggu" icon={<Clock className="text-amber-500" />} />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-[#0A2659]">
            <GraduationCap className="text-cyan-500" size={20} /> Daftar Siswa Bimbingan
          </div>
          <Input 
            placeholder="Cari bimbingan..." 
            className="max-w-xs rounded-xl" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase font-bold">
              <tr>
                <th className="px-8 py-4">Siswa</th>
                <th className="px-8 py-4">DUDI</th>
                <th className="px-8 py-4">Periode</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-center">Nilai</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((m) => (
                <MagangTableRow 
                  key={m.id}
                  data={{
                    name: m.siswa?.nama,
                    nis: m.siswa?.nis,
                    dudi: m.dudi?.nama_perusahaan,
                    status: m.status,
                    score: m.nilai_akhir,
                    mulai: m.tanggal_mulai,
                    selesai: m.tanggal_selesai
                  }}
                  onEdit={() => openModal("edit", m)}
                  onDelete={() => openModal("hapus", m)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL SYSTEM --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`bg-white shadow-2xl overflow-hidden ${modalType === 'hapus' ? 'rounded-2xl max-w-md' : 'rounded-[2.5rem] w-full max-w-2xl'}`}>
            
            <div className="p-8 pb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-extrabold text-[#0A2659]">
                  {modalType === "tambah" ? "Tambah Penempatan" : modalType === "edit" ? "Edit Data" : "Hapus Data"}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="p-8 pt-4 space-y-6">
              {modalType !== "hapus" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Siswa</label>
                      {modalType === "tambah" ? (
                        <select 
  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
  value={formData.siswa_id}
  onChange={(e) => setFormData({...formData, siswa_id: e.target.value})}
>
  <option value="">Pilih Siswa</option>
  {siswaList.map((s) => (
    <option key={s.id} value={s.id}>{s.nama}</option>
  ))}
</select>
                      ) : (
                        <div className="p-2.5 bg-slate-100 rounded-xl text-sm font-bold">{selectedData?.siswa?.nama}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase">Guru Pembimbing</label>
                      <div className="flex items-center gap-2 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 font-semibold cursor-not-allowed">
                        <UserCheck size={16} className="text-cyan-600" />
                        {currentUser?.nama || "Memuat..."}
                        <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-md ml-auto">Otomatis</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Tempat Magang (DUDI)</label>
                    <select 
  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
  value={formData.dudi_id}
  onChange={(e) => setFormData({...formData, dudi_id: e.target.value})}
>
  <option value="">Pilih DUDI</option>
  {dudiList.map((d) => (
    <option key={d.id} value={d.id}>{d.nama_perusahaan}</option>
  ))}
</select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                      <select 
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-sm"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="pending">Pending</option>
                        <option value="berlangsung">Berlangsung</option>
                        <option value="selesai">Selesai</option>
                        <option value="diterima">Diterima</option>
                        <option value="ditolak">Ditolak</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Nilai Akhir</label>
                      <Input 
                        type="number" 
                        disabled={formData.status !== "selesai"}
                        value={formData.nilai}
                        onChange={(e) => setFormData({...formData, nilai: e.target.value})}
                        placeholder="0-100"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <AlertCircle size={48} className="text-red-500 mb-2" />
                  <p>Hapus data magang <b>{selectedData?.siswa?.nama}</b>?</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
                <Button type="submit" className="bg-[#00A9C1] hover:bg-cyan-600 px-8 text-white">
                  {modalType === "hapus" ? "Ya, Hapus" : "Simpan"}
                </Button>
              </div>
            </form>
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
        <p className="text-slate-500 text-[11px] font-bold uppercase">{title}</p>
        <h2 className="text-3xl font-extrabold text-[#0A2659] my-1">{value}</h2>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">{icon}</div>
    </div>
  )
}

function MagangTableRow({ data, onEdit, onDelete }: any) {
  const statusConfig: any = {
    berlangsung: "bg-emerald-50 text-emerald-500",
    selesai: "bg-blue-50 text-blue-500",
    pending: "bg-amber-50 text-amber-500",
    diterima: "bg-amber-50 text-amber-500",
    ditolak: "bg-amber-50 text-amber-500",
    dibatalkan: "bg-amber-50 text-amber-500",
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
        <p className="text-sm font-bold text-slate-800 leading-tight">{data.name}</p>
        <p className="text-[10px] text-slate-400 font-medium">NIS: {data.nis}</p>
      </td>
      <td className="px-8 py-5 text-[11px] font-bold text-slate-700">
        <div className="flex items-center gap-1.5"><Building2 size={12} className="text-cyan-500" /> {data.dudi}</div>
      </td>
      <td className="px-8 py-5 text-[10px] font-medium text-slate-600">
        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-cyan-500" /> {data.mulai} - {data.selesai}</div>
      </td>
      <td className="px-8 py-5 text-center">
        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase ${statusConfig[data.status]}`}>{data.status}</span>
      </td>
      <td className="px-8 py-5 text-center">
        <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg font-bold text-xs ${data.score ? 'bg-lime-400 text-white' : 'bg-slate-50 text-slate-300'}`}>{data.score || "-"}</div>
      </td>
      <td className="px-8 py-5 text-center">
        <div className="flex justify-center gap-2">
          <button onClick={onEdit} className="p-2 text-slate-400 hover:text-cyan-500 rounded-xl"><Edit size={16} /></button>
          <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-500 rounded-xl"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  )
}