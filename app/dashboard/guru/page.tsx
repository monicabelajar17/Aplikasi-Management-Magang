import { createClient } from "@/utils/supabase/server"
import {
  Users,
  Building,
  GraduationCap,
  BookOpen,
  ClipboardList
} from "lucide-react"
import { cookies } from "next/headers"

export default async function GuruDashboardPage() {
  const supabase = await createClient()

const {
  data: { user }
} = await supabase.auth.getUser()

const { data: guru } = await supabase
  .from('guru')
  .select('id')
  .eq('user_id', user?.id)
  .single()
const cookieStore = await cookies()
  const guruId = Number(cookieStore.get("guru_id")?.value)

  if (!guruId) {
    throw new Error("Guru belum login")
  }
  // ======================
  // STATISTIK
  // ======================
  const { count: totalSiswa } = await supabase
  .from('siswa')
  .select('*', { count: 'exact', head: true })
  .eq('guru_id', guruId)

  const { data: dudiData } = await supabase
  .from("magang")
  .select(`
    dudi_id,
    siswa!inner ( guru_id )
  `)
  .eq("siswa.guru_id", guruId)

const totalDudi = new Set(dudiData?.map(d => d.dudi_id)).size

  const { count: siswaMagang } = await supabase
  .from("magang")
  .select(`
    id,
    siswa!inner ( guru_id )
  `, { count: "exact", head: true })
  .eq("status", "berlangsung")
  .eq("siswa.guru_id", guruId)


  const today = new Date().toISOString().split('T')[0]

const { count: logbookToday } = await supabase
  .from("logbook")
  .select(`
    id,
    magang!inner (
      siswa!inner ( guru_id )
    )
  `, { count: "exact", head: true })
  .eq("tanggal", today)
  .eq("magang.siswa.guru_id", guruId)

  // ======================
  // MAGANG TERBARU
  // ======================
  const { data: recentMagang } = await supabase
  .from("magang")
  .select(`
    id,
    status,
    tanggal_mulai,
    tanggal_selesai,
    siswa!inner ( nama, guru_id ),
    dudi ( nama_perusahaan )
  `)
  .eq("siswa.guru_id", guruId)
  .order("created_at", { ascending: false })
  .limit(2)


  // ======================
  // LOGBOOK TERBARU
  // ======================
  const { data: recentLogbooks } = await supabase
  .from("logbook")
  .select(`
    id,
    kegiatan,
    tanggal,
    status_verifikasi,
    kendala,
    magang!inner (
      siswa!inner ( nama, guru_id )
    )
  `)
  .eq("magang.siswa.guru_id", guruId)
  .order("created_at", { ascending: false })
  .limit(2)

  // ======================
  // DUDI AKTIF
  // ======================
  const { data: dudiAktif } = await supabase
  .from("dudi")
  .select(`
    id,
    nama_perusahaan,
    alamat,
    magang!inner (
      id,
      status,
      siswa!inner ( guru_id )
    )
  `)
  .eq("magang.status", "berlangsung")
  .eq("magang.siswa.guru_id", guruId)
  .eq("is_deleted", false)

  const formattedDudiAktif = dudiAktif?.map(d => ({
  ...d,
  siswa_count: d.magang.length
}))

  // ======================
  // RENDER
  // ======================
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">
          Dashboard Guru
        </h1>
        <p className="text-slate-500 mt-1">
          Ringkasan aktivitas pemantauan magang siswa
        </p>
      </div>

      {/* STAT CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Siswa"
          value={totalSiswa?.toString() || "0"}
          sub="Siswa terdaftar"
          icon={<Users className="text-cyan-500" />}
        />
        <StatCard
          title="DUDI Partner"
          value={totalDudi?.toString() || "0"}
          sub="Perusahaan mitra"
          icon={<Building className="text-blue-500" />}
        />
        <StatCard
          title="Siswa Magang"
          value={siswaMagang?.toString() || "0"}
          sub="Aktif magang"
          icon={<GraduationCap className="text-indigo-500" />}
        />
        <StatCard
          title="Logbook Hari Ini"
          value={logbookToday?.toString() || "0"}
          sub="Laporan masuk"
          icon={<BookOpen className="text-emerald-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAGANG & LOGBOOK */}
        <div className="lg:col-span-2 space-y-6">
          {/* MAGANG TERBARU */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="text-cyan-500" size={20} />
              <h3 className="font-bold text-[#0A2659]">
                Magang Terbaru
              </h3>
            </div>

            <div className="space-y-4">
              {recentMagang?.map((m: any) => (
                <ListMember
                  key={m.id}
                  name={m.siswa?.nama}
                  company={m.dudi?.nama_perusahaan}
                  date={`${m.tanggal_mulai} - ${m.tanggal_selesai}`}
                  badge="AM"
                />
              ))}
            </div>
          </section>

          {/* LOGBOOK TERBARU */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="text-emerald-500" size={20} />
              <h3 className="font-bold text-[#0A2659]">
                Logbook Terbaru
              </h3>
            </div>

            <div className="space-y-4">
              {recentLogbooks?.map((log: any) => (
                <LogbookItem
                  key={log.id}
                  studentName={log.magang?.siswa?.nama}
                  title={log.kegiatan}
                  date={log.tanggal}
                  status={log.status_verifikasi}
                  statusColor={
                    log.status_verifikasi === "disetujui"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600"
                  }
                  kendala={log.kendala || "Tidak ada kendala"}
                />
              ))}
            </div>
          </section>
        </div>

        {/* DUDI AKTIF */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Building className="text-orange-500" size={20} />
            <h3 className="font-bold text-[#0A2659]">
              DUDI Aktif
            </h3>
          </div>

          <div className="space-y-4">
            {formattedDudiAktif?.map((dudi: any) => (
              <DudiItem
                key={dudi.id}
                name={dudi.nama_perusahaan}
                address={dudi.alamat}
                count={dudi.siswa_count}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
// ======================
// KOMPONEN PENDUKUNG
// ======================

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <div className="bg-slate-50 p-2 rounded-lg">{icon}</div>
      </div>
      <h2 className="text-3xl font-extrabold text-[#0A2659] mb-1">
        {value}
      </h2>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
  )
}

function ListMember({ name, company, date, badge }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {name?.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{name}</p>
          <p className="text-[11px] text-slate-500">{company}</p>
          <p className="text-[10px] text-slate-400">{date}</p>
        </div>
      </div>
      <span className="text-[10px] bg-lime-100 text-lime-700 px-2 py-1 rounded-md font-bold">
        {badge}
      </span>
    </div>
  )
}

function LogbookItem({
  studentName,
  title,
  date,
  status,
  statusColor,
  kendala
}: any) {
  return (
    <div className="p-4 border border-slate-100 rounded-xl space-y-2">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-[10px] font-bold text-cyan-600 mb-1">
            {studentName?.toUpperCase()}
          </p>
          <h4 className="text-sm font-semibold text-slate-700">
            {title}
          </h4>
        </div>
        <span
          className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="text-[10px] text-slate-400 flex items-center gap-2">
        <BookOpen size={12} /> {date}
      </div>

      <p className="text-[11px] text-orange-500 italic font-medium">
        Kendala: {kendala}
      </p>
    </div>
  )
}

function DudiItem({ name, address, count }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-bold text-slate-700">{name}</p>
        <p className="text-[10px] text-slate-400 truncate w-40">
          {address}
        </p>
      </div>
      <span className="bg-lime-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
        {count} siswa
      </span>
    </div>
  )
}
