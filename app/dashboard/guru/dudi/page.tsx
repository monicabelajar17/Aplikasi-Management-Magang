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

  // Ambil data dari tabel DUDI
  const fetchDudi = async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from('dudi')
    .select(`
      *,
      magang:magang_dudi_id_fkey (
        id
      )
    `)
    .eq('is_deleted', false)          // 🔥 FILTER DUDI AKTIF
    .eq('magang.status', 'aktif');    // 🔥 FILTER MAGANG AKTIF

  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

  const formattedData = data.map((item) => ({
    ...item,
    siswa_count: item.magang?.length || 0
  }));

  setDudiList(formattedData);
  setLoading(false);
};

  useEffect(() => {
    fetchDudi();
  }, []);

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