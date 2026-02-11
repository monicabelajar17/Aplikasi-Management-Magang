"use client"

import React from "react";
import { Toaster, toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JurnalBanner } from "./jurnal-banner";
import { JurnalStats as JurnalStatsComponent } from "./jurnal-stats";
import { JurnalTable } from "./jurnal-table";
import { JurnalModal } from "./jurnal-modal";
import { useJurnalSiswa } from "./use-jurnal-siswa";

// ✅ PISAHKAN LOGIC
const isJournalClosed = () => {
  const now = new Date();
  const hour = now.getHours(); // 0–23
  const CLOSING_HOUR = 11;
  return hour >= CLOSING_HOUR;
};

export default function JurnalHarianSiswa() {
  const {
    filteredJurnals,
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

  const journalClosed = isJournalClosed();

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">
            Jurnal Harian Magang
          </h1>
          <p className="text-slate-500 mt-1">
            Catat aktivitas dan kendala selama pelaksanaan magang
          </p>
        </div>

        {/* ❌ TANPA disabled */}
        <Button
          onClick={() => {
            if (journalClosed) {
              toast.error(
                "Pengisian jurnal hanya dapat dilakukan sampai pukul 22.00 WIB"
              );
              return;
            }
            openModal("tambah");
          }}
          className={`rounded-xl gap-2 shadow-lg py-6 px-6 text-sm font-bold
            ${
              journalClosed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0A2659] hover:bg-[#1A3A79] text-white"
            }`}
        >
          <Plus size={20} /> Tambah Jurnal
        </Button>
      </div>

      {/* ✅ SATU BANNER, DINAMIS */}
      <JurnalBanner
        hasJournalToday={hasJournalToday}
        loading={loading}
        isClosed={journalClosed}
        onAddClick={() => {
          if (journalClosed) {
            toast.error(
              "Pengisian jurnal hanya dapat dilakukan sampai pukul 22.00 WIB"
            );
            return;
          }
          openModal("tambah");
        }}
      />

      <JurnalStatsComponent stats={stats} />

      <JurnalTable
        jurnals={filteredJurnals}
        loading={loading}
        onView={(jurnal) => openModal("view", jurnal)}
        onEdit={(jurnal) => openModal("edit", jurnal)}
        onDelete={(jurnal) => openModal("delete", jurnal)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

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
