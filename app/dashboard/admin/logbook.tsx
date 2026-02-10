import { BookOpen } from "lucide-react"

export function LogbookSection({ data }: { data: any }) {
  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="text-emerald-500" size={20} />
        <h3 className="font-bold text-[#0A2659]">Logbook Terbaru</h3>
      </div>
      {data ? (
        <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50/30 rounded-r-xl">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-slate-800 text-sm">{data.kegiatan}</p>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold uppercase">
              {data.status_verifikasi}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{data.tanggal}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Belum ada aktivitas.</p>
      )}
    </section>
  )
}