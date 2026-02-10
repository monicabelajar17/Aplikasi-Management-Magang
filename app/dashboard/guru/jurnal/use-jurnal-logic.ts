// use-jurnal-logic.ts
"use client"

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getJurnalData, verifikasiJurnal } from "./action";
import { JurnalData } from "./types";

export function useJurnalLogic() {
  const [jurnals, setJurnals] = useState<JurnalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJurnal, setSelectedJurnal] = useState<JurnalData | null>(null);
  const [catatan, setCatatan] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await getJurnalData();
    if (res.error) toast.error(res.error);
    
    // Transform data dari Supabase
    const transformedData: JurnalData[] = (res.data || []).map(item => {
      const magangSiswa = Array.isArray(item.magang) ? item.magang[0] : item.magang;
      const siswa = magangSiswa?.siswa 
        ? (Array.isArray(magangSiswa.siswa) ? magangSiswa.siswa[0] : magangSiswa.siswa)
        : undefined;

      return {
        id: item.id,
        tanggal: item.tanggal,
        kegiatan: item.kegiatan,
        kendala: item.kendala,
        file: item.file,
        status_verifikasi: item.status_verifikasi,
        catatan_guru: item.catatan_guru,
        magang: siswa ? {
          siswa: {
            nama: siswa.nama,
            nis: siswa.nis,
            kelas: siswa.kelas
          }
        } : undefined
      };
    });
    
    setJurnals(transformedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle verifikasi
  const handleVerifikasi = async (status: 'diterima' | 'ditolak') => {
    if (!selectedJurnal) return;
    setIsProcessing(true);
    
    const res = await verifikasiJurnal(selectedJurnal.id, status, catatan);
    
    if (res.success) {
      toast.success(`Jurnal berhasil ${status === 'diterima' ? 'disetujui' : 'ditolak'}`);
      setModalOpen(false);
      loadData();
    } else {
      toast.error(res.error);
    }
    setIsProcessing(false);
  };

  // Handle download
  const handleDownload = useCallback(async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split('/').pop() || 'dokumentasi-jurnal';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  }, []);

  // Calculate stats
  const stats = {
    total: jurnals.length,
    pending: jurnals.filter(j => j.status_verifikasi === 'pending').length,
    diterima: jurnals.filter(j => j.status_verifikasi === 'diterima').length,
    ditolak: jurnals.filter(j => j.status_verifikasi === 'ditolak').length
  };

  // Open modal
  const openModal = (jurnal: JurnalData) => {
    setSelectedJurnal(jurnal);
    setCatatan(jurnal.catatan_guru || "");
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedJurnal(null);
    setCatatan("");
  };

  return {
    jurnals,
    loading,
    modalOpen,
    selectedJurnal,
    catatan,
    isProcessing,
    stats,
    loadData,
    openModal,
    closeModal,
    setCatatan,
    handleVerifikasi,
    handleDownload
  };
}