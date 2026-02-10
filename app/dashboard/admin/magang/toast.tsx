// toast.tsx - Buat file ini jika belum ada
import React from "react";

interface ToastProps {
  toast: {
    show: boolean;
    message: string;
  };
}

export function Toast({ toast }: ToastProps) {
  if (!toast.show) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-5">
      <p className="text-sm font-bold">{toast.message}</p>
    </div>
  );
}