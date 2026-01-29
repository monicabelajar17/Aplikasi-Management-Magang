"use client"

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

export default function StatusMagangSiswaPage() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Status Magang Saya</h1>
        <p className="text-slate-500 mt-1">Informasi detail mengenai penempatan dan progres magang Anda</p>
      </div>

      {/* DATA MAGANG CARD */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-2 font-bold text-[#0A2659]">
          <GraduationCap className="text-cyan-500" size={20} />
          Data Magang
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
            
            {/* Informasi Siswa */}
            <InfoItem 
              label="Nama Siswa" 
              value="Ahmad Rizki" 
              icon={<User size={16} className="text-slate-400" />} 
            />
            <InfoItem 
              label="NIS" 
              value="2024001" 
              icon={<Award size={16} className="text-slate-400" />} 
            />
            <InfoItem 
              label="Kelas" 
              value="XII RPL 1" 
              icon={<Briefcase size={16} className="text-slate-400" />} 
            />
            <InfoItem 
              label="Jurusan" 
              value="Rekayasa Perangkat Lunak" 
              icon={<GraduationCap size={16} className="text-slate-400" />} 
            />

            {/* Garis Pemisah untuk Mobile */}
            <div className="md:col-span-2 border-t border-slate-50 my-2" />

            {/* Informasi Perusahaan */}
            <InfoItem 
              label="Nama Perusahaan" 
              value="PT Kreatif Teknologi" 
              icon={<Building2 size={16} className="text-slate-400" />} 
            />
            <InfoItem 
              label="Alamat Perusahaan" 
              value="Jakarta" 
              icon={<MapPin size={16} className="text-slate-400" />} 
            />
            <InfoItem 
              label="Periode Magang" 
              value="1 Feb 2024 s.d 1 Mei 2024" 
              icon={<Calendar size={16} className="text-slate-400" />} 
            />
            
            {/* Status & Nilai */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
              <div className="flex items-center">
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider bg-emerald-50 text-emerald-500 border border-emerald-100">
                  Aktif
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nilai Akhir</p>
              <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                <span className="text-lg font-black text-[#0A2659]">88</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENT ---

function InfoItem({ label, value, icon }: any) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  )
}