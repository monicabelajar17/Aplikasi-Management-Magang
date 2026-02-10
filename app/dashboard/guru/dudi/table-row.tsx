// table-row.tsx
import React from "react";
import { Building2, Mail, Phone } from "lucide-react";
import { TableRowProps } from "./types";

export function TableRow({ company, address, email, phone, pic, count }: TableRowProps) {
  const safePic = pic || "Belum Ada";
  
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-cyan-50/50 border border-cyan-100 flex items-center justify-center rounded-xl text-cyan-600">
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{company}</p>
            <p className="text-[10px] text-slate-400 mt-1">{address || "Alamat belum tersedia"}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Mail size={12} className="text-cyan-500" /> {email || "-"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Phone size={12} className="text-cyan-500" /> {phone || "-"}
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-[#E6EFFF] rounded-full flex items-center justify-center text-[10px] font-bold text-[#0A2659] border border-blue-100">
            {safePic.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm font-semibold text-slate-700">{safePic}</p>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-lime-400 text-white text-[11px] font-bold shadow-sm">
            {count}
          </div>
          <span className="text-[10px] text-slate-400 font-medium text-xs">Siswa</span>
        </div>
      </td>
    </tr>
  );
}