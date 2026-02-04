"use client"

import React, { useEffect, useState } from "react"
import { 
  Building2, 
  Search, 
  Mail, 
  Phone, 
  Users, 
  TrendingUp,
  Loader2 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client" // Pastikan path ini sesuai

export default function DudiGuruPage() {
  const supabase = createClient();
  const [dudiList, setDudiList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [guruId, setGuruId] = useState<number | null>(null)
  // Ambil data dari tabel DUDI
// Ambil data dari tabel DUDI berdasarkan relasi di tabel magang
  const fetchDudi = async () => {
    if (!guruId) return
    setLoading(true)

    // Logika: Kita ambil data dari tabel MAGANG yang guru_id nya cocok
    // Lalu kita tarik data DUDI (perusahaan) yang terkait
    const { data, error } = await supabase
      .from("magang")
      .select(`
        id,
        status,
        guru_id,
        dudi (
          id,
          nama_perusahaan,
          alamat,
          email,
          telepon,
          penanggung_jawab
        )
      `)
      .eq("guru_id", guruId) // Filter berdasarkan guru yang membimbing
      .eq("status", "aktif") // Hanya yang status magangnya aktif

    if (error) {
      console.error("Error fetching data:", error.message)
      setLoading(false)
      return
    }

    // Karena satu DUDI bisa punya banyak siswa, kita kelompokkan berdasarkan DUDI ID
    // agar di tabel tidak muncul nama perusahaan yang sama berulang kali
    const groupedDudi = data.reduce((acc: any[], current: any) => {
      const dudiData = current.dudi;
      if (!dudiData) return acc;

      const existingDudi = acc.find(item => item.id === dudiData.id);

      if (existingDudi) {
        existingDudi.siswa_count += 1;
      } else {
        acc.push({
          ...dudiData,
          siswa_count: 1
        });
      }
      return acc;
    }, []);

    setDudiList(groupedDudi)
    setLoading(false)
  }

useEffect(() => {
  const id = Number(getCookie("guru_id"))
  if (id) {
    setGuruId(id)
  }
}, [])

  useEffect(() => {
  if (guruId) {
    fetchDudi()
  }
}, [guruId])


  // Filter data berdasarkan input pencarian
  const filteredDudi = dudiList.filter((dudi) =>
    dudi.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dudi.penanggung_jawab && dudi.penanggung_jawab.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (dudi.alamat && dudi.alamat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Hitung statistik sederhana
  const totalDudi = dudiList.length;
  const totalSiswaAktif = dudiList.reduce((acc, curr) => acc + curr.siswa_count, 0);
  const rataRata = dudiList.length > 0 ? (totalSiswaAktif / dudiList.length).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen DUDI</h1>
        <p className="text-slate-500 mt-1">Daftar Dunia Usaha & Industri mitra aktif</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total DUDI" 
          value={totalDudi.toString()} 
          sub="Perusahaan mitra aktif" 
          icon={<Building2 className="text-cyan-500" />} 
        />
        <StatCard 
  title="Total Siswa Magang" 
  value={totalSiswaAktif.toString()} 
  sub="Siswa aktif di semua mitra" 
  icon={<Users className="text-blue-500" />} 
/>
<StatCard 
  title="Rata-rata Siswa" 
  value={rataRata} 
  sub="Per perusahaan" 
  icon={<TrendingUp className="text-emerald-500" />} 
/>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-cyan-500" size={20} />
            <h3 className="font-bold text-[#0A2659]">Daftar DUDI</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari perusahaan, alamat..." 
                className="pl-9 w-[350px] border-slate-200 rounded-xl focus-visible:ring-cyan-500 text-sm" 
              />
            </div>
          </div>
        </div>

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
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-300" />
                    <p className="text-xs text-slate-400 mt-2">Memuat data...</p>
                  </td>
                </tr>
              ) : filteredDudi.length > 0 ? (
                filteredDudi.map((dudi) => (
                  <TableRow 
                    key={dudi.id}
                    company={dudi.nama_perusahaan} 
                    address={dudi.alamat}
                    email={dudi.email}
                    phone={dudi.telepon}
                    pic={dudi.penanggung_jawab}
                    count={dudi.siswa_count}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400 text-sm">
                    Data DUDI tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// --- Komponen Lokal ---
function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
  return match ? match.split("=")[1] : null
}

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
  const safePic = pic || "Belum Ada";
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-cyan-50/50 border border-cyan-100 flex items-center justify-center rounded-xl text-cyan-600">
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{company}</p>
            <p className="text-[10px] text-slate-400 mt-1">{address || "Alamat belum tersedia"}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Mail size={12} className="text-cyan-500" /> {email || "-"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Phone size={12} className="text-cyan-500" /> {phone || "-"}
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-[#E6EFFF] rounded-full flex items-center justify-center text-[10px] font-bold text-[#0A2659] border border-blue-100">
            {safePic.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm font-semibold text-slate-700">{safePic}</p>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          {/* Kotak Hijau yang kamu maksud */}
          <div className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-lime-400 text-white text-[11px] font-bold shadow-sm">
            {count}
          </div>
          <span className="text-[10px] text-slate-400 font-medium text-xs">Siswa</span>
        </div>
      </td>
    </tr>
  )
}