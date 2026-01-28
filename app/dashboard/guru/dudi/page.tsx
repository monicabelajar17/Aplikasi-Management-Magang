"use client"

import React from "react"
import { 
  Building2, 
  Search, 
  Mail, 
  Phone, 
  Users, 
  TrendingUp 
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DudiGuruPage() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen DUDI</h1>
        <p className="text-slate-500 mt-1">Daftar Dunia Usaha & Industri mitra aktif</p>
      </div>

      {/* STATS GRID - 3 Kolom sesuai desain Guru */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total DUDI" 
          value="6" 
          sub="Perusahaan mitra aktif" 
          icon={<Building2 className="text-cyan-500" />} 
        />
        <StatCard 
          title="Total Siswa Magang" 
          value="55" 
          sub="Siswa sedang aktif magang" 
          icon={<Users className="text-blue-500" />} 
        />
        <StatCard 
          title="Rata-rata Siswa" 
          value="9" 
          sub="Per perusahaan" 
          icon={<TrendingUp className="text-emerald-500" />} 
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-cyan-500" size={20} />
            <h3 className="font-bold text-[#0A2659]">Daftar DUDI</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari perusahaan, alamat, penanggung jawab..." 
                className="pl-9 w-[350px] border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" 
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              Tampilkan: 
              <select className="bg-slate-50 border border-slate-200 rounded-md px-1 py-1 text-slate-600 focus:outline-none">
                <option>10</option>
                <option>25</option>
              </select>
              per halaman
            </div>
          </div>
        </div>

        {/* Tabel untuk Guru - Tanpa Kolom Aksi & Status */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Perusahaan</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Penanggung Jawab</th>
                <th className="px-6 py-4">Siswa Magang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow 
                company="PT Kreatif Teknologi" 
                address="Jl. Merdeka No. 123, Jakarta"
                email="info@kreatiftek.com"
                phone="021-12345678"
                pic="Andi Wijaya"
                count={8}
              />
              <TableRow 
                company="CV Digital Solusi" 
                address="Jl. Sudirman No. 45, Surabaya"
                email="contact@digitalsolusi.com"
                phone="031-87654321"
                pic="Sari Dewi"
                count={5}
              />
              <TableRow 
                company="PT Inovasi Mandiri" 
                address="Jl. Diponegoro No. 78, Surabaya"
                email="hr@inovasimandiri.co.id"
                phone="031-5553456"
                pic="Budi Santoso"
                count={12}
              />
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-6 border-t border-slate-50 flex justify-between items-center text-[12px] text-slate-400 font-medium">
          <p>Menampilkan 1 sampai 5 dari 6 entri</p>
          <div className="flex gap-1 items-center">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">«</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">‹</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-cyan-500 text-white shadow-md shadow-cyan-100 font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">›</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">»</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Komponen Lokal ---

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-extrabold text-[#0A2659] my-1">{value}</h2>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        {icon}
      </div>
    </div>
  )
}

function TableRow({ company, address, email, phone, pic, count }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-cyan-50/50 border border-cyan-100 flex items-center justify-center rounded-xl text-cyan-600">
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{company}</p>
            <p className="text-[10px] text-slate-400 mt-1">{address}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Mail size={12} className="text-cyan-500" /> {email}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Phone size={12} className="text-cyan-500" /> {phone}
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-[#E6EFFF] rounded-full flex items-center justify-center text-[10px] font-bold text-[#0A2659] border border-blue-100">
            {pic.charAt(0)}
          </div>
          <p className="text-sm font-semibold text-slate-700">{pic}</p>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-lime-400 text-white text-[11px] font-bold shadow-sm">
          {count}
        </div>
      </td>
    </tr>
  )
}