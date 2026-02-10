//Modal tambah user
"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddUserModalProps } from "./type";

export function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  onResetForm,
  loading = false
}: AddUserModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    onResetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-[#0A2659]">Tambah User Baru</h3>
          <p className="text-slate-400 text-sm">Lengkapi semua informasi yang diperlukan</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Nama Lengkap *</label>
            <Input 
              name="full_name" 
              value={formData.full_name}
              placeholder="Masukkan nama lengkap" 
              required 
              onChange={onFormDataChange}
              className="rounded-xl border-slate-200 py-6" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Email *</label>
            <Input 
              name="email" 
              type="email" 
              value={formData.email}
              placeholder="Contoh: user@email.com" 
              required 
              onChange={onFormDataChange}
              className="rounded-xl border-slate-200 py-6" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Role *</label>
            <select 
              name="role" 
              value={formData.role}
              onChange={onFormDataChange}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Password *</label>
              <Input 
                name="password" 
                type="password" 
                value={formData.password}
                placeholder="Min. 6 karakter" 
                required 
                onChange={onFormDataChange}
                className="rounded-xl border-slate-200 py-6" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Konfirmasi Password *</label>
              <Input 
                name="confirmPassword" 
                type="password" 
                value={formData.confirmPassword}
                placeholder="Ulangi password" 
                required 
                onChange={onFormDataChange}
                className="rounded-xl border-slate-200 py-6" 
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 py-6 rounded-2xl font-bold text-slate-400 border-slate-200"
              disabled={loading}
            >
              Batal
            </Button>
            
            <Button 
              type="submit" 
              className="flex-1 py-6 rounded-2xl font-bold bg-[#0A2659] hover:bg-slate-800 text-white shadow-lg"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}