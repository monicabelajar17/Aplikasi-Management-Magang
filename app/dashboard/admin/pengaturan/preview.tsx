// preview-section.tsx
import React from "react";
import { PreviewSectionProps } from "./type";

export function PreviewSection({ icon, title, desc, children }: PreviewSectionProps) {
  return (
    <div className="space-y-3">
      <div>
        <h5 className="text-[11px] font-bold text-slate-800 flex items-center gap-2">
          {icon} {title}
        </h5>
        {desc && <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}