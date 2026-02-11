// page.tsx
"use client"

import React, { useState, useEffect } from "react";
import { Users, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { StatCard } from "./stat-cards";
import { MagangTable } from "./magang-table";
import { MagangModal } from "./magang-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { Toast } from "./toast";
import { 
  fetchDashboardStats, 
  fetchMagangData, 
  fetchDropdownData, 
  addMagang, 
  updateMagangGuru, 
  deleteMagang 
} from "./action";
import { 
  DashboardStats, 
  MagangData, 
  DropdownData, 
  MagangFormData, 
  ToastState 
} from "./types";

export default function DashboardAdminPage() {
  // State utama
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalSiswa: 0,
    pending: 0,
    diterima: 0,
    ditolak: 0
  });
  
  const [magangData, setMagangData] = useState<MagangData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Data states
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: ""
  });

  // Form state
  const [formData, setFormData] = useState<MagangFormData>({
    siswa_id: "",
    guru_id: "",
    dudi_id: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    status: "pending"
  });

  // Dropdown Data
  const [dropdowns, setDropdowns] = useState<DropdownData>({
    siswa: [],
    dudi: [],
    guru: []
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  // page.tsx - Ubah loadDashboardData menjadi seperti ini:
const loadDashboardData = async () => {
  setLoading(true);
  try {
    const [statsData, magangData, dropdownData] = await Promise.all([
      fetchDashboardStats(),
      fetchMagangData(),
      fetchDropdownData() 
    ]);
    
    setStats(statsData);
    setMagangData(magangData);
    setDropdowns(dropdownData); // Data guru masuk ke sini
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  } finally {
    setLoading(false);
  }
};

  // Fetch dropdown data for modal
  const loadDropdownData = async () => {
    try {
      const data = await fetchDropdownData();
      setDropdowns(data);
    } catch (error) {
      console.error("Error loading dropdown data:", error);
    }
  };

  // Toast handler
  const showToast = (message: string) => {
    setToast({ show: true, message });
  };

  // Form handlers
  const handleFormChange = (field: keyof MagangFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && selectedId) {
        await updateMagangGuru(selectedId, formData.guru_id);
        showToast("Guru pembimbing berhasil diperbarui");
      } else {
        await addMagang(formData);
        showToast("Data magang berhasil ditambahkan");
      }
      
      closeModal();
      await loadDashboardData();
    } catch (error: any) {
      console.error("Error saving data:", error);
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMagang(deleteId);
      showToast("Data magang berhasil dihapus");
      setIsDeleteOpen(false);
      setDeleteId(null);
      await loadDashboardData();
    } catch (error: any) {
      console.error("Error deleting data:", error);
      alert("Gagal menghapus data");
    }
  };

  // Modal handlers
  const openAddModal = async () => {
    await loadDropdownData();
    setIsEditMode(false);
    setFormData({
      siswa_id: "",
      guru_id: "",
      dudi_id: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      status: "pending"
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (magang: MagangData) => {
    await loadDropdownData();
    setIsEditMode(true);
    setSelectedId(magang.id);
    setFormData({
      siswa_id: String(magang.siswa?.id || ""),
      guru_id: String(magang.guru?.id || ""),
      dudi_id: String(magang.dudi?.id || ""),
      tanggal_mulai: "",
      tanggal_selesai: "",
      status: "pending"
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedId(null);
    setFormData({
      siswa_id: "",
      guru_id: "",
      dudi_id: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      status: "pending"
    });
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  if (loading && magangData.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen Magang</h1>
        <p className="text-slate-500 mt-1">Kelola pendaftaran dan statistik real-time</p>
      </div>

      {/* 2. CARD STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Siswa" 
          value={stats.totalSiswa} 
          icon={<Users className="text-blue-600" />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          icon={<Clock className="text-amber-600" />} 
          color="bg-amber-50" 
        />
        <StatCard 
          title="Diterima" 
          value={stats.diterima} 
          icon={<CheckCircle className="text-emerald-600" />} 
          color="bg-emerald-50" 
        />
        <StatCard 
          title="Ditolak" 
          value={stats.ditolak} 
          icon={<XCircle className="text-rose-600" />} 
          color="bg-rose-50" 
        />
      </div>

      {/* 3. TABEL DATA MAGANG */}
      <MagangTable 
        data={magangData}
        searchTerm={searchTerm}
        loading={loading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onSearch={setSearchTerm}
        onAddNew={openAddModal}
      />

      {/* MODALS */}
      <MagangModal
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        dropdowns={dropdowns}
        onFormChange={handleFormChange}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
      />

      {/* TOAST NOTIFICATION */}
      <Toast toast={toast} />
    </div>
  );
}