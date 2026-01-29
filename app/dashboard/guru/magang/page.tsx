"use client"

import React from "react"
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
  CheckCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManajemenMagangGuru() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen Siswa Magang</h1>
          <p className="text-slate-500 mt-1">Pantau progres dan penempatan magang siswa bimbingan</p>
        </div>
        <Button className="bg-[#00A9C1] hover:bg-cyan-600 rounded-xl gap-2 shadow-lg shadow-cyan-100 py-6 px-6 text-sm font-bold">
          <Plus size={20} /> Tambah Penempatan
        </Button>
      </div>

      {/* STATS GRID - 4 Kolom sesuai gambar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value="6" sub="Siswa terdaftar" icon={<GraduationCap className="text-cyan-500" />} />
        <StatCard title="Aktif" value="3" sub="Sedang magang" icon={<UserCheck className="text-emerald-500" />} />
        <StatCard title="Selesai" value="2" sub="Magang selesai" icon={<CheckCircle className="text-blue-500" />} />
        <StatCard title="Pending" value="1" sub="Menunggu penempatan" icon={<Clock className="text-amber-500" />} />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
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
            <Button variant="outline" className="rounded-xl gap-2 text-slate-500 border-slate-200">
              <Filter size={16} /> Tampilkan Filter
            </Button>
          </div>
        </div>

        {/* Table Content */}
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
                name="Ahmad Rizki" nis="2024001" kelas="XII RPL 1" jurusan="Rekayasa Perangkat Lunak"
                guru="Pak Suryanto" nip="198501012010011001"
                dudi="PT Kreatif Teknologi" location="Jakarta" pic="Andi Wijaya"
                periode="1 Feb 2024 s.d 1 Mei 2024" duration="90 hari"
                status="aktif"
              />
              <MagangTableRow 
                name="Siti Nurhaliza" nis="2024002" kelas="XII RPL 1" jurusan="Rekayasa Perangkat Lunak"
                guru="Bu Kartika" nip="198702022012012002"
                dudi="CV Digital Solusi" location="Surabaya" pic="Sari Dewi"
                periode="15 Jan 2024 s.d 15 Apr 2024" duration="91 hari"
                status="selesai" score="87"
              />
              <MagangTableRow 
                name="Budi Santoso" nis="2024003" kelas="XII RPL 2" jurusan="Rekayasa Perangkat Lunak"
                guru="Pak Hendra" nip="198203032009011003"
                dudi="PT Inovasi Mandiri" location="Surabaya" pic="Budi Santoso"
                periode="1 Mar 2024 s.d 1 Jun 2024" duration="92 hari"
                status="pending"
              />
            </tbody>
          </table>
        </div>
      </div>
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

function MagangTableRow({ name, nis, kelas, jurusan, guru, nip, dudi, location, pic, periode, duration, status, score = "-" }: any) {
  const statusConfig: any = {
    aktif: "bg-emerald-50 text-emerald-500",
    selesai: "bg-blue-50 text-blue-500",
    pending: "bg-amber-50 text-amber-500",
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{name}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">NIS: {nis}</p>
          <p className="text-[10px] text-slate-400 font-medium">{kelas}</p>
          <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-tighter mt-1">{jurusan}</p>
        </div>
      </td>
      <td className="px-8 py-5">
        <div>
          <p className="text-[11px] font-bold text-slate-700 leading-tight">{guru}</p>
          <p className="text-[9px] text-slate-400 mt-1">NIP: {nip}</p>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
            <Building2 size={12} className="text-cyan-500" /> {dudi}
          </div>
          <p className="text-[10px] text-slate-400 pl-4">{location}</p>
          <p className="text-[10px] text-slate-400 pl-4 italic">{pic}</p>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
            <Calendar size={12} className="text-cyan-500" /> {periode}
          </div>
          <p className="text-[10px] text-slate-400 pl-4">{duration}</p>
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider ${statusConfig[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-8 py-5 text-center">
        <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg font-bold text-xs ${score !== "-" ? 'bg-lime-400 text-white' : 'bg-slate-50 text-slate-300'}`}>
          {score}
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <div className="flex justify-center gap-2">
          <button className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-xl transition-all border border-transparent hover:border-cyan-100">
            <Edit size={16} />
          </button>
          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}