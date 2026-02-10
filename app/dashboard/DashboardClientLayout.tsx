"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Building2, BookOpen, GraduationCap, Users, Settings, User, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  profile: {
    full_name: string
    role: 'admin' | 'guru' | 'siswa'
  }
  schoolName: string
}

export default function DashboardClientLayout({ children, profile, schoolName }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const userRole = profile.role
  const isAdmin = userRole === "admin"
  const isGuru = userRole === "guru"
  const isSiswa = userRole === "siswa"

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Hapus juga cookie jika diperlukan atau arahkan ke API logout
    router.push("/login")
    router.refresh()
  }
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F0F5FF]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#0A2659] p-2 rounded-lg">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-[#0A2659]">SIMMAS</h1>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
              Panel {userRole}
            </p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            sub="Ringkasan" 
            active={pathname === `/dashboard/${userRole}`} 
            href={`/dashboard/${userRole}`}
          />

          <NavItem 
            icon={<Building2 size={20}/>} 
            label="DUDI" 
            sub="Dunia Industri" 
            active={pathname.includes("/dudi")} 
            href={`/dashboard/${userRole}/dudi`}
          />

          {isSiswa && (
            <>
              <NavItem icon={<BookOpen size={20}/>} label="Jurnal" sub="Catatan harian" active={pathname.includes("/jurnal")} href="/dashboard/siswa/jurnal" />
              <NavItem icon={<GraduationCap size={20}/>} label="Magang" sub="Data magang" active={pathname.includes("/magang")} href="/dashboard/siswa/magang" />
            </>
          )}

          {isGuru && (
            <>
              <NavItem icon={<GraduationCap size={20}/>} label="Magang" sub="Siswa magang" active={pathname.includes("/magang")} href="/dashboard/guru/magang" />
              <NavItem icon={<BookOpen size={20}/>} label="Jurnal" sub="Cek jurnal" active={pathname.includes("/jurnal")} href="/dashboard/guru/jurnal" />
            </>
          )}

          {isAdmin && (
            <>
              <NavItem 
      icon={<GraduationCap size={20}/>} 
      label="Magang" 
      sub="Manajemen pendaftaran" 
      active={pathname.includes("/admin/magang")} 
      href="/dashboard/admin/magang" 
    />
              <NavItem icon={<Users size={20}/>} label="Pengguna" sub="Kelola user" active={pathname.includes("/pengguna")} href="/dashboard/admin/pengguna" />
              <NavItem icon={<Settings size={20}/>} label="Pengaturan" sub="Sistem" active={pathname.includes("/pengaturan")} href="/dashboard/admin/pengaturan" />
            </>
          )}
        </nav>
        <div className="p-4 mt-auto border-t border-slate-100">
          <button 
  onClick={() => setIsLogoutOpen(true)}
  className="flex items-center gap-4 p-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-all mb-4"
>
            <LogOut size={20} />
            <span className="text-xs font-bold">Keluar</span>
          </button>
          
          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <div className="overflow-hidden">
  {/* Menggunakan prop schoolName */}
  <p className="text-[10px] font-bold text-slate-600 truncate">{schoolName}</p>
  <p className="text-[9px] text-slate-400">v1.0</p>
</div>
          </div>
        </div>
      </aside>
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
    {/* Menggunakan prop schoolName */}
    <h2 className="font-bold text-slate-800 text-sm md:text-base">{schoolName}</h2>
    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Sistem Manajemen Magang</p>
  </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              {/* BAGIAN YANG ANDA TANYAKAN: Menampilkan nama dari profile */}
              <p className="text-xs font-bold text-[#0A2659] leading-none mb-1">
                {profile.full_name}
              </p>
              <p className="text-[9px] text-slate-400 uppercase font-medium">
                {userRole}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#0A2659] flex items-center justify-center text-white shadow-sm font-bold text-sm">
  {profile.full_name.charAt(0).toUpperCase()}
</div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
      {isLogoutOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl w-[90%] max-w-sm p-6 shadow-xl">
      <h2 className="text-sm font-bold text-slate-800">
        Konfirmasi Logout
      </h2>
      <p className="text-xs text-slate-500 mt-2">
        Apakah kamu yakin ingin keluar dari sistem?
      </p>
      <div className="flex gap-3 pt-6">
        <button
          className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold hover:bg-slate-50"
          onClick={() => setIsLogoutOpen(false)}
        >
          Batal
        </button>
        <button
          className="flex-1 rounded-xl bg-red-500 py-2 text-xs font-bold text-white hover:bg-red-600"
          onClick={handleLogout}
        >
          Ya, Logout
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

function NavItem({ icon, label, sub, active = false, href = "#" }: any) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
        active 
? 'bg-[#0A2659] text-white shadow-lg shadow-blue-100' 
: 'text-slate-500 hover:bg-slate-50'
      }`}>
        <div className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</div>
        <div>
          <p className="text-xs font-bold leading-none">{label}</p>
          <p className={`text-[9px] mt-1 ${active ? 'text-blue-100/80' : 'text-slate-400'}`}>{sub}</p>
        </div>
      </div>
    </Link>
  )
}