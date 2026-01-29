"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, BookOpen, GraduationCap, Users, Settings, User, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client" // Pastikan path ini benar
import { useRouter } from "next/navigation"

// 1. Tambahkan Interface untuk data Profile
interface DashboardLayoutProps {
  children: React.ReactNode
  profile?: {
    full_name: string
    role: 'admin' | 'guru' | 'siswa'
  }
}

export default function DashboardLayout({ children, profile }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // 2. Logika Penentu Role (Utamakan dari database, fallback ke URL)
  const userRole = profile?.role || (pathname.includes("/admin") ? "admin" : pathname.includes("/guru") ? "guru" : "siswa")
  
  const isAdmin = userRole === "admin"
  const isGuru = userRole === "guru"
  const isSiswa = userRole === "siswa"

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-[#F0F5FF]">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#0A2659] p-2 rounded-lg">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-[#0A2659]">SIMMAS</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Panel {userRole}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {/* Menu Dashboard Utama - Link dinamis sesuai role */}
          <NavItem 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            sub="Ringkasan aktivitas" 
            active={pathname === `/dashboard/${userRole}`} 
            href={`/dashboard/${userRole}`}
          />

          {/* Menu DUDI - Muncul untuk semua tapi link beda */}
          <NavItem 
            icon={<Building2 size={20}/>} 
            label="DUDI" 
            sub={isSiswa ? "Dunia Usaha & Industri" : "Manajemen DUDI"} 
            active={pathname.includes("/dudi")} 
            href={`/dashboard/${userRole}/dudi`}
          />

          {/* Menu Khusus Siswa */}
          {isSiswa && (
            <>
              <NavItem icon={<BookOpen size={20}/>} label="Jurnal Harian" sub="Catatan harian" active={pathname.includes("/jurnal")} href="/dashboard/siswa/jurnal" />
              <NavItem icon={<GraduationCap size={20}/>} label="Magang" sub="Data magang saya" active={pathname.includes("/magang")} href="/dashboard/siswa/magang" />
            </>
          )}

          {/* Menu Khusus Guru */}
          {isGuru && (
            <>
              <NavItem icon={<GraduationCap size={20}/>} label="Bimbingan" sub="Data siswa magang" active={pathname.includes("/magang")} href="/dashboard/guru/magang" />
              <NavItem icon={<BookOpen size={20}/>} label="Monitoring" sub="Cek jurnal siswa" active={pathname.includes("/jurnal")} href="/dashboard/guru/jurnal" />
            </>
          )}

          {/* Menu Khusus Admin */}
          {isAdmin && (
            <>
              <NavItem icon={<Users size={20}/>} label="Pengguna" sub="Manajemen user" active={pathname.includes("/pengguna")} href="/dashboard/admin/pengguna" />
              <NavItem icon={<Settings size={20}/>} label="Pengaturan" sub="Konfigurasi sistem" active={pathname.includes("/pengaturan")} href="/dashboard/admin/pengaturan" />
            </>
          )}
        </nav>

        {/* Tombol Logout */}
        <div className="px-4 mb-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 p-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span className="text-xs font-bold">Keluar Aplikasi</span>
            </button>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-slate-600 truncate">SMK Brantas Karangkates</p>
              <p className="text-[9px] text-slate-400">Sistem Pelaporan v1.0</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div>
            <h2 className="font-bold text-slate-800 text-sm md:text-base">SMK Brantas Karangkates</h2>
            <p className="text-[10px] text-slate-500">Sistem Manajemen Magang Siswa</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                {/* Nama dinamis dari profile database */}
                <p className="text-xs font-bold text-[#0A2659]">{profile?.full_name || "Memuat..."}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{userRole}</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-sm font-bold">
                {profile?.full_name?.charAt(0) || <User size={20} />}
             </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

function NavItem({ icon, label, sub, active = false, href = "#" }: any) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
        active 
        ? 'bg-[#00A9C1] text-white shadow-lg shadow-cyan-100' 
        : 'text-slate-500 hover:bg-slate-50'
      }`}>
        <div className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</div>
        <div>
          <p className="text-xs font-bold leading-none">{label}</p>
          <p className={`text-[9px] mt-1 ${active ? 'text-cyan-50' : 'text-slate-400'}`}>{sub}</p>
        </div>
      </div>
    </Link>
  )
}