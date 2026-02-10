// use-jurnal-siswa.ts
"use client"

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Jurnal, JurnalStats, ModalState, FormJurnalData } from "./types";

const supabase = createClient();

export function useJurnalSiswa() {
  const [jurnals, setJurnals] = useState<Jurnal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'tambah',
    selectedData: null
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [hasJournalToday, setHasJournalToday] = useState(true);

  // Get siswa ID from cookie
  const getSiswaId = useCallback((): string | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split('; ');
    const siswaIdCookie = cookies.find(row => row.startsWith('siswa_id='));
    return siswaIdCookie ? siswaIdCookie.split('=')[1] : null;
  }, []);

  // Fetch jurnal data
  const fetchData = useCallback(async () => {
    setLoading(true);
    const loggedInSiswaId = getSiswaId();

    if (!loggedInSiswaId) {
      setLoading(false);
      return;
    }

    try {
      // Get magang ID for this siswa
      const { data: magangData, error: magangError } = await supabase
        .from('magang')
        .select('id')
        .eq('siswa_id', loggedInSiswaId)
        .single();

      if (magangError || !magangData) {
        setJurnals([]);
        setLoading(false);
        return;
      }

      // Get jurnals for this magang
      const { data: logbookData, error: logbookError } = await supabase
        .from('logbook')
        .select('*')
        .eq('magang_id', magangData.id)
        .eq('is_deleted', false)
        .order('tanggal', { ascending: false });

      if (!logbookError && logbookData) {
        setJurnals(logbookData);
        
        // Check if there's a journal for today
        const today = new Date().toISOString().split('T')[0];
        const foundToday = logbookData.some(j => j.tanggal === today);
        setHasJournalToday(!!foundToday);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Gagal memuat data jurnal");
    } finally {
      setLoading(false);
    }
  }, [getSiswaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate statistics
  const stats: JurnalStats = {
    total: jurnals.length,
    disetujui: jurnals.filter(j => j.status_verifikasi === 'diterima').length,
    pending: jurnals.filter(j => j.status_verifikasi === 'pending').length,
    ditolak: jurnals.filter(j => j.status_verifikasi === 'ditolak').length
  };

  // Handle modal actions
  const openModal = (mode: ModalState['mode'], data: Jurnal | null = null) => {
    setModalState({
      isOpen: true,
      mode,
      selectedData: data
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'tambah',
      selectedData: null
    });
  };

  // Handle save (tambah/edit)
  const handleSave = async (formData: FormJurnalData) => {
    setLoading(true);
    try {
      let finalFileUrl = formData.lampiran_url || (modalState.selectedData ? modalState.selectedData.file : "");

      // Upload file if exists
      if (formData.file) {
        const file = formData.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `jurnal/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('Gambar Alat')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('Gambar Alat')
          .getPublicUrl(filePath);
        
        finalFileUrl = publicUrl;
      }

      // Prepare payload
      const payload = {
        tanggal: formData.tanggal,
        kegiatan: formData.kegiatan,
        kendala: formData.kendala,
        file: finalFileUrl,
        status_verifikasi: 'pending' as const
      };

      if (modalState.mode === "edit" && modalState.selectedData) {
        const { error } = await supabase
          .from('logbook')
          .update(payload)
          .eq('id', modalState.selectedData.id);
        
        if (error) throw error;
        toast.success("Jurnal berhasil diperbarui!");
      } else {
        // For new jurnal, get magang_id
        const siswaId = getSiswaId();
        if (!siswaId) throw new Error("Siswa tidak ditemukan");

        const { data: magang } = await supabase
          .from('magang')
          .select('id')
          .eq('siswa_id', siswaId)
          .single();

        if (!magang) throw new Error("Data magang tidak ditemukan");

        const { error } = await supabase.from('logbook').insert([{
          ...payload,
          magang_id: magang.id,
          is_deleted: false
        }]);
        
        if (error) throw error;
        toast.success("Jurnal baru berhasil ditambahkan!");
      }

      closeModal();
      fetchData();
    } catch (error: any) {
      toast.error("Gagal: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!modalState.selectedData?.id) return;
    
    try {
      const { error } = await supabase
        .from('logbook')
        .update({ is_deleted: true })
        .eq('id', modalState.selectedData.id);
      
      if (error) throw error;
      
      toast.success("Jurnal berhasil dihapus");
      closeModal();
      fetchData();
    } catch (error: any) {
      toast.error("Gagal menghapus: " + error.message);
    }
  };

  // Filter jurnals
  const filteredJurnals = jurnals.filter(j => {
    const matchesSearch = j.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (j.kendala?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua Status" || j.status_verifikasi === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return {
    jurnals: filteredJurnals,
    loading,
    modalState,
    stats,
    hasJournalToday,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    openModal,
    closeModal,
    handleSave,
    handleDelete,
    refetch: fetchData
  };
}