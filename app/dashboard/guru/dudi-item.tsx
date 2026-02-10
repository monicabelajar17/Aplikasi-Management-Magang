// dudi-item.tsx
import React from "react";
import { DudiItemProps } from "./types";

export function DudiItem({ name, address, count }: DudiItemProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-bold text-slate-700">{name}</p>
        <p className="text-[10px] text-slate-400 truncate w-40">
          {address}
        </p>
      </div>
      <span className="bg-lime-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
        {count} siswa
      </span>
    </div>
  );
}