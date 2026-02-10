// input-field.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { InputFieldProps } from "./type";

export function InputField({ 
  icon, 
  label, 
  value, 
  onChange, 
  disabled, 
  type = "text" 
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        {icon} {label}
      </label>
      <Input 
        disabled={disabled} 
        onChange={onChange} 
        className="rounded-xl border-slate-200 h-11 text-sm focus-visible:ring-cyan-500" 
        value={value} 
        type={type}
      />
    </div>
  );
}