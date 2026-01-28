"use client"

import React from "react"
import { 
  Building2, 
  Search, 
  MapPin, 
  User, 
  Info, 
  Send, 
  CheckCircle 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DudiSiswaPage() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Cari Tempat Magang</h1>
          <p className="text-slate-500 mt-1">Temukan mitra industri yang sesuai dengan bidang keahlianmu</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Cari perusahaan atau bidang keahlian..." 
            className="pl-10 border-slate-200 rounded-xl focus-visible:ring-cyan-500" 
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium whitespace-nowrap">
          Tampilkan: 
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-600 focus:outline-none">
            <option>6 per halaman</option>
            <option>12 per halaman</option>
          </select>
        </div>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DudiCard 
          company="PT Kreatif Teknologi"
          category="Teknologi Informasi"
          address="Jl. Merdeka No. 123, Jakarta"
          pic="Andi Wijaya"
          quota={8}
          maxQuota={12}
          description="Perusahaan teknologi yang bergerak dalam pengembangan aplikasi web dan mobile..."
          isApplied={true}
        />
        <DudiCard 
          company="CV Digital Solusi"
          category="Digital Marketing"
          address="Jl. Sudirman No. 45, Surabaya"
          pic="Sari Dewi"
          quota={5}
          maxQuota={8}
          description="Konsultan digital marketing yang membantu UMKM berkembang di era digital..."
        />
        <DudiCard 
          company="PT Inovasi Mandiri"
          category="Software Development"
          address="Jl. Diponegoro No. 78, Surabaya"
          pic="Budi Santoso"
          quota={12}
          maxQuota={15}
          description="Perusahaan software house yang mengembangkan sistem informasi untuk berbagai industri..."
        />
        <DudiCard 
          company="PT Teknologi Maju"
          category="Hardware & Networking"
          address="Jl. HR Rasuna Said No. 12, Jakarta"
          pic="Lisa Permata"
          quota={6}
          maxQuota={10}
          description="Spesialis dalam instalasi dan maintenance hardware komputer serta jaringan..."
        />
      </div>

      {/* PAGINATION FOOTER */}
      <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-slate-100 text-sm text-slate-400">
        <p>Menampilkan 1 sampai 6 dari 8 perusahaan</p>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">‹</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500 text-white font-bold">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">›</button>
        </div>
      </div>
    </div>
  )
}

// --- KOMPONEN KARTU DUDI ---

function DudiCard({ company, category, address, pic, quota, maxQuota, description, isApplied = false }: any) {
  const remaining = maxQuota - quota
  const progress = (quota / maxQuota) * 100

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
      {/* Header Kartu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 border border-cyan-100 group-hover:bg-[#00A9C1] group-hover:text-white transition-colors">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">{company}</h3>
            <p className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded inline-block mt-1">
              {category}
            </p>
          </div>
        </div>
      </div>

      {/* Info Alamat & PIC */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <MapPin size={14} className="text-slate-300" /> {address}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <User size={14} className="text-slate-300" /> PIC: {pic}
        </div>
      </div>

      {/* Progress Kuota */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1.5">
          <p className="text-[11px] font-bold text-slate-600">Kuota Magang</p>
          <p className="text-[11px] font-bold text-slate-400">{quota}/{maxQuota}</p>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <p className="text-[10px] text-cyan-600 font-bold mt-1.5">{remaining} slot tersisa</p>
      </div>

      {/* Deskripsi Singkat */}
      <p className="text-[11px] text-slate-500 leading-relaxed mb-6 flex-1 line-clamp-3">
        {description}
      </p>

      {/* Tombol Aksi */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 rounded-xl text-[11px] font-bold gap-2 border-slate-200 text-slate-600 hover:bg-slate-50">
          <Info size={14} /> Detail
        </Button>
        {isApplied ? (
          <Button disabled className="flex-1 rounded-xl text-[11px] font-bold gap-2 bg-slate-100 text-slate-400">
             Sudah Mendaftar
          </Button>
        ) : (
          <Button className="flex-1 rounded-xl text-[11px] font-bold gap-2 bg-[#00A9C1] hover:bg-cyan-600 text-white shadow-lg shadow-cyan-100">
            <Send size={14} /> Daftar
          </Button>
        )}
      </div>
    </div>
  )
}