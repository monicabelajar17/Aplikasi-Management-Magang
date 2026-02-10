//Modal edit user
"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditUserModalProps } from "./type";

export function EditUserModal({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  onEditingUserChange,
  loading = false
}: EditUserModalProps) {
  if (!isOpen || !editingUser) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-[#0A2659]">Edit User</h3>
          <p className="text-slate-400 text-sm">Perbarui informasi user</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Nama Lengkap *</label>
            <Input 
              value={editingUser.full_name} 
              onChange={(e) => onEditingUserChange({...editingUser, full_name: e.target.value})}
              className="rounded-xl border-slate-200 py-6" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Email *</label>
            <Input 
              value={editingUser.email} 
              onChange={(e) => onEditingUserChange({...editingUser, email: e.target.value})}
              className="rounded-xl border-slate-200 py-6" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Role *</label>
            <select 
              value={editingUser.role} 
              onChange={(e) => onEditingUserChange({...editingUser, role: e.target.value as 'admin' | 'guru' | 'siswa'})}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none"
            >
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>

          {/* Catatan */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-[11px] text-blue-600 leading-relaxed">
              <span className="font-bold">Catatan:</span> Untuk mengubah password, silakan gunakan fitur reset password yang terpisah.
            </p>
          </div>

          <div className="flex gap-3 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 py-6 rounded-2xl font-bold text-slate-400"
              disabled={loading}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="flex-1 py-6 rounded-2xl font-bold bg-[#0A2659] text-white"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}