"use client"

import React, { useState } from "react"
import { 
  Building2, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Users 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ManajemenDudiPage() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen DUDI</h1>
        <p className="text-slate-500 mt-1">Kelola data mitra Dunia Usaha dan Dunia Industri</p>
      </div>

      {/* STATS GRID - 4 Kolom sesuai gambar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total DUDI" value="6" sub="Perusahaan mitra" icon={<Building2 className="text-cyan-500" />} />
        <StatCard title="DUDI Aktif" value="4" sub="Perusahaan aktif" icon={<CheckCircle2 className="text-emerald-500" />} />
        <StatCard title="DUDI Tidak Aktif" value="2" sub="Perusahaan tidak aktif" icon={<XCircle className="text-red-500" />} />
        <StatCard title="Total Siswa Magang" value="55" sub="Siswa magang aktif" icon={<Users className="text-blue-500" />} />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar Tabel */}
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-cyan-500" size={20} />
            <h3 className="font-bold text-[#0A2659]">Daftar DUDI</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Cari perusahaan..." className="pl-9 w-[250px] border-slate-200 rounded-xl focus-visible:ring-cyan-500" />
            </div>
            {/* GANTI TOMBOL LAMA DENGAN INI */}
<Dialog>
  <DialogTrigger asChild>
    <Button className="bg-cyan-500 hover:bg-cyan-600 rounded-xl gap-2 shadow-lg shadow-cyan-100">
      <Plus size={18} /> Tambah DUDI
    </Button>
  </DialogTrigger>
  
  {/* Modal Pop-up dengan background blur otomatis */}
  <DialogContent className="sm:max-w-[425px] rounded-3xl bg-white p-0 overflow-hidden border-none">
    <div className="p-8 space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-[#0A2659]">Tambah DUDI Baru</DialogTitle>
        <p className="text-xs text-slate-500">Lengkapi semua informasi yang diperlukan</p>
      </DialogHeader>

      <div className="space-y-4">
        {/* Input Nama Perusahaan */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-700">Nama Perusahaan <span className="text-red-500">*</span></Label>
          <Input placeholder="Masukkan nama perusahaan" className="rounded-xl border-slate-200 py-6" />
        </div>

        {/* Input Alamat */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-700">Alamat <span className="text-red-500">*</span></Label>
          <Textarea placeholder="Masukkan alamat lengkap" className="rounded-xl border-slate-200 min-h-[100px]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Input Telepon */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">Telepon <span className="text-red-500">*</span></Label>
            <Input placeholder="Contoh: 021-12345678" className="rounded-xl border-slate-200 py-6" />
          </div>
          {/* Input Email */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">Email <span className="text-red-500">*</span></Label>
            <Input placeholder="Contoh: info@perusahaan.com" className="rounded-xl border-slate-200 py-6" />
          </div>
        </div>

        {/* Input Penanggung Jawab */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-700">Penanggung Jawab <span className="text-red-500">*</span></Label>
          <Input placeholder="Nama penanggung jawab" className="rounded-xl border-slate-200 py-6" />
        </div>

        {/* Input Status - Gunakan Select Sesuai Gambar */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-700">Status <span className="text-red-500">*</span></Label>
          <select className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <option>Aktif</option>
            <option>Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <Button variant="outline" className="rounded-xl py-6 font-bold text-slate-500">Batal</Button>
        <Button className="bg-[#0A2659] hover:bg-slate-800 text-white rounded-xl py-6 font-bold">Simpan</Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
          </div>
        </div>

        {/* Real Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Perusahaan</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Penanggung Jawab</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Siswa Magang</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow 
                company="PT Kreatif Teknologi" 
                address="Jl. Merdeka No. 123, Jakarta"
                email="info@kreatiftek.com"
                phone="021-12345678"
                pic="Andi Wijaya"
                status="Aktif"
                count={8}
              />
              <TableRow 
                company="CV Digital Solusi" 
                address="Jl. Sudirman No. 45, Surabaya"
                email="contact@digitalsolusi.com"
                phone="031-87654321"
                pic="Sari Dewi"
                status="Aktif"
                count={5}
              />
              <TableRow 
                company="PT Inovasi Mandiri" 
                address="Jl. Diponegoro No. 78, Surabaya"
                email="hr@inovasimandiri.co.id"
                phone="031-5553456"
                pic="Budi Santoso"
                status="Tidak Aktif"
                count={12}
              />
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-50 flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <p>Menampilkan 1 sampai 3 dari 6 entri</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">‹</button>
            <button className="px-3 py-1 rounded bg-cyan-500 text-white shadow-md shadow-cyan-100">1</button>
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">›</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-4 right-4 bg-slate-50 p-2 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <h2 className="text-3xl font-extrabold text-[#0A2659] my-2">{value}</h2>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
  )
}

function TableRow({ company, address, email, phone, pic, status, count }: any) {
  const isAktif = status === "Aktif"
  
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-cyan-100 flex items-center justify-center rounded-xl text-cyan-600">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">{company}</p>
            <p className="text-[10px] text-slate-400 mt-1">{address}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Mail size={12} className="text-slate-300" /> {email}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Phone size={12} className="text-slate-300" /> {phone}
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">
            {pic.charAt(0)}
          </div>
          <p className="text-sm font-semibold text-slate-700">{pic}</p>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
          isAktif ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
        }`}>
          {status.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(count/15)*100}%` }} />
          </div>
          <span className="bg-lime-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">{count} Siswa</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex justify-center gap-2">
          <button className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all">
            <Edit size={16} />
          </button>
          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}