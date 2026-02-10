//Konfirmasi hapus user
"use client"

import React from "react";
import { DeleteConfirmModalProps } from "./type";

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-black text-[#0A2659] mb-3">Konfirmasi Hapus</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Apakah Anda yakin ingin menghapus data user ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        
        <div className="flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all text-sm"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="px-8 py-3 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100 transition-all text-sm"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}