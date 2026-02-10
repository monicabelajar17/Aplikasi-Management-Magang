import React from "react"
import { Building2, MapPin, User } from "lucide-react"
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

interface DudiCardProps {
  dudi: Dudi
  occupied: number
  isApplied: boolean
  totalDaftar: number
  onDetail: () => void
  onDaftar: () => void
}

export default function DudiCard({
  dudi,
  occupied,
  isApplied,
  totalDaftar,
  onDetail,
  onDaftar
}: DudiCardProps) {
  const remaining = dudi.kuota_magang - occupied
  const progressPercent = (occupied / dudi.kuota_magang) * 100

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
      <div className="flex justify-between items-start mb-6">
        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-cyan-600 group-hover:bg-[#00A9C1] group-hover:text-white transition-all">
          <Building2 size={28} />
        </div>
        {isApplied && (
          <span className="bg-lime-100 text-lime-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
            Pending
          </span>
        )}
      </div>

      <h3 className="text-lg font-black text-slate-800 mb-1">{dudi.nama_perusahaan}</h3>
      <div className="flex items-center gap-2 mb-4">
        <p className="text-xs font-bold text-cyan-500">{dudi.bidang_dudi}</p>
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${remaining > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {remaining > 0 ? `Sisa: ${remaining} Slot` : 'Kuota Penuh'}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
          <MapPin size={14} /> {dudi.alamat}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <User size={14} /> PIC: {dudi.penanggung_jawab}
        </div>
      </div>

      {/* Progress Bar Kuota */}
      <div className="bg-slate-50 p-4 rounded-2xl mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase">Kapasitas Terisi</p>
          <p className="text-[10px] font-black text-slate-800">{occupied} / {dudi.kuota_magang} Siswa</p>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${remaining === 0 ? 'bg-red-500' : 'bg-cyan-500'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <Button
          onClick={onDetail}
          variant="outline"
          className="flex-1 rounded-2xl text-xs font-bold border-slate-200 text-slate-500"
        >
          Detail
        </Button>
        {isApplied ? (
          <Button
            disabled
            className="flex-1 rounded-2xl text-xs font-bold bg-slate-100 text-slate-400"
          >
            Sudah Daftar
          </Button>
        ) : (
          <Button
            onClick={onDaftar}
            disabled={isApplied || totalDaftar >= 3}
            className={`flex-1 rounded-2xl text-xs font-bold ${
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
  )
}