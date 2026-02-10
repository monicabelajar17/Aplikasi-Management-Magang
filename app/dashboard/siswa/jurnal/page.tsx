// page.tsx
"use client"

import React from "react";
import { Toaster } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JurnalBanner } from "./jurnal-banner";
import { JurnalStats as JurnalStatsComponent } from "./jurnal-stats";
import { JurnalTable } from "./jurnal-table";
import { JurnalModal } from "./jurnal-modal";
import { useJurnalSiswa } from "./use-jurnal-siswa";

export default function JurnalHarianSiswa() {
  const {
    jurnals,
    loading,
    modalState,
    stats,
    hasJournalToday,
    searchQuery,
    setSearchQuery,
    openModal,
    closeModal,
    handleSave,
    handleDelete
  } = useJurnalSiswa();

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Jurnal Harian Magang</h1>
          <p className="text-slate-500 mt-1">Catat aktivitas dan kendala selama pelaksanaan magang</p>
        </div>
        <Button 
          onClick={() => openModal('tambah')}
          className="bg-[#0A2659] hover:bg-[#1A3A79] text-white rounded-xl gap-2 shadow-lg shadow-cyan-100 py-6 px-6 text-sm font-bold"
        >
          <Plus size={20} /> Tambah Jurnal
        </Button>
      </div>

      {/* BANNER SECTION */}
      <JurnalBanner 
        hasJournalToday={hasJournalToday}
        loading={loading}
        onAddClick={() => openModal('tambah')}
      />

      {/* STATS SECTION */}
      <JurnalStatsComponent stats={stats} />

      {/* TABLE SECTION */}
      <JurnalTable 
        jurnals={jurnals}
        loading={loading}
        onView={(jurnal) => openModal('view', jurnal)}
        onEdit={(jurnal) => openModal('edit', jurnal)}
        onDelete={(jurnal) => openModal('delete', jurnal)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* MODAL SECTION */}
      <JurnalModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        data={modalState.selectedData}
        onConfirmDelete={handleDelete}
        onSave={handleSave}
      />
    </div>
  );
}