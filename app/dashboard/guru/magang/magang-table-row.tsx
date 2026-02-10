// magang-table-row.tsx
import React from "react";
import { Building2, Calendar, Edit, Trash2 } from "lucide-react";
import { MagangTableRowProps } from "./types";

export function MagangTableRow({ data, onEdit, onDelete }: MagangTableRowProps) {
  const statusConfig: Record<string, string> = {
    berlangsung: "bg-emerald-50 text-emerald-500",
    selesai: "bg-blue-50 text-blue-500",
    pending: "bg-amber-50 text-amber-500",
    diterima: "bg-cyan-50 text-cyan-500",
    ditolak: "bg-red-50 text-red-500",
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
        <p className="text-sm font-bold text-slate-800 leading-tight">{data.name}</p>
        <p className="text-[10px] text-slate-400 font-medium">NIS: {data.nis}</p>
      </td>
      <td className="px-8 py-5 text-[11px] font-bold text-slate-700">
        <div className="flex items-center gap-1.5">
          <Building2 size={12} className="text-cyan-500" /> {data.dudi}
        </div>
      </td>
      <td className="px-8 py-5 text-[10px] font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-cyan-500" /> {data.mulai || '-'} s/d {data.selesai || '-'}
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase ${statusConfig[data.status] || "bg-slate-50"}`}>
          {data.status}
        </span>
      </td>
      <td className="px-8 py-5 text-center">
        <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg font-bold text-xs ${data.score ? 'bg-lime-400 text-white' : 'bg-slate-50 text-slate-300'}`}>
          {data.score || "-"}
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <div className="flex justify-center gap-2">
          <button 
            onClick={onEdit} 
            className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-xl transition-all"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}