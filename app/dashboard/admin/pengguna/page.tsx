"use client"

import React from "react"
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  Filter,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManajemenUserPage() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen User</h1>
          <p className="text-slate-500 mt-1">Kelola data akun Admin, Guru, dan Siswa dalam sistem</p>
        </div>
        <Button className="bg-[#00A9C1] hover:bg-cyan-600 rounded-xl gap-2 shadow-lg shadow-cyan-100 py-6 px-6">
          <Plus size={20} /> Tambah User
        </Button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#0A2659]">
            <Users className="text-cyan-500" size={20} />
            Daftar User
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari nama, email, atau role..." 
                className="pl-9 border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" 
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl gap-2 text-slate-500 border-slate-200">
                <Filter size={16} /> Semua Role
              </Button>
              <div className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">
                Tampilkan: 
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none ml-1">
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                </select>
                <span className="ml-1 text-[10px]">entri</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Email & Verifikasi</th>
                <th className="px-8 py-4 text-center">Role</th>
                <th className="px-8 py-4">Terdaftar</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <UserTableRow 
                name="Admin Sistem" 
                id="ID: 1"
                email="admin@gmail.com"
                role="admin"
                date="1 Jan 2024"
                initial="A"
                color="bg-cyan-500"
              />
              <UserTableRow 
                name="Pak Suryanto" 
                id="ID: 2"
                email="suryanto@teacher.com"
                role="guru"
                date="2 Jan 2024"
                initial="P"
                color="bg-emerald-500"
              />
              <UserTableRow 
                name="Bu Kartika" 
                id="ID: 3"
                email="kartika@teacher.com"
                role="guru"
                date="3 Jan 2024"
                initial="B"
                color="bg-indigo-500"
              />
              <UserTableRow 
                name="Ahmad Rizki" 
                id="ID: 4"
                email="ahmad.rizki@email.com"
                role="siswa"
                date="4 Jan 2024"
                initial="A"
                color="bg-sky-500"
              />
              <UserTableRow 
                name="Siti Nurhaliza" 
                id="ID: 5"
                email="siti.nur@email.com"
                role="siswa"
                date="5 Jan 2024"
                initial="S"
                color="bg-rose-500"
              />
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400 font-medium">
          <p>Menampilkan 1 sampai 5 dari 6 entri</p>
          <div className="flex gap-1 items-center">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">‹</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-cyan-500 text-white font-bold shadow-sm shadow-cyan-100">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">›</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- TABLE ROW COMPONENT ---

function UserTableRow({ name, id, email, role, date, initial, color }: any) {
  // Config Badge Role sesuai Desain
  const roleStyles: any = {
    admin: "bg-purple-100 text-purple-600",
    guru: "bg-blue-100 text-blue-600",
    siswa: "bg-cyan-100 text-cyan-600"
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 ${color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
            {initial}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{name}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{id}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Mail size={12} className="text-slate-300" /> {email}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
            <CheckCircle2 size={10} /> Verified
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex justify-center">
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider ${roleStyles[role]}`}>
            • {role}
          </span>
        </div>
      </td>
      <td className="px-8 py-5">
        <p className="text-xs font-semibold text-slate-600">{date}</p>
      </td>
      <td className="px-8 py-5">
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