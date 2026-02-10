// jurnal-table-row.tsx
import React from "react";
import { Eye } from "lucide-react";
import { JurnalTableRowProps } from "./types";

export function JurnalTableRow({ data, onView }: JurnalTableRowProps) {
  const statusConfig: Record<string, string> = {
    diterima: "bg-emerald-50 text-emerald-500 border-emerald-100",
    pending: "bg-amber-50 text-amber-500 border-amber-100",
    ditolak: "bg-rose-50 text-rose-500 border-rose-100",
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-8 py-5">
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{data.name}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">{data.date}</p>
        </div>
      </td>
      <td className="px-8 py-5">
        <p className="text-[11px] text-slate-500 leading-relaxed italic line-clamp-1">
          {data.kegiatan}
        </p>
      </td>
      <td className="px-8 py-5 text-center">
        <span className={`text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider border ${statusConfig[data.status] || "bg-slate-50"}`}>
          {data.status}
        </span>
      </td>
      <td className="px-8 py-5">
        <p className="text-[11px] text-slate-400 italic line-clamp-1">
          {data.feedback}
        </p>
      </td>
      <td className="px-8 py-5 text-center">
        <button 
          onClick={onView} 
          className="p-2.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-2xl transition-all shadow-sm border border-transparent hover:border-cyan-100"
        >
          <Eye size={18} />
        </button>
      </td>
    </tr>
  );
}