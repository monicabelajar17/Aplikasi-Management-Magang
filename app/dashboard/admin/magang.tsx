import { GraduationCap } from "lucide-react"

export function MagangSection({ data }: { data: any[] | null }) {
  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="text-cyan-500" size={20} />
        <h3 className="font-bold text-[#0A2659]">Magang Terbaru</h3>
      </div>
      <div className="space-y-4">
        {data && data.length > 0 ? data.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-[#E6EFFF] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                {m.siswa?.nama?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{m.siswa?.nama}</p>
                <p className="text-xs text-slate-500">{m.dudi?.nama_perusahaan}</p>
                <p className="text-[10px] text-slate-400 mt-1">{m.tanggal_mulai} - {m.tanggal_selesai}</p>
              </div>
            </div>
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
              m.status === 'berlangsung' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {m.status}
            </span>
          </div>
        )) : <p className="text-sm text-slate-400">Belum ada data magang.</p>}
      </div>
    </section>
  )
}