// page.tsx
"use client"

import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagangStats } from "./magang-stats";
import { MagangTable } from "./magang-table";
import { MagangModal } from "./magang-modal";
import { useMagangActions } from "./use-magang-actions";

export default function ManajemenMagangGuru() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'tambah' | 'edit' | 'hapus'>('tambah');
  const [selectedData, setSelectedData] = useState<any>(null);

  const {
    siswaList,
    dudiList,
    currentUser,
    magangData,
    loading,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    handleFormChange,
    fetchMagangData,
    handleSave,
    stats
  } = useMagangActions();

  const openModal = (type: 'tambah' | 'edit' | 'hapus', data: any = null) => {
    setModalType(type);
    setSelectedData(data);
    
    if (type === 'edit' && data) {
      setFormData({
        siswa_id: String(data.siswa?.id || ""),
        dudi_id: String(data.dudi?.id || ""),
        tanggal_mulai: data.tanggal_mulai || "",
        tanggal_selesai: data.tanggal_selesai || "",
        status: data.status || "pending",
        nilai: data.nilai_akhir ? String(data.nilai_akhir) : ""
      });
    } else {
      setFormData({
        siswa_id: "",
        dudi_id: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        status: "pending",
        nilai: ""
      });
    }
    
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentGuruId = currentUser?.id;
    if (!currentGuruId) {
      toast.error("Sesi berakhir");
      return;
    }

    try {
      await handleSave(modalType, selectedData, formData, currentGuruId);
      
      toast.success(
        modalType === 'tambah' 
          ? "Berhasil menambahkan penempatan" 
          : modalType === 'edit' 
          ? "Data berhasil diperbarui"
          : "Data berhasil dihapus"
      );
      
      closeModal();
      fetchMagangData(currentGuruId);
    } catch (err: any) {
      toast.error("Gagal: " + err.message);
    }
  };

  return (
    <div className="space-y-8 relative">
      <Toaster position="top-right" richColors />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen Siswa Magang</h1>
          <p className="text-slate-500 mt-1">
            Halo, <b>{currentUser?.nama || "Guru"}</b>. Pantau progres bimbingan Anda.
          </p>
        </div>
        <Button 
          onClick={() => openModal("tambah")}
          className="bg-[#00A9C1] hover:bg-cyan-600 rounded-xl gap-2 shadow-lg py-6 px-6 text-sm font-bold"
        >
          <Plus size={20} /> Tambah Penempatan
        </Button>
      </div>

      {/* STATS */}
      <MagangStats stats={stats} />

      {/* TABLE */}
      <MagangTable 
        data={magangData}
        searchTerm={searchTerm}
        loading={loading}
        onSearch={setSearchTerm}
        onEdit={(data) => openModal('edit', data)}
        onDelete={(data) => openModal('hapus', data)}
      />

      {/* MODAL */}
      <MagangModal
        isOpen={modalOpen}
        type={modalType}
        selectedData={selectedData}
        formData={formData}
        siswaList={siswaList}
        dudiList={dudiList}
        currentUser={currentUser}
        onClose={closeModal}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}