import { createClient } from "@/utils/supabase/server"
import { Users, Building, GraduationCap, BookOpen, MapPin } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Ambil Angka Statistik secara Real-time
  const { count: totalSiswa } = await supabase.from('siswa').select('*', { count: 'exact', head: true })
  const { count: totalDudi } = await supabase.from('dudi').select('*', { count: 'exact', head: true })
  const { count: siswaMagang } = await supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'berlangsung')
  
  // Ambil jumlah logbook hari ini
  const today = new Date().toISOString().split('T')[0]
  const { count: logbookToday } = await supabase.from('logbook').select('*', { count: 'exact', head: true }).eq('tanggal', today)

  // 2. Ambil Magang Terbaru (Join Tabel)
  const { data: recentMagang } = await supabase
    .from('magang')
    .select(`
  id,
  status,
  tanggal_mulai,
  tanggal_selesai,
  siswa ( nama ),
  dudi ( nama_perusahaan )
`)

    .order('created_at', { ascending: false })
    .limit(2)

  // 3. Ambil Logbook Paling Baru
  const { data: recentLogbook } = await supabase
    .from('logbook')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: dudiAktif } = await supabase
    .from('dudi')
    .select('*')
    .limit(5)

  // 5. Untuk setiap DUDI, hitung jumlah siswa magang yang BERLANGSUNG
  const dudiWithStudentCount = await Promise.all(
    (dudiAktif || []).map(async (dudi) => {
      const { count } = await supabase
        .from('magang')
        .select('*', { count: 'exact', head: true })
        .eq('dudi_id', dudi.id)
        .eq('status', 'berlangsung')
      
      return {
        ...dudi,
        siswa_count: count || 0
      }
    })
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Dashboard Admin</h1>
        <p className="text-slate-500 mt-1">Data real-time SMK Brantas Karangkates</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value={totalSiswa?.toString() || "0"} sub="Seluruh siswa terdaftar" icon={<Users className="text-cyan-500" />} />
        <StatCard title="DUDI Partner" value={totalDudi?.toString() || "0"} sub="Perusahaan mitra" icon={<Building className="text-blue-500" />} />
        <StatCard title="Siswa Magang" value={siswaMagang?.toString() || "0"} sub="Sedang aktif magang" icon={<GraduationCap className="text-indigo-500" />} />
        <StatCard title="Logbook" value={logbookToday?.toString() || "0"} sub="Laporan hari ini" icon={<BookOpen className="text-emerald-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COL: MAGANG & LOGBOOK */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="text-cyan-500" size={20} />
              <h3 className="font-bold text-[#0A2659]">Magang Terbaru</h3>
            </div>
            <div className="space-y-4">
              {recentMagang && recentMagang.length > 0 ? recentMagang.map((m: any) => (
                <ListMember 
  key={m.id} 
  name={m.siswa?.nama || "No Name"} 
  company={m.dudi?.nama_perusahaan || "No Company"} 
  date={`${m.tanggal_mulai} - ${m.tanggal_selesai}`} 
  status={m.status}
/>

              )) : <p className="text-sm text-slate-400">Belum ada data magang.</p>}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-emerald-500" size={20} />
              <h3 className="font-bold text-[#0A2659]">Logbook Terbaru</h3>
            </div>
            {recentLogbook ? (
              <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50/30 rounded-r-xl">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-slate-800 text-sm">{recentLogbook.kegiatan}</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold uppercase">
                    {recentLogbook.status_verifikasi}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{recentLogbook.tanggal}</p>
              </div>
            ) : <p className="text-sm text-slate-400">Belum ada aktivitas.</p>}
          </section>
        </div>

        {/* RIGHT COL: DUDI PARTNER */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Building className="text-orange-500" size={20} />
            <h3 className="font-bold text-[#0A2659]">DUDI Partner</h3>
          </div>
          <div className="space-y-6">
            {dudiWithStudentCount && dudiWithStudentCount.length > 0 ? dudiWithStudentCount.map((dudi: any) => (
              <DudiItem 
                key={dudi.id}
                name={dudi.nama_perusahaan} 
                address={dudi.alamat} 
                count={dudi.siswa_count} 
              />
            )) : <p className="text-xs text-slate-400 text-center py-4">Belum ada mitra.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}

// --- REUSABLE COMPONENTS ---
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

function ListMember({
  name,
  company,
  date,
  status
}: {
  name: string
  company: string
  date: string
  status: string
}) {

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-[#E6EFFF] transition-colors group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
          {name ? name.charAt(0) : "?"}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{name}</p>
          <p className="text-xs text-slate-500">{company}</p>
          <p className="text-[10px] text-slate-400 mt-1">{date}</p>
        </div>
      </div>
      <span
  className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase
    ${status === 'berlangsung'
      ? 'bg-emerald-100 text-emerald-600'
      : status === 'selesai'
      ? 'bg-slate-200 text-slate-600'
      : 'bg-amber-100 text-amber-600'
    }`}
>
  {status}
</span>

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