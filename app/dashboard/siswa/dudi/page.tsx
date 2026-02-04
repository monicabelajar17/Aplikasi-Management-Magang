"use client"

import React, { useState } from "react"
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

export default function DudiSiswaPage() {
  // --- STATE UTAMA ---
  const [selectedDudi, setSelectedDudi] = useState<any>(null); // State untuk Modal
  const [showToast, setShowToast] = useState(false); // State untuk Notifikasi Hijau
  
  // State untuk melacak DUDI mana saja yang sudah didaftar (Simulasi Database)
  const [appliedIds, setAppliedIds] = useState<number[]>([1]); // Default ID 1 sudah daftar

  const dudiData = [
    { id: 1, company: "PT Kreatif Teknologi", category: "Teknologi Informasi", address: "Jl. Merdeka No. 123, Jakarta", phone: "021-12345678", email: "info@kreatiftek.com", pic: "Andi Wijaya", quota: 8, maxQuota: 12, description: "Perusahaan teknologi yang bergerak dalam pengembangan aplikasi web dan mobile. Memberikan kesempatan magang terbaik untuk siswa SMK jurusan IT." },
    { id: 2, company: "CV Digital Solusi", category: "Digital Marketing", address: "Jl. Sudirman No. 45, Surabaya", phone: "031-87654321", email: "contact@digitalsolusi.com", pic: "Sari Dewi", quota: 5, maxQuota: 8, description: "Konsultan digital marketing yang membantu UMKM berkembang di era digital. Menyediakan program magang untuk jurusan multimedia dan pemasaran." },
    { id: 3, company: "PT Inovasi Mandiri", category: "Software Development", address: "Jl. Diponegoro No. 78, Surabaya", phone: "031-11223344", email: "hrd@inovasi.com", pic: "Budi Santoso", quota: 12, maxQuota: 15, description: "Perusahaan software house yang mengembangkan sistem informasi untuk berbagai industri. Menawarkan pengalaman magang yang komprehensif." },
  ];

  const handleDaftar = (id: number) => {
    setAppliedIds([...appliedIds, id]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000); // Hilang setelah 4 detik
  };

const [searchTerm, setSearchTerm] = useState("");

const filteredDudi = dudiData.filter((dudi) =>
  dudi.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
  dudi.category.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="space-y-8 relative">
      
      {/* 3. NOTIFIKASI BERHASIL (Gambar 2) */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-full duration-300">
          <div className="bg-[#84CC16] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-lime-400">
            <CheckCircle size={20} />
            <p className="text-sm font-medium">Pendaftaran magang berhasil dikirim! Menunggu verifikasi dari perusahaan.</p>
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
      {...dudi}
      isApplied={appliedIds.includes(dudi.id)}
      onDetail={() => setSelectedDudi(dudi)}
      onDaftar={() => handleDaftar(dudi.id)}
    />
  ))}
</div>

      {/* 1 & 2. MODAL DETAIL (Gambar 3) */}
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
                  <h3 className="text-2xl font-black text-[#0A2659]">{selectedDudi.company}</h3>
                  <p className="text-sm font-bold text-cyan-600">{selectedDudi.category}</p>
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
                <p className="text-sm text-slate-600 leading-relaxed">{selectedDudi.description}</p>
              </section>

              {/* Info Kontak */}
              <section>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Informasi Kontak</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem icon={<MapPin size={16}/>} label="Alamat" value={selectedDudi.address} />
                  <InfoItem icon={<Phone size={16}/>} label="Telepon" value={selectedDudi.phone} />
                  <InfoItem icon={<Mail size={16}/>} label="Email" value={selectedDudi.email} />
                  <InfoItem icon={<User size={16}/>} label="Penanggung Jawab" value={selectedDudi.pic} />
                </div>
              </section>

              {/* Info Magang */}
              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Magang</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Bidang Usaha</span><span className="font-bold text-slate-700">{selectedDudi.category}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Kuota Magang</span><span className="font-bold text-slate-700">{selectedDudi.quota}/{selectedDudi.maxQuota}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Slot Tersisa</span><span className="font-bold text-cyan-600">{selectedDudi.maxQuota - selectedDudi.quota} slot</span></div>
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

function DudiCard({ company, category, address, pic, quota, maxQuota, description, isApplied, onDetail, onDaftar }: any) {
  const remaining = maxQuota - quota;
  const progress = (quota / maxQuota) * 100;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
      <div className="flex justify-between items-start mb-6">
        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-cyan-600 group-hover:bg-[#00A9C1] group-hover:text-white transition-all">
          <Building2 size={28} />
        </div>
        {isApplied && (
          <span className="bg-lime-100 text-lime-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Menunggu</span>
        )}
      </div>

      <h3 className="text-lg font-black text-slate-800 mb-1">{company}</h3>
      <p className="text-xs font-bold text-cyan-500 mb-4">{category}</p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-[11px] text-slate-400"><MapPin size={14}/> {address}</div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400"><User size={14}/> PIC: {pic}</div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase">Kuota</p>
          <p className="text-[10px] font-black text-slate-800">{quota}/{maxQuota}</p>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-cyan-600 font-bold mt-2">{remaining} slot tersisa</p>
      </div>

      <div className="flex gap-2">
        <Button onClick={onDetail} variant="outline" className="flex-1 rounded-2xl text-xs font-bold border-slate-200 text-slate-500">Detail</Button>
        {isApplied ? (
          <Button disabled className="flex-1 rounded-2xl text-xs font-bold bg-slate-100 text-slate-400">Sudah Mendaftar</Button>
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
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  )
}