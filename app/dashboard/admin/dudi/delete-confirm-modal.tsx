//Modal khusus konfirmasi hapus.
"use client"

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dudiName: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  dudiName
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-[#0A2659]">
            Hapus DUDI
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="text-red-600" size={24} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">Apakah Anda yakin?</h3>
          <p className="text-slate-500 text-sm">
            Anda akan menghapus <span className="font-semibold text-[#0A2659]">{dudiName}</span>. 
            Data yang dihapus <span className="font-bold text-red-500">tidak dapat dikembalikan</span>.
          </p>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600"
            onClick={onConfirm}
          >
            Ya, Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}