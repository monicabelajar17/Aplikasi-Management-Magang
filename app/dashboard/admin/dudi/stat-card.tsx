//Komponen kecil untuk kotak statistik di bagian atas.
import { StatCardProps } from "./types";

export function StatCard({ title, value, sub, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-4 right-4 bg-slate-50 p-2 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <h2 className="text-3xl font-extrabold text-[#0A2659] my-2">{value}</h2>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
  );
}