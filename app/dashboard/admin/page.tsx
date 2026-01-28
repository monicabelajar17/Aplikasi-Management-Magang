import { Users, Building, GraduationCap, BookOpen, MapPin, Phone } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang di sistem pelaporan magang siswa SMK Brantas Karangkates</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value="150" sub="Seluruh siswa terdaftar" icon={<Users className="text-cyan-500" />} />
        <StatCard title="DUDI Partner" value="45" sub="Perusahaan mitra" icon={<Building className="text-blue-500" />} />
        <StatCard title="Siswa Magang" value="120" sub="Sedang aktif magang" icon={<GraduationCap className="text-indigo-500" />} />
        <StatCard title="Logbook Hari Ini" value="85" sub="Laporan masuk hari ini" icon={<BookOpen className="text-emerald-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COL: MAGANG TERBARU */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="text-cyan-500" size={20} />
              <h3 className="font-bold text-[#0A2659]">Magang Terbaru</h3>
            </div>
            <div className="space-y-4">
              <ListMember name="Ahmad Rizki" company="PT. Teknologi Nusantara" date="15/1/2024 - 15/4/2024" />
              <ListMember name="Siti Nurhaliza" company="CV. Digital Kreatif" date="20/1/2024 - 20/4/2024" />
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-emerald-500" size={20} />
              <h3 className="font-bold text-[#0A2659]">Logbook Terbaru</h3>
            </div>
            {/* Contoh Logbook Item */}
            <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50/30 rounded-r-xl">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-800 text-sm">Mempelajari sistem database dan backup data</p>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">DISETUJUI</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">21/1/2024</p>
              <p className="text-[11px] text-orange-600 mt-2 font-medium">Kendala: Tidak ada kendala berarti</p>
            </div>
          </section>
        </div>

        {/* RIGHT COL: DUDI AKTIF */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Building className="text-orange-500" size={20} />
            <h3 className="font-bold text-[#0A2659]">DUDI Aktif</h3>
          </div>
          <div className="space-y-6">
            <DudiItem name="PT. Teknologi Nusantara" address="Jl. HR Muhammad No. 123" count={8} />
            <DudiItem name="CV. Digital Kreatif" address="Jl. Pemuda No. 45" count={5} />
          </div>
        </section>
      </div>
    </div>
  )
}

// --- REUSABLE COMPONENTS (Agar Belajar TypeScript Lebih Enak) ---

function StatCard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: any }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="absolute top-4 right-4 bg-slate-50 p-2 rounded-lg">{icon}</div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h2 className="text-3xl font-extrabold text-[#0A2659] my-1">{value}</h2>
      <p className="text-[10px] text-slate-400">{sub}</p>
    </div>
  )
}

function ListMember({ name, company, date }: { name: string, company: string, date: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-[#E6EFFF] transition-colors group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{name}</p>
          <p className="text-xs text-slate-500">{company}</p>
          <p className="text-[10px] text-slate-400 mt-1">{date}</p>
        </div>
      </div>
      <span className="text-[10px] bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full font-bold">AKTIF</span>
    </div>
  )
}

function DudiItem({ name, address, count }: { name: string, address: string, count: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-bold text-slate-800">{name}</h4>
        <span className="bg-lime-400 text-white text-[10px] px-2 py-0.5 rounded font-bold">{count} Siswa</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        <MapPin size={12} /> {address}
      </div>
    </div>
  )
}