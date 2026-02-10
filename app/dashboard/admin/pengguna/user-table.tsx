//semua yang berkaitan dengan tabel.
import { Mail, Edit, Trash2, CheckCircle2, Shield, GraduationCap, User as UserIcon } from "lucide-react";
import { UserTableRowProps } from "./type";

export function UserTableRow({ user, onDelete, onEdit }: UserTableRowProps) {
  const roleConfig: any = {
    admin: {
      label: "Admin",
      class: "bg-purple-100 text-purple-700 border border-purple-200",
      icon: <Shield size={12} />
    },
    guru: {
      label: "Guru",
      class: "bg-blue-100 text-blue-700 border border-blue-200",
      icon: <GraduationCap size={12} />
    },
    siswa: {
      label: "Siswa",
      class: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      icon: <UserIcon size={12} />
    }
  };

  const initial = user.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-[#0A2659] rounded-full flex items-center justify-center text-white font-bold text-sm">
            {initial}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{user.full_name}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">ID: #{user.id}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Mail size={12} className="text-slate-300" /> {user.email}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
            <CheckCircle2 size={10} /> Akun Aktif
          </div>
        </div>
      </td>
      
      <td className="px-8 py-5 text-center">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider ${roleConfig[user.role]?.class}`}>
          {roleConfig[user.role]?.icon}
          {roleConfig[user.role]?.label}
        </span>
      </td>
      <td className="px-8 py-5">
        <p className="text-xs font-semibold text-slate-600">
          {new Date(user.created_at).toLocaleDateString('id-ID')}
        </p>
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