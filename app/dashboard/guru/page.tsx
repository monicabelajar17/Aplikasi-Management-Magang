import { Users, Building, GraduationCap, BookOpen, ClipboardList } from "lucide-react"

export default function GuruDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Dashboard Guru</h1>
        <p className="text-slate-500 mt-1">Ringkasan aktivitas pemantauan magang siswa</p>
      </div>

      {/* STATS GRID - Sama dengan Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value="150" sub="Seluruh siswa terdaftar" icon={<Users className="text-cyan-500" />} />
        <StatCard title="DUDI Partner" value="45" sub="Perusahaan mitra" icon={<Building className="text-blue-500" />} />
        <StatCard title="Siswa Magang" value="120" sub="Sedang aktif magang" icon={<GraduationCap className="text-indigo-500" />} />
        <StatCard title="Logbook Hari Ini" value="85" sub="Laporan masuk hari ini" icon={<BookOpen className="text-emerald-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Bagian Magang Terbaru - Label diganti 'AM' sesuai gambar */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="text-cyan-500" size={20} />
              <h3 className="font-bold text-[#0A2659]">Magang Terbaru</h3>
            </div>
            <div className="space-y-4">
              <ListMember name="Ahmad Rizki" company="PT. Teknologi Nusantara" date="15/1/2024 - 15/4/2024" badge="AM" />
              <ListMember name="Siti Nurhaliza" company="CV. Digital Kreatif" date="20/1/2024 - 20/4/2024" badge="AM" />
            </div>
          </section>

          {/* Bagian Logbook - Sesuai gambar kedua */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="text-emerald-500" size={20} />
              <h3 className="font-bold text-[#0A2659]">Logbook Terbaru</h3>
            </div>
            <div className="space-y-4">
              <LogbookItem 
                title="Mempelajari sistem database dan melakukan backup data harian" 
                date="21/1/2024" 
                status="Disetujui" 
                statusColor="bg-emerald-100 text-emerald-600"
                kendala="Tidak ada kendala berarti"
              />
              <LogbookItem 
                title="Membuat design mockup untuk website perusahaan" 
                date="21/1/2024" 
                status="Pending" 
                statusColor="bg-amber-100 text-amber-600"
                kendala="Software design masih belum familiar"
              />
            </div>
          </section>
        </div>

        {/* List DUDI Aktif di Sisi Kanan */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Building className="text-orange-500" size={20} />
            <h3 className="font-bold text-[#0A2659]">DUDI Aktif</h3>
          </div>
          <div className="space-y-4">
             {/* Data sesuai list di gambar */}
            <DudiItem name="PT. Teknologi Nusantara" count={8} />
            <DudiItem name="CV. Digital Kreatif" count={5} />
            <DudiItem name="PT. Inovasi Mandiri" count={12} />
            <DudiItem name="PT. Solusi Informatika" count={7} />
          </div>
        </section>
      </div>
    </div>
  )
}

// --- Komponen Pendukung ---
// (Tips: Di dunia nyata, komponen ini sebaiknya ditaruh di folder /components agar bisa dipakai Admin & Guru sekaligus)

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <div className="bg-slate-50 p-2 rounded-lg">{icon}</div>
      </div>
      <h2 className="text-3xl font-extrabold text-[#0A2659] mb-1">{value}</h2>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
  )
}

function ListMember({ name, company, date, badge }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{name}</p>
          <p className="text-[11px] text-slate-500">{company}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{date}</p>
        </div>
      </div>
      <span className="text-[10px] bg-lime-100 text-lime-700 px-2 py-1 rounded-md font-bold">{badge}</span>
    </div>
  )
}

function LogbookItem({ title, date, status, statusColor, kendala }: any) {
  return (
    <div className="p-4 border border-slate-100 rounded-xl space-y-2">
      <div className="flex justify-between items-start gap-4">
        <h4 className="text-sm font-semibold text-slate-700 leading-snug">{title}</h4>
        <span className={`text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap ${statusColor}`}>{status}</span>
      </div>
      <div className="text-[10px] text-slate-400 flex items-center gap-2">
        <BookOpen size={12} /> {date}
      </div>
      <p className="text-[11px] text-orange-500 italic font-medium">Kendala: {kendala}</p>
    </div>
  )
}

function DudiItem({ name, count }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-bold text-slate-700">{name}</p>
        <p className="text-[10px] text-slate-400">Jl. Contoh Alamat Perusahaan...</p>
      </div>
      <span className="bg-lime-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">{count} siswa</span>
    </div>
  )
}