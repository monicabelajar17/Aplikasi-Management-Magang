"use client"

import React, { useState } from "react"
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Building2, 
  Calendar, 
  Filter, 
  Edit, 
  Trash2, 
  UserCheck, 
  Clock, 
  CheckCircle,
  X,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManajemenMagangGuru() {
  // --- STATE UNTUK MODAL ---
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"tambah" | "edit" | "hapus">("tambah")
  const [selectedData, setSelectedData] = useState<any>(null)

  const openModal = (type: "tambah" | "edit" | "hapus", data: any = null) => {
    setModalType(type)
    setSelectedData(data)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8 relative">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen Siswa Magang</h1>
          <p className="text-slate-500 mt-1">Pantau progres dan penempatan magang siswa bimbingan</p>
        </div>
        <Button 
          onClick={() => openModal("tambah")}
          className="bg-[#00A9C1] hover:bg-cyan-600 rounded-xl gap-2 shadow-lg shadow-cyan-100 py-6 px-6 text-sm font-bold"
        >
          <Plus size={20} /> Tambah Penempatan
        </Button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value="6" sub="Siswa terdaftar" icon={<GraduationCap className="text-cyan-500" />} />
        <StatCard title="Aktif" value="3" sub="Sedang magang" icon={<UserCheck className="text-emerald-500" />} />
        <StatCard title="Selesai" value="2" sub="Magang selesai" icon={<CheckCircle className="text-blue-500" />} />
        <StatCard title="Pending" value="1" sub="Menunggu penempatan" icon={<Clock className="text-amber-500" />} />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#0A2659]">
            <GraduationCap className="text-cyan-500" size={20} />
            Daftar Siswa Magang
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Cari siswa, guru, atau DUDI..." className="pl-9 border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-4">Siswa</th>
                <th className="px-8 py-4">Guru Pembimbing</th>
                <th className="px-8 py-4">DUDI</th>
                <th className="px-8 py-4">Periode</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-center">Nilai</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <MagangTableRow 
                data={{ name: "Ahmad Rizki", nis: "2024001", guru: "Pak Suryanto", dudi: "PT Kreatif Teknologi", status: "aktif" }}
                onEdit={() => openModal("edit", { name: "Ahmad Rizki", status: "aktif" })}
                onDelete={() => openModal("hapus")}
              />
              <MagangTableRow 
                data={{ name: "Siti Nurhaliza", nis: "2024002", guru: "Bu Kartika", dudi: "CV Digital Solusi", status: "selesai", score: "87" }}
                onEdit={() => openModal("edit", { name: "Siti Nurhaliza", status: "selesai" })}
                onDelete={() => openModal("hapus")}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL SYSTEM --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden ${modalType === 'hapus' ? 'rounded-2xl max-w-md' : 'rounded-[2.5rem] w-full max-w-2xl'}`}>
            
            {/* Modal Header */}
            <div className="p-8 pb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-extrabold text-[#0A2659]">
                  {modalType === "tambah" && "Tambah Data Siswa Magang"}
                  {modalType === "edit" && "Edit Data Siswa Magang"}
                  {modalType === "hapus" && "Hapus Penempatan"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {modalType === "tambah" && "Masukkan informasi data magang siswa baru"}
                  {modalType === "edit" && "Perbarui informasi data magang siswa"}
                  {modalType === "hapus" && "Apakah Anda yakin ingin menghapus data ini?"}
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 pt-4 space-y-6">
              {modalType !== "hapus" ? (
                <>
                  {/* Bagian Siswa & Pembimbing (Hanya Muncul di Tambah sesuai gambar) */}
                  {modalType === "tambah" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600">Siswa</label>
                          <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Pilih Siswa</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600">Guru Pembimbing</label>
                          <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Pilih Guru Pembimbing</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600">Tempat Magang</label>
                        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500">
                          <option>Pilih DUDI</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Periode & Status (Ada di Tambah & Edit) */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Periode & Status</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Tanggal Mulai</label>
                        <Input type="date" className="rounded-xl border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Tanggal Selesai</label>
                        <Input type="date" className="rounded-xl border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                        <select className="w-full p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none">
                          <option>Pending</option>
                          <option>Aktif</option>
                          <option>Selesai</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Penilaian (Hanya di Edit sesuai gambar) */}
                  {modalType === "edit" && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Penilaian</h4>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600">Nilai Akhir</label>
                        <Input 
                          placeholder="Hanya bisa diisi jika status selesai" 
                          disabled={selectedData?.status !== "selesai"}
                          className="rounded-xl bg-slate-50 border-slate-200 italic text-sm"
                        />
                        <p className="text-[10px] text-slate-400 italic">Nilai hanya dapat diisi setelah status magang selesai</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} />
                  </div>
                  <p className="text-sm text-slate-600">Data yang dihapus tidak dapat dikembalikan. Lanjutkan?</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl font-bold text-slate-400 hover:bg-slate-50"
                >
                  Batal
                </Button>
                <Button 
                  className={`rounded-xl px-8 font-bold text-white shadow-lg ${modalType === 'hapus' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-[#00A9C1] hover:bg-cyan-600 shadow-cyan-100'}`}
                  onClick={() => setModalOpen(false)}
                >
                  {modalType === "tambah" && "Simpan"}
                  {modalType === "edit" && "Update"}
                  {modalType === "hapus" && "Ya, Hapus"}
                </Button>
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

function MagangTableRow({ data, onEdit, onDelete }: any) {
  const statusConfig: any = {
    aktif: "bg-emerald-50 text-emerald-500",
    selesai: "bg-blue-50 text-blue-500",
    pending: "bg-amber-50 text-amber-500",
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{data.name}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">NIS: {data.nis || "2024xxx"}</p>
        </div>
      </td>
      <td className="px-8 py-5">
        <p className="text-[11px] font-bold text-slate-700">{data.guru}</p>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
          <Building2 size={12} className="text-cyan-500" /> {data.dudi}
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
          <Calendar size={12} className="text-cyan-500" /> 1 Feb - 1 Mei
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider ${statusConfig[data.status]}`}>
          {data.status}
        </span>
      </td>
      <td className="px-8 py-5 text-center">
        <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg font-bold text-xs ${data.score ? 'bg-lime-400 text-white' : 'bg-slate-50 text-slate-300'}`}>
          {data.score || "-"}
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <div className="flex justify-center gap-2">
          <button onClick={onEdit} className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-xl transition-all border border-transparent hover:border-cyan-100">
            <Edit size={16} />
          </button>
          <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}