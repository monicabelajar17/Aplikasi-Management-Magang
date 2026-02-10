// stat-cards.tsx
import React from "react";
import { StatCardProps } from "./types";

export function StatCard({ title, value, sub, icon }: StatCardProps) {
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
  );
}