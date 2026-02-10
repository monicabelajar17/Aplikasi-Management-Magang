// stat-card-base.tsx
import React from "react";
import { StatCardProps } from "./types";

export function StatCard({ title, value, sub, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-extrabold text-[#0A2659] my-1">{value}</h2>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">{icon}</div>
    </div>
  );
}