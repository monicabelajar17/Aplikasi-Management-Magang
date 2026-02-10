//Berisi komponen TableRow dan logika rendering tabelnya.
import { TableRowProps } from "./types";
import { Building2, Mail, Phone, Edit, Trash2 } from "lucide-react";

export function TableRow({ dudi, onEditClick, onDeleteClick }: TableRowProps) {
  const isAktif = dudi.status === "aktif";
  const count = dudi.jumlah_siswa || 0;

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-cyan-100 flex items-center justify-center rounded-xl text-cyan-600">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">{dudi.nama_perusahaan}</p>
            <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[200px]">{dudi.alamat}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Mail size={12} className="text-slate-300" /> {dudi.email}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Phone size={12} className="text-slate-300" /> {dudi.telepon}
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400 text-uppercase">
            {dudi.penanggung_jawab?.charAt(0) || "P"}
          </div>
          <p className="text-sm font-semibold text-slate-700">{dudi.penanggung_jawab}</p>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
          isAktif ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
        }`}>
          {dudi.status?.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="bg-lime-500 text-white text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap">
            {count}
          </span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex justify-center gap-2">
          <button 
            onClick={onEditClick}
            className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={onDeleteClick}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}