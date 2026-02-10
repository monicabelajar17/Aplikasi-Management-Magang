"use client"

import React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDudiSiswa } from "./use-dudi-siswa"
import DudiCard from "./dudi-cars"
import DudiModal from "./dudi-modal"
import DudiToast from "./dudi-toast"

export default function DudiSiswaPage() {
  const {
    dudiList,
    loading,
    selectedDudi,
    showToast,
    searchTerm,
    appliedIds,
    occupiedCounts,
    totalDaftar,
    handleDaftar,
    setSearchTerm,
    setSelectedDudi,
    setShowToast,
  } = useDudiSiswa()

  const filteredDudi = dudiList.filter((dudi) => {
    const nama = dudi.nama_perusahaan || ""
    const bidang = dudi.bidang_dudi || ""
    return (
      nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bidang.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-8 relative">
      {/* NOTIFIKASI BERHASIL */}
      <DudiToast show={showToast} onClose={() => setShowToast(false)} />

      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A2659]">Cari Tempat Magang</h1>
        <p className="text-slate-500 mt-1">Temukan mitra industri yang sesuai dengan bidang keahlianmu</p>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari perusahaan, bidang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 rounded-xl focus-visible:ring-cyan-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDudi.map((dudi) => (
            <DudiCard
              key={dudi.id}
              dudi={dudi}
              occupied={occupiedCounts[dudi.id] || 0}
              isApplied={appliedIds.includes(dudi.id)}
              totalDaftar={totalDaftar}
              onDetail={() => setSelectedDudi(dudi)}
              onDaftar={() => handleDaftar(dudi.id)}
            />
          ))}
        </div>
      )}

      {/* MODAL DETAIL */}
      {selectedDudi && (
        <DudiModal
          dudi={selectedDudi}
          isApplied={appliedIds.includes(selectedDudi.id)}
          totalDaftar={totalDaftar}
          onClose={() => setSelectedDudi(null)}
          onDaftar={() => handleDaftar(selectedDudi.id)}
        />
      )}
    </div>
  )
}