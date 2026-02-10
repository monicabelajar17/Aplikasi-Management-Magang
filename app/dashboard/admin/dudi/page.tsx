// page.tsx
"use client"

import React, { useEffect, useState } from "react";
import { 
  Building2, Plus, Search, Mail, Phone, Edit, 
  Trash2, CheckCircle2, XCircle, Users, Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "./stat-card";
import { TableRow } from "./dudi-table";
import { DudiFormModal } from "./dudi-form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { 
  fetchDudi, 
  addDudi, 
  updateDudi, 
  deleteDudi, 
  validateDudiForm 
} from "./action";
import { Dudi, DudiFormData, ToastState } from "./types";

export default function ManajemenDudiPage() {
  const [dudiList, setDudiList] = useState<Dudi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Data states
  const [dudiToEdit, setDudiToEdit] = useState<Dudi | null>(null);
  const [dudiToDelete, setDudiToDelete] = useState<Dudi | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Form state
  const [formData, setFormData] = useState<DudiFormData>({
    nama_perusahaan: "",
    email: "",
    telepon: "",
    penanggung_jawab: "",
    alamat: "",
    status: "aktif"
  });

  // Fetch data
  const loadDudi = async () => {
    setLoading(true);
    try {
      const data = await fetchDudi();
      setDudiList(data);
    } catch (error: any) {
      console.error("Error loading DUDI:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDudi();
  }, []);

  // Toast handler
  const showToast = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    setToast({
      show: true,
      type,
      title,
      message
    });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubmit = async () => {
    const validationError = validateDudiForm(formData);
    if (validationError) {
      showToast('error', 'Validasi Gagal', validationError);
      return;
    }

    setSubmitting(true);
    try {
      await addDudi(formData);
      showToast('success', 'Berhasil!', `DUDI "${formData.nama_perusahaan}" berhasil ditambahkan`);
      setIsAddOpen(false);
      resetForm();
      loadDudi();
    } catch (error: any) {
      showToast('error', 'Gagal Menambahkan', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!dudiToEdit) return;

    const validationError = validateDudiForm(formData);
    if (validationError) {
      showToast('error', 'Validasi Gagal', validationError);
      return;
    }

    setSubmitting(true);
    try {
      await updateDudi(dudiToEdit.id, formData);
      showToast('success', 'Berhasil!', `Data "${formData.nama_perusahaan}" berhasil diperbarui`);
      setIsEditOpen(false);
      setDudiToEdit(null);
      resetForm();
      loadDudi();
    } catch (error: any) {
      showToast('error', 'Gagal Mengupdate', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!dudiToDelete) return;

    try {
      await deleteDudi(dudiToDelete.id);
      showToast('success', 'Berhasil!', `DUDI "${dudiToDelete.nama_perusahaan}" berhasil dihapus`);
      setIsDeleteOpen(false);
      setDudiToDelete(null);
      loadDudi();
    } catch (error: any) {
      showToast('error', 'Gagal Menghapus', error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      nama_perusahaan: "",
      email: "",
      telepon: "",
      penanggung_jawab: "",
      alamat: "",
      status: "aktif"
    });
  };

  // Calculations
  const totalDudi = dudiList.length;
  const dudiAktif = dudiList.filter(d => d.status === 'aktif').length;
  const dudiTidakAktif = dudiList.filter(d => d.status === 'nonaktif').length;
  const totalSiswa = dudiList.reduce((acc, curr) => acc + (curr.jumlah_siswa || 0), 0);

  const filteredDudi = dudiList.filter(d => 
    d.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.penanggung_jawab?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-[2000] animate-in slide-in-from-right-10 duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
            toast.type === 'success' 
              ? 'bg-emerald-500 text-white border-emerald-400' 
              : toast.type === 'error'
              ? 'bg-red-500 text-white border-red-400'
              : 'bg-amber-500 text-white border-amber-400'
          }`}>
            <div className={`p-1 rounded-full ${
              toast.type === 'success' ? 'bg-white/20' 
              : toast.type === 'error' ? 'bg-white/20'
              : 'bg-white/20'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle2 size={18} />
              ) : toast.type === 'error' ? (
                <XCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-sm">{toast.title}</p>
              <p className="text-xs opacity-90">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen DUDI</h1>
        <p className="text-slate-500 mt-1">Kelola data mitra Dunia Usaha dan Dunia Industri</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total DUDI" value={totalDudi} sub="Perusahaan mitra" icon={<Building2 className="text-cyan-500" />} />
        <StatCard title="DUDI Aktif" value={dudiAktif} sub="Perusahaan aktif" icon={<CheckCircle2 className="text-emerald-500" />} />
        <StatCard title="DUDI Tidak Aktif" value={dudiTidakAktif} sub="Perusahaan tidak aktif" icon={<XCircle className="text-red-500" />} />
        <StatCard title="Total Siswa Magang" value={totalSiswa} sub="Siswa magang aktif" icon={<Users className="text-blue-500" />} />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <Building2 className="text-cyan-500" size={20} />
            <h3 className="font-bold text-[#0A2659]">Daftar DUDI</h3>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari perusahaan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px] lg:w-[250px] border-slate-200 rounded-xl focus:ring-cyan-500" 
              />
            </div>

            {/* Add Button */}
            <Button 
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl gap-2 shadow-lg shadow-cyan-100"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah DUDI</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Perusahaan</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Penanggung Jawab</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Siswa Magang</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400">
                    <Loader2 className="animate-spin inline mr-2" /> Memuat data DUDI...
                  </td>
                </tr>
              ) : filteredDudi.map((dudi) => (
                <TableRow 
                  key={dudi.id} 
                  dudi={dudi}
                  onEditClick={() => {
                    setDudiToEdit(dudi);
                    setFormData({
                      nama_perusahaan: dudi.nama_perusahaan || "",
                      email: dudi.email || "",
                      telepon: dudi.telepon || "",
                      penanggung_jawab: dudi.penanggung_jawab || "",
                      alamat: dudi.alamat || "",
                      status: dudi.status || "aktif"
                    });
                    setIsEditOpen(true);
                  }}
                  onDeleteClick={() => {
                    setDudiToDelete(dudi);
                    setIsDeleteOpen(true);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <DudiFormModal
        isOpen={isAddOpen}
        isEditMode={false}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSubmit}
        formData={formData}
        onFormDataChange={handleInputChange}
        submitting={submitting}
      />

      <DudiFormModal
        isOpen={isEditOpen}
        isEditMode={true}
        onClose={() => {
          setIsEditOpen(false);
          setDudiToEdit(null);
          resetForm();
        }}
        onSubmit={handleEditSubmit}
        formData={formData}
        onFormDataChange={handleInputChange}
        submitting={submitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDudiToDelete(null);
        }}
        onConfirm={handleDelete}
        dudiName={dudiToDelete?.nama_perusahaan || ""}
      />
    </div>
  );
}