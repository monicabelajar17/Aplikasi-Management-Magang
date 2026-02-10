import React from "react"
import { Building2, MapPin, User, Phone, Mail, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Dudi {
  id: number
  nama_perusahaan: string
  bidang_dudi: string
  alamat: string
  telepon: string
  email: string
  penanggung_jawab: string
  kuota_magang: number
  deskripsi: string
}

interface DudiModalProps {
  dudi: Dudi
  isApplied: boolean
  totalDaftar: number
  onClose: () => void
  onDaftar: () => void
}

export default function DudiModal({
  dudi,
  isApplied,
  totalDaftar,
  onClose,
  onDaftar
}: DudiModalProps) {
  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start gap-3">
      <div className="text-slate-300 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 border border-cyan-100">
              <Building2 size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#0A2659]">{dudi.nama_perusahaan}</h3>
              <p className="text-sm font-bold text-cyan-600">{dudi.bidang_dudi}</p>
            </div>
          </div>
          {isApplied && (
            <span className="bg-[#FEFCE8] text-[#A16207] text-[10px] font-bold px-3 py-1.5 rounded-full border border-yellow-100">
              Menunggu Verifikasi
            </span>
          )}
        </div>

        <div className="p-8 space-y-8">
          {/* Deskripsi */}
          <section>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              Tentang Perusahaan
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">{dudi.deskripsi}</p>
          </section>

          {/* Info Kontak */}
          <section>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              Informasi Kontak
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={<MapPin size={16} />} label="Alamat" value={dudi.alamat} />
              <InfoItem icon={<Phone size={16} />} label="Telepon" value={dudi.telepon} />
              <InfoItem icon={<Mail size={16} />} label="Email" value={dudi.email} />
              <InfoItem icon={<User size={16} />} label="Penanggung Jawab" value={dudi.penanggung_jawab} />
            </div>
          </section>

          {/* Info Magang */}
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Informasi Magang
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Bidang Usaha</span>
                <span className="font-bold text-slate-700">{dudi.bidang_dudi}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Kuota Magang</span>
                <span className="font-bold text-slate-700">{dudi.kuota_magang} Siswa</span>
              </div>
            </div>
          </section>

          {/* Footer Modal */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              onClick={onClose}
              variant="ghost"
              className="rounded-xl font-bold text-slate-400"
            >
              Tutup
            </Button>
            {isApplied ? (
              <Button disabled className="rounded-xl bg-slate-100 text-slate-400 font-bold px-8">
                Sudah Mendaftar
              </Button>
            ) : (
              <Button
                onClick={onDaftar}
                disabled={isApplied || totalDaftar >= 3}
                className={`rounded-xl px-8 font-bold ${
                  totalDaftar >= 3
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-[#00A9C1] hover:bg-cyan-600 text-white"
                }`}
              >
                {totalDaftar >= 3 ? "Batas Tercapai" : "Daftar"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}