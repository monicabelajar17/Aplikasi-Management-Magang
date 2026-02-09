"use client"

import React, { useState, useEffect } from "react"
import { 
  Building2, 
  Search, 
  MapPin, 
  User, 
  Info, 
  Send, 
  CheckCircle,
  X,
  Phone,
  Mail,
  Briefcase
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

interface Dudi {
  id: number;
  nama_perusahaan: string;
  bidang_dudi: string;
  alamat: string;
  telepon: string;
  email: string;
  penanggung_jawab: string;
  kuota_magang: number;
  deskripsi: string;
}

export default function DudiSiswaPage() {
  // --- STATE ---
  const [dudiList, setDudiList] = useState<Dudi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDudi, setSelectedDudi] = useState<Dudi | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedIds, setAppliedIds] = useState<number[]>([]);

  // Simulasi currentUserId (Biasanya dari session auth)
  const currentUserId = 123; 

  // 2. Ambil data dari Database
  useEffect(() => {
  const fetchInitialData = async () => {
    setLoading(true);
    
    // Ambil data DUDI
    const { data: dudiData } = await supabase.from('dudi').select('*');
    if (dudiData) setDudiList(dudiData);

    // Ambil siswa_id dari cookie
    const value = `; ${document.cookie}`;
    const parts = value.split(`; siswa_id=`);
    const siswaId = parts.length === 2 ? parts.pop()?.split(';').shift() : null;

    if (siswaId) {
      // Cari daftar perusahaan yang sudah didaftar oleh siswa ini
      const { data: magangRecords } = await supabase
        .from('magang')
        .select('dudi_id')
        .eq('siswa_id', parseInt(siswaId));
      
      if (magangRecords) {
        setAppliedIds(magangRecords.map(m => m.dudi_id));
      }
    }
    setLoading(false);
  };

  fetchInitialData();
}, []);

  // 3. Fungsi Daftar (Insert ke tabel magang dengan status pending)
  const supabase = createClient()

const handleDaftar = async (dudiId: number) => {
  setLoading(true);
  try {
    // 1. Ambil ID Siswa dari Cookie (Karena kamu pakai login manual)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const siswaIdStr = getCookie("siswa_id");
    
    if (!siswaIdStr) {
      alert("Sesi berakhir, silakan login kembali.");
      return;
    }

    const siswaId = parseInt(siswaIdStr);

    // 2. Cek apakah sudah pernah daftar di sini (Client-side check)
    if (appliedIds.includes(dudiId)) {
      alert("Kamu sudah mendaftar di perusahaan ini!");
      return;
    }

    // 3. Simpan ke database menggunakan Supabase Client
    // Kita langsung tembak ke tabel 'magang'
    const { error: insertError } = await supabase
      .from('magang')
      .insert([
        {
          siswa_id: siswaId,
          dudi_id: dudiId,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) throw insertError;

    // 4. Berhasil
    setAppliedIds(prev => [...prev, dudiId]);
    setShowToast(true);
    setSelectedDudi(null);
    setTimeout(() => setShowToast(false), 5000);

  } catch (error: any) {
    console.error("Error pendaftaran:", error.message);
    alert("Gagal mendaftar: " + error.message);
  } finally {
    setLoading(false);
  }
};
// Tambahkan state baru untuk menyimpan jumlah terisi
const [occupiedCounts, setOccupiedCounts] = useState<Record<number, number>>({});

useEffect(() => {
  const fetchInitialData = async () => {
    setLoading(true);
    
    // 1. Ambil data DUDI
    const { data: dudiData } = await supabase.from('dudi').select('*');
   if (dudiData) setDudiList(dudiData);

    // 2. Ambil jumlah siswa yang SUDAH diterima (status: 'aktif' atau 'selesai') per DUDI
    // Kita hitung dari tabel magang
    const { data: countData } = await supabase
  .from('magang')
  .select('dudi_id')
  // SESUAIKAN: ganti dengan status yang ada di database kamu
  .in('status', ['diterima', 'berlangsung']); 

if (countData) {
  const counts: Record<number, number> = {};
  countData.forEach(item => {
    counts[item.dudi_id] = (counts[item.dudi_id] || 0) + 1;
  });
  console.log("Jumlah Terisi per DUDI:", counts); // Cek di console untuk memastikan
  setOccupiedCounts(counts);
}
    // 3. Ambil riwayat pendaftaran siswa ini (untuk status tombol)
    const value = `; ${document.cookie}`;
    const parts = value.split(`; siswa_id=`);
    const siswaId = parts.length === 2 ? parts.pop()?.split(';').shift() : null;

    if (siswaId) {
      const { data: magangRecords } = await supabase
        .from('magang')
        .select('dudi_id')
        .eq('siswa_id', parseInt(siswaId));
      
      if (magangRecords) {
        setAppliedIds(magangRecords.map(m => m.dudi_id));
      }
    }
    setLoading(false);
  };

  fetchInitialData();
}, []);
  const filteredDudi = dudiList.filter((dudi) => {
  const nama = dudi.nama_perusahaan || ""
  const bidang = dudi.bidang_dudi || ""

  return (
    nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bidang.toLowerCase().includes(searchTerm.toLowerCase())
  )
})

  return (
    <div className="space-y-8 relative">
      
      {/* 3. NOTIFIKASI BERHASIL (Gambar 2) */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-full duration-300">
          <div className="bg-[#84CC16] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-lime-400">
            <CheckCircle size={20} />
            <p className="text-sm font-medium">Pendaftaran magang berhasil dikirim! Menunggu verifikasi dari guru.</p>
            <button onClick={() => setShowToast(false)} className="ml-4 hover:bg-white/20 p-1 rounded-full">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Cari Tempat Magang</h1>
        <p className="text-slate-500 mt-1">Temukan mitra industri yang sesuai dengan bidang keahlianmu</p>
      </div>
      
{/* FILTER & SEARCH */}
<div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
  <div className="relative flex-1"> {/* flex-1 membuat search bar memenuhi ruang yang ada */}
    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
    <Input 
      type="text"
      placeholder="Cari perusahaan, bidang..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 border-slate-200 rounded-xl focus-visible:ring-cyan-500 bg-slate-50/50" 
    />
  </div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredDudi.map((dudi) => (
  <DudiCard 
    key={dudi.id}
    dudi={dudi}
    occupied={occupiedCounts[dudi.id] || 0} // Kirim jumlah yang terisi
    isApplied={appliedIds.includes(dudi.id)}
    onDetail={() => setSelectedDudi(dudi)}
    onDaftar={() => handleDaftar(dudi.id)}
  />
))}
</div>

      {/* 1 & 2. MODAL DETAIL (Gambar 3) */}
      {/* 1 & 2. MODAL DETAIL */}
{selectedDudi && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
      
      {/* Modal Header */}
      <div className="p-8 pb-0 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 border border-cyan-100">
            <Building2 size={32} />
          </div>
          <div>
            {/* PERBAIKAN: Gunakan nama properti asli database */}
            <h3 className="text-2xl font-black text-[#0A2659]">{selectedDudi.nama_perusahaan}</h3>
            <p className="text-sm font-bold text-cyan-600">{selectedDudi.bidang_dudi}</p>
          </div>
        </div>
        {appliedIds.includes(selectedDudi.id) && (
          <span className="bg-[#FEFCE8] text-[#A16207] text-[10px] font-bold px-3 py-1.5 rounded-full border border-yellow-100">
            Menunggu Verifikasi
          </span>
        )}
      </div>

      <div className="p-8 space-y-8">
        {/* Deskripsi */}
        <section>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Tentang Perusahaan</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{selectedDudi.deskripsi}</p>
        </section>

        {/* Info Kontak */}
        <section>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Informasi Kontak</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={<MapPin size={16}/>} label="Alamat" value={selectedDudi.alamat} />
            <InfoItem icon={<Phone size={16}/>} label="Telepon" value={selectedDudi.telepon} />
            <InfoItem icon={<Mail size={16}/>} label="Email" value={selectedDudi.email} />
            <InfoItem icon={<User size={16}/>} label="Penanggung Jawab" value={selectedDudi.penanggung_jawab} />
          </div>
        </section>

        {/* Info Magang */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Magang</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Bidang Usaha</span>
              <span className="font-bold text-slate-700">{selectedDudi.bidang_dudi}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Kuota Magang</span>
              {/* PERBAIKAN: Gunakan kuota_magang */}
              <span className="font-bold text-slate-700">{selectedDudi.kuota_magang} Siswa</span>
            </div>
          </div>
        </section>

        {/* Footer Modal */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button onClick={() => setSelectedDudi(null)} variant="ghost" className="rounded-xl font-bold text-slate-400">Tutup</Button>
          {appliedIds.includes(selectedDudi.id) ? (
            <Button disabled className="rounded-xl bg-slate-100 text-slate-400 font-bold px-8">Sudah Mendaftar</Button>
          ) : (
            <Button onClick={() => { handleDaftar(selectedDudi.id); setSelectedDudi(null); }} className="rounded-xl bg-[#00A9C1] hover:bg-cyan-600 text-white font-bold px-8 gap-2">
              <Send size={16} /> Daftar Magang
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

// --- SUB-KOMPONEN ---

function DudiCard({ 
  dudi, 
  occupied, // tambahkan prop ini
  isApplied, 
  onDetail, 
  onDaftar 
}: { dudi: Dudi, occupied: number, isApplied: boolean, onDetail: () => void, onDaftar: () => void }) {
  
  const remaining = dudi.kuota_magang - occupied;
  const progressPercent = (occupied / dudi.kuota_magang) * 100;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
      <div className="flex justify-between items-start mb-6">
        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-cyan-600 group-hover:bg-[#00A9C1] group-hover:text-white transition-all">
          <Building2 size={28} />
        </div>
        {isApplied && (
          <span className="bg-lime-100 text-lime-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Pending</span>
        )}
      </div>

      {/* SESUAIKAN DENGAN DATABASE */}
      <h3 className="text-lg font-black text-slate-800 mb-1">{dudi.nama_perusahaan}</h3>
      <div className="flex items-center gap-2 mb-4">
        <p className="text-xs font-bold text-cyan-500">{dudi.bidang_dudi}</p>
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${remaining > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {remaining > 0 ? `Sisa: ${remaining} Slot` : 'Kuota Penuh'}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
          <MapPin size={14}/> {dudi.alamat}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <User size={14}/> PIC: {dudi.penanggung_jawab}
        </div>
      </div>

      {/* Progress Bar Kuota */}
      {/* Progress Bar Kuota Dinamis */}
      <div className="bg-slate-50 p-4 rounded-2xl mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase">Kapasitas Terisi</p>
          <p className="text-[10px] font-black text-slate-800">{occupied} / {dudi.kuota_magang} Siswa</p>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${remaining === 0 ? 'bg-red-500' : 'bg-cyan-500'}`} 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <Button onClick={onDetail} variant="outline" className="flex-1 rounded-2xl text-xs font-bold border-slate-200 text-slate-500">Detail</Button>
        {isApplied ? (
          <Button disabled className="flex-1 rounded-2xl text-xs font-bold bg-slate-100 text-slate-400">Sudah Daftar</Button>
        ) : (
          <Button onClick={onDaftar} className="flex-1 rounded-2xl text-xs font-bold bg-[#00A9C1] hover:bg-cyan-600 text-white">Daftar</Button>
        )}
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-slate-300 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  )
}