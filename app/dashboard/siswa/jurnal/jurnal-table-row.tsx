// jurnal-table-row.tsx
import React from "react";
import { MessageSquare, Eye, Edit, Trash2 } from "lucide-react";
import { JurnalTableRowProps } from "./types";

export function JurnalTableRow({ 
  date, 
  kegiatan, 
  status, 
  feedback, 
  onView, 
  onEdit, 
  onDelete 
}: JurnalTableRowProps) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    diterima: { 
      bg: "bg-emerald-50", 
      text: "text-emerald-500", 
      label: "Disetujui" 
    },
    pending: { 
      bg: "bg-amber-50", 
      text: "text-amber-500", 
      label: "Pending" 
    },
    ditolak: { 
      bg: "bg-rose-50", 
      text: "text-rose-500", 
      label: "Ditolak" 
    },
  };

  const statusInfo = statusConfig[status] || { bg: "bg-slate-50", text: "text-slate-500", label: "Unknown" };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {/* Tanggal */}
      <td className="px-8 py-6 align-top">
        <p className="text-xs font-bold text-slate-700 leading-tight min-w-[100px]">{date}</p>
      </td>

      {/* Kegiatan */}
      <td className="px-8 py-6">
        <div className="max-w-[400px]">
          <p className="text-[11px] text-slate-500 leading-relaxed italic line-clamp-2">
            {kegiatan}
          </p>
        </div>
      </td>

      {/* Status */}
      <td className="px-8 py-6 text-center align-top">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text}`}>
            {statusInfo.label}
          </span>
          {status === 'ditolak' && (
            <p className="text-[8px] text-rose-400 font-bold uppercase">Perlu diperbaiki</p>
          )}
        </div>
      </td>

      {/* Feedback */}
      <td className="px-8 py-6 align-top">
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[180px]">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare size={10} className="text-slate-400" />
            <p className="text-[9px] font-bold text-slate-400 uppercase">Catatan Guru:</p>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            {feedback === "Belum ada feedback" ? (
              <span className="text-slate-300 italic">{feedback}</span>
            ) : feedback}
          </p>
        </div>
      </td>

      {/* Aksi */}
      <td className="px-8 py-6 text-center align-top">
        <div className="flex justify-center gap-2">
          <button 
            onClick={onView} 
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Eye size={16} />
          </button>
          {status !== 'diterima' && (
            <>
              <button 
                onClick={onEdit} 
                className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={onDelete} 
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}