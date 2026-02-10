// delete-confirm-modal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmModalProps } from "./types";

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-6">
          <h3 className="text-lg font-extrabold text-slate-800">
            Konfirmasi Hapus
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Apakah Anda yakin ingin menghapus data ini?  
            <br />
            <span className="text-rose-600 font-semibold">
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </p>
        </div>

        {/* Action */}
        <div className="flex justify-end gap-3 px-6 py-4 mt-4 border-t">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl font-semibold"
          >
            Batal
          </Button>

          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
          >
            Ya, Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}