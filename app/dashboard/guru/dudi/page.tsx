// page.tsx
"use client"

import React from "react";
import { DudiStats } from "./dudi-stats";
import { DudiTable } from "./dudi-table";
import { useDudiData } from "./use-dudi-data";

export default function DudiGuruPage() {
  const { dudiList, stats, loading, searchTerm, setSearchTerm } = useDudiData();

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen DUDI</h1>
        <p className="text-slate-500 mt-1">Daftar Dunia Usaha & Industri mitra aktif</p>
      </div>

      {/* STATS GRID */}
      <DudiStats stats={stats} />

      {/* TABLE SECTION */}
      <DudiTable 
        data={dudiList}
        searchTerm={searchTerm}
        loading={loading}
        onSearch={setSearchTerm}
      />
    </div>
  );
}