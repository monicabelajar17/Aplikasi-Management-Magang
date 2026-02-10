// list-member.tsx
import React from "react";
import { ListMemberProps } from "./types";

export function ListMember({ name, company, date, badge }: ListMemberProps) {
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'berlangsung':
        return 'bg-amber-100 text-amber-700';
      case 'selesai':
        return 'bg-emerald-100 text-emerald-700';
      case 'menunggu':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-lime-100 text-lime-700';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {name?.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{name}</p>
          <p className="text-[11px] text-slate-500">{company}</p>
          <p className="text-[10px] text-slate-400">{date}</p>
        </div>
      </div>
      <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${getStatusStyle(badge)}`}>
        {badge}
      </span>
    </div>
  );
}