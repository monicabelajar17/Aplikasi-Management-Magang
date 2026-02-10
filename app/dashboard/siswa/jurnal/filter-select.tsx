// filter-select.tsx
import React from "react";
import { ChevronDown } from "lucide-react";
import { FilterSelectProps } from "./types";

export function FilterSelect({ label, placeholder }: FilterSelectProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="relative">
        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium">
          <option>{placeholder}</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400" />
      </div>
    </div>
  );
}