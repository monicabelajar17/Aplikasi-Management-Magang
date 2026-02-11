// magang-modal.tsx
import React from "react";
import { XCircle, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagangModalProps } from "./types";

export function MagangModal({
  isOpen,
  isEditMode,
  onClose,
  onSubmit,
  formData,
  dropdowns,
  onFormChange,
  loading = false
}: MagangModalProps) {
  if (!isOpen) return null;

  const handleChange = (field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onFormChange(field, e.target.value);
    };

  const selectedSiswa = dropdowns.siswa.find(s => String(s.id) === String(formData.siswa_id));
  const selectedDudi = dropdowns.dudi.find(d => String(d.id) === String(formData.dudi_id));

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#0A2659]">
              {isEditMode ? "Tugaskan Pembimbing" : "Tambah Data Siswa Magang"}
            </h2>
            <p className="text-sm text-slate-500">Masukkan informasi data magang siswa baru</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle /></button>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bagian Siswa - Disabled jika Edit */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa</label>
              {isEditMode ? (
                /* Tampilan Teks Statis saat Edit */
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="h-8 w-8 bg-[#0A2659] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {selectedSiswa?.nama?.charAt(0).toUpperCase() || "S"}
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    {selectedSiswa?.nama || "Nama Siswa"}
                  </p>
                </div>
              ) : (
                /* Dropdown saat Tambah */
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  value={formData.siswa_id}
                  onChange={handleChange('siswa_id')}
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
                onChange={handleChange('guru_id')}
                required
              >
                <option value="">Pilih Guru Pembimbing</option>
                {dropdowns.guru.map((g) => (
  <option key={g.id} value={g.id}>
    {g.nama|| "Nama tidak terbaca"}
  </option>
))}
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
                    {selectedDudi?.nama_perusahaan || "Perusahaan ditemukan"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium italic">Lokasi magang sudah terkunci</p>
                </div>
              </div>
            ) : (
              /* Dropdown saat Tambah */
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                value={formData.dudi_id}
                onChange={handleChange('dudi_id')}
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
                <Input 
                  type="date" 
                  value={formData.tanggal_mulai} 
                  onChange={handleChange('tanggal_mulai')} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Tanggal Selesai</label>
                <Input 
                  type="date" 
                  value={formData.tanggal_selesai} 
                  onChange={handleChange('tanggal_selesai')} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none"
                  value={formData.status}
                  onChange={handleChange('status')}
                >
                  <option value="pending">Pending</option>
                  <option value="diterima">Diterima</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-400">
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}