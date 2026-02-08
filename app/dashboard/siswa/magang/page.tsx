import React from "react"
import { 
  GraduationCap, 
  Building2, 
  Calendar, 
  MapPin, 
  Award, 
  User, 
  Briefcase 
} from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// 1. Definisikan interface agar TypeScript tidak bingung
interface MagangData {
  status: string;
  nilai_akhir: number | null;
  tanggal_mulai: string;
  tanggal_selesai: string;
  siswa: {
    nama: string;
    nis: string;
    kelas: string;
    jurusan: string;
  };
  dudi: {
    nama_perusahaan: string;
    alamat: string;
  };
}

export default async function StatusMagangSiswaPage() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const siswaId = cookieStore.get("siswa_id")?.value

  if (!siswaId) return <div>Sesi berakhir.</div>

  // 2. Tambahkan Type Assertion 'as unknown as MagangData'
  const { data, error } = await supabase
    .from("magang")
    .select(`
      status,
      nilai_akhir,
      tanggal_mulai,
      tanggal_selesai,
      siswa!inner ( nama, nis, kelas, jurusan ),
      dudi!inner ( nama_perusahaan, alamat )
    `)
    .eq("siswa_id", siswaId)
    .single();

  const magang = data as unknown as MagangData;

  if (error || !magang) {
    return <div className="p-10 text-center">Data magang tidak ditemukan.</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Status Magang Saya</h1>
        <p className="text-slate-500 mt-1">Informasi detail mengenai penempatan dan progres magang Anda</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-2 font-bold text-[#0A2659]">
          <GraduationCap className="text-cyan-500" size={20} />
          Data Magang
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
            
            {/* Informasi Siswa - Diambil dari relasi table siswa */}
            <InfoItem 
              label="Nama Siswa" 
              value={magang.siswa?.nama} 
              icon={<User size={16} />} 
            />
            <InfoItem 
              label="NIS" 
              value={magang.siswa?.nis} 
              icon={<Award size={16} />} 
            />
            <InfoItem 
              label="Kelas" 
              value={magang.siswa?.kelas} 
              icon={<Briefcase size={16} />} 
            />
            <InfoItem 
              label="Jurusan" 
              value={magang.siswa?.jurusan} 
              icon={<GraduationCap size={16} />} 
            />

            <div className="md:col-span-2 border-t border-slate-50 my-2" />

            {/* Informasi Perusahaan - Diambil dari relasi table dudi */}
            <InfoItem 
              label="Nama Perusahaan" 
              value={magang.dudi?.nama_perusahaan} 
              icon={<Building2 size={16} />} 
            />
            <InfoItem 
              label="Alamat Perusahaan" 
              value={magang.dudi?.alamat} 
              icon={<MapPin size={16} />} 
            />
            <InfoItem 
              label="Periode Magang" 
              value={`${magang.tanggal_mulai} s.d ${magang.tanggal_selesai}`} 
              icon={<Calendar size={16} />} 
            />
            
            {/* Status Dinamis */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
              <div className="flex items-center">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider border ${
                  magang.status === 'berlangsung' 
                  ? "bg-emerald-50 text-emerald-500 border-emerald-100" 
                  : "bg-blue-50 text-blue-500 border-blue-100"
                }`}>
                  {magang.status}
                </span>
              </div>
            </div>

            {/* Nilai Akhir Dinamis */}
            <div className="md:col-span-2 space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nilai Akhir</p>
              <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                <span className="text-lg font-black text-[#0A2659]">
                  {magang.nilai_akhir || "-"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value, icon }: any) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        {icon} {label}
      </p>
      <p className="text-sm font-bold text-slate-700">{value || "-"}</p>
    </div>
  )
}