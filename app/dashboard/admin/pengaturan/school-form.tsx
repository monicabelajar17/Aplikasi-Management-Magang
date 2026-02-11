// school-form.tsx
"use client"

import React from "react";
import { Settings, Edit3, Upload, School, MapPin, Hash, Phone, Mail, Globe, UserCircle, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InputField } from "./input-field";
import { SchoolFormProps } from "./type";

export function SchoolForm({
  formData,
  isEditing,
  isSaving,
  isUploading,
  onFormChange,
  onUpload,
  onDeleteLogo,
  onToggleEdit,
  onSave,
  onCancel
}: SchoolFormProps) {
  const handleInputChange = (field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFormChange(field, e.target.value);
    };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-[#0A2659]">
          <Settings className="text-cyan-[#0A2659]" size={20} />
          Informasi Sekolah
        </div>
        {!isEditing ? (
          <Button onClick={onToggleEdit} size="sm" className="bg-[#0A2659] hover:bg-cyan-600 rounded-xl gap-2">
            <Edit3 size={14} /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={onCancel}
              variant="outline" 
              size="sm" 
              className="rounded-xl text-slate-500"
            >
              <X size={14} /> Batal
            </Button>
            <Button 
              onClick={onSave} 
              disabled={isSaving} 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 rounded-xl gap-2 text-white"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Simpan
            </Button>
          </div>
        )}
      </div>

      <div className="p-8 space-y-6">
        {/* Logo Section */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Upload size={14} /> Logo Sekolah
          </label>
          <div className="flex items-center gap-4">
            <label className="relative cursor-pointer group">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={onUpload}
                disabled={isUploading}
              />
              <div className="h-24 w-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 overflow-hidden group-hover:bg-slate-100 transition-all">
                {isUploading ? (
                  <Loader2 className="animate-spin text-cyan-500" />
                ) : formData.logo_url ? (
                  <img src={formData.logo_url} className="h-full w-full object-contain p-2" alt="Logo preview" />
                ) : (
                  <>
                    <School size={32} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] mt-2 font-bold uppercase">Upload</span>
                  </>
                )}
              </div>
              {/* Overlay Edit saat Hover */}
              {formData.logo_url && !isUploading && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                  <Edit3 size={20} className="text-white" />
                </div>
              )}
            </label>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">
                Klik kotak untuk mengganti logo. Gunakan .png transparan untuk hasil terbaik.
              </p>
              {formData.logo_url && (
                <button 
                  onClick={onDeleteLogo}
                  className="text-[9px] text-red-500 font-bold uppercase hover:underline"
                >
                  Hapus Logo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField 
            disabled={!isEditing} 
            icon={<School size={16} />} 
            label="Nama Sekolah" 
            value={formData.nama_sekolah} 
            onChange={handleInputChange('nama_sekolah')}
          />
          <InputField 
            disabled={!isEditing} 
            icon={<Hash size={16} />} 
            label="NPSN" 
            value={formData.npsn}
            onChange={handleInputChange('npsn')}
          />
          <div className="md:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin size={14} /> Alamat Lengkap
            </label>
            <Textarea 
              disabled={!isEditing}
              className="rounded-xl border-slate-200 min-h-[100px] text-sm" 
              value={formData.alamat}
              onChange={(e) => onFormChange('alamat', e.target.value)}
            />
          </div>
          <InputField 
            disabled={!isEditing} 
            icon={<Phone size={16} />} 
            label="Telepon" 
            value={formData.telepon} 
            onChange={handleInputChange('telepon')} 
          />
          <InputField 
            disabled={!isEditing} 
            icon={<Mail size={16} />} 
            label="Email" 
            value={formData.email} 
            onChange={handleInputChange('email')} 
          />
          <InputField 
            disabled={!isEditing} 
            icon={<Globe size={16} />} 
            label="Website" 
            value={formData.website} 
            onChange={handleInputChange('website')} 
          />
          <InputField 
            disabled={!isEditing} 
            icon={<UserCircle size={16} />} 
            label="Kepala Sekolah" 
            value={formData.kepala_sekolah} 
            onChange={handleInputChange('kepala_sekolah')} 
          />
        </div>
      </div>
    </div>
  );
}