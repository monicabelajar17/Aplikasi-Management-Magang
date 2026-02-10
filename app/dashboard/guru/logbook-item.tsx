// logbook-item.tsx
import React from "react";
import { BookOpen } from "lucide-react";
import { LogbookItemProps } from "./types";

export function LogbookItem({
  studentName,
  title,
  date,
  status,
  statusColor,
  kendala
}: LogbookItemProps) {
  return (
    <div className="p-4 border border-slate-100 rounded-xl space-y-2">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-[10px] font-bold text-cyan-600 mb-1">
            {studentName?.toUpperCase()}
          </p>
          <h4 className="text-sm font-semibold text-slate-700">
            {title}
          </h4>
        </div>
        <span
          className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="text-[10px] text-slate-400 flex items-center gap-2">
        <BookOpen size={12} /> {date}
      </div>

      <p className="text-[11px] text-orange-500 italic font-medium">
        Kendala: {kendala}
      </p>
    </div>
  );
}