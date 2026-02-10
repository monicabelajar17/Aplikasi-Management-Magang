import { Building, MapPin } from "lucide-react"

export function DudiSection({ data }: { data: any[] }) {
  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <Building className="text-orange-500" size={20} />
        <h3 className="font-bold text-[#0A2659]">DUDI Partner</h3>
      </div>
      <div className="space-y-6">
        {data?.length > 0 ? data.map((dudi) => (
          <div key={dudi.id} className="space-y-1">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-bold text-slate-800">{dudi.nama_perusahaan}</h4>
              <span className="bg-lime-400 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                {dudi.siswa_count} Siswa
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <MapPin size={12} /> {dudi.alamat}
            </div>
          </div>
        )) : <p className="text-xs text-slate-400 text-center py-4">Belum ada mitra.</p>}
      </div>
    </section>
  )
}