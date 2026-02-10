// page.tsx
"use client"

import React from "react";
import { Toaster } from "sonner";
import { JurnalStats } from "./jurnal-stats";
import { JurnalTable } from "./jurnal-table";
import { JurnalModal } from "./jurnal-modal";
import { useJurnalLogic } from "./use-jurnal-logic";

export default function ManajemenJurnalGuru() {
  const {
    jurnals,
    loading,
    modalOpen,
    selectedJurnal,
    catatan,
    isProcessing,
    stats,
    openModal,
    closeModal,
    setCatatan,
    handleVerifikasi,
    handleDownload
  } = useJurnalLogic();

  return (
    <div className="space-y-8 relative">
      <Toaster position="top-right" richColors />
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen Jurnal Harian Magang</h1>
        <p className="text-slate-500 mt-1">Verifikasi dan berikan feedback pada laporan aktivitas harian siswa</p>
      </div>

      {/* STATS GRID */}
      <JurnalStats stats={stats} />

      {/* TABLE SECTION */}
      <JurnalTable 
        data={jurnals}
        loading={loading}
        onView={openModal}
      />

      {/* MODAL */}
      <JurnalModal
        isOpen={modalOpen}
        selectedJurnal={selectedJurnal}
        catatan={catatan}
        isProcessing={isProcessing}
        onClose={closeModal}
        onCatatanChange={setCatatan}
        onVerifikasi={handleVerifikasi}
        onDownload={handleDownload}
      />
    </div>
  );
}