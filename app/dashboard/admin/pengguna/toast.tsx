//Notif berhasil
"use client"

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { ToastState } from "./type";

interface ToastProps {
  toast: ToastState;
}

export function Toast({ toast }: ToastProps) {
  if (!toast.show) return null;

  return (
    <div className="fixed top-5 right-5 z-[2000] animate-in slide-in-from-right-10 duration-300">
      <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
        <div className="bg-white/20 p-1 rounded-full">
          <CheckCircle2 size={18} />
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-sm">Berhasil!</p>
          <p className="text-xs text-emerald-50">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}