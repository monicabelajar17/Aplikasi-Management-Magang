// magang-modal.tsx
import React from "react";
import { X, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagangModalProps } from "./types";

export function MagangModal({
  isOpen,
  type,
  selectedData,
  formData,
  siswaList,
  dudiList,
  currentUser,
  onClose,
  onFormChange,
  onSubmit
}: MagangModalProps) {
  if (!isOpen) return null;

  const handleInputChange = (field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onFormChange(field, e.target.value);
    };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`bg-white shadow-2xl overflow-hidden ${type === 'hapus' ? 'rounded-2xl max-w-md' : 'rounded-[2.5rem] w-full max-w-2xl'}`}>
        <div className="p-8 pb-4 flex justify-between items-start">
          <h3 className="text-xl font-extrabold text-[#0A2659]">
            {type === "tambah" ? "Tambah Penempatan" : type === "edit" ? "Edit Data" : "Hapus Data"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8 pt-4 space-y-5">
          {type !== "hapus" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Siswa</label>
                  {type === "tambah" ? (
                    <select 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      value={formData.siswa_id}
                      onChange={handleInputChange('siswa_id')}
                      required
                    >
                      <option value="">Pilih Siswa</option>
                      {siswaList.map((s) => (
                        <option key={s.id} value={s.id}>{s.nama}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2.5 bg-slate-100 rounded-xl text-sm font-bold">
                      {selectedData?.siswa?.nama}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Guru Pembimbing</label>
                  <div className="flex items-center gap-2 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 font-semibold cursor-not-allowed">
                    <UserCheck size={16} className="text-cyan-600" />
                    {currentUser?.nama || "Memuat..."}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Tempat Magang (DUDI)</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  value={formData.dudi_id}
                  onChange={handleInputChange('dudi_id')}
                  required
                >
                  <option value="">Pilih DUDI</option>
                  {dudiList.map((d) => (
                    <option key={d.id} value={d.id}>{d.nama_perusahaan}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Tanggal Mulai</label>
                  <Input 
                    type="date" 
                    value={formData.tanggal_mulai}
                    onChange={handleInputChange('tanggal_mulai')}
                    className="rounded-xl bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Tanggal Selesai</label>
                  <Input 
                    type="date" 
                    value={formData.tanggal_selesai}
                    onChange={handleInputChange('tanggal_selesai')}
                    className="rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Status</label>
                  <select 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                    value={formData.status}
                    onChange={handleInputChange('status')}
                  >
                    <option value="pending">Pending</option>
                    <option value="berlangsung">Berlangsung</option>
                    <option value="diterima">Diterima</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Nilai Akhir</label>
                  <Input 
                    type="number" 
                    disabled={formData.status !== "selesai"}
                    value={formData.nilai}
                    onChange={handleInputChange('nilai')}
                    placeholder="0-100"
                    className="rounded-xl"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-4 text-center">
              <AlertCircle size={48} className="text-red-500 mb-2" />
              <p className="text-slate-700">
                Hapus data magang <b>{selectedData?.siswa?.nama}</b>?
              </p>
              <p className="text-sm text-slate-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <Button 
              type="submit" 
              className="bg-[#00A9C1] hover:bg-cyan-600 px-8 text-white rounded-xl"
              variant={type === "hapus" ? "destructive" : "default"}
            >
              {type === "hapus" ? "Ya, Hapus" : "Simpan Data"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}