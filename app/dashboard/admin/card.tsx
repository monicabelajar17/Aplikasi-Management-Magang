import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  sub: string
  icon: ReactNode
}

export function StatCard({ title, value, sub, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="absolute top-4 right-4 bg-slate-50 p-2 rounded-lg">{icon}</div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h2 className="text-3xl font-extrabold text-[#0A2659] my-1">{value}</h2>
      <p className="text-[10px] text-slate-400">{sub}</p>
    </div>
  )
}