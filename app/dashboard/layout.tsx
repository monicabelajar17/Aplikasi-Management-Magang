import React from "react"
import { LayoutDashboard, Building2, Users, Settings, GraduationCap, Bell, UserCircle } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F0F5FF]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#0A2659] p-2 rounded-lg">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-[#0A2659] leading-tight">SIMMAS</h1>
            <p className="text-xs text-slate-400">Panel Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" sub="Ringkasan sistem" active />
          <NavItem icon={<Building2 size={20}/>} label="DUDI" sub="Manajemen DUDI" />
          <NavItem icon={<Users size={20}/>} label="Pengguna" sub="Manajemen user" />
          <NavItem icon={<Settings size={20}/>} label="Pengaturan" sub="Konfigurasi sistem" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-medium text-slate-600">SMK Brantas Karangkates</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div>
            <h2 className="font-bold text-slate-800">SMK Brantas Karangkates</h2>
            <p className="text-xs text-slate-500">Sistem Manajemen Magang Siswa</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><Bell size={20}/></button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-[#0A2659]">Admin Sistem</p>
                <p className="text-[10px] text-slate-500">Admin</p>
              </div>
              <UserCircle className="h-10 w-10 text-slate-300" />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

// Komponen Kecil untuk Menu Sidebar agar rapi
function NavItem({ icon, label, sub, active = false }: { icon: any, label: string, sub: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#00A9C1] text-white shadow-lg shadow-cyan-100' : 'text-slate-500 hover:bg-slate-50'}`}>
      <div className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</div>
      <div>
        <p className="text-sm font-bold leading-none">{label}</p>
        <p className={`text-[10px] mt-1 ${active ? 'text-cyan-50' : 'text-slate-400'}`}>{sub}</p>
      </div>
    </div>
  )
}