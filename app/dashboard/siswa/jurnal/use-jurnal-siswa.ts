"use client";

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
    mode: "tambah",
    selectedData: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "pending" | "diterima" | "ditolak">("all");
  const [hasJournalToday, setHasJournalToday] = useState(false);

  // ======================
  // GET SISWA ID (NUMBER!)
  // ======================
  const getSiswaId = useCallback((): number | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const siswaIdCookie = cookies.find((row) =>
      row.startsWith("siswa_id=")
    );
    if (!siswaIdCookie) return null;

    const value = Number(siswaIdCookie.split("=")[1]);
    return isNaN(value) ? null : value;
  }, []);

  // ======================
  // FETCH DATA
  // ======================
  const fetchData = useCallback(async () => {
    setLoading(true);

    const siswaId = getSiswaId();
    if (!siswaId) {
      setLoading(false);
      return;
    }

    try {
      // 🔹 ambil MAGANG TERAKHIR siswa
      const { data: magang, error: magangError } = await supabase
        .from("magang")
        .select("id")
        .eq("siswa_id", siswaId)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (magangError || !magang) {
        throw new Error("Magang tidak ditemukan");
      }

      // 🔹 ambil LOGBOOK
      const { data: logbook, error: logbookError } = await supabase
        .from("logbook")
        .select("*")
        .eq("magang_id", magang.id)
        .eq("is_deleted", false)
        .order("tanggal", { ascending: false });

      if (logbookError) throw logbookError;

      setJurnals(logbook ?? []);

      const today = new Date().toISOString().split("T")[0];
      setHasJournalToday(
        logbook?.some((j) => j.tanggal === today) ?? false
      );
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data jurnal");
      setJurnals([]);
    } finally {
      setLoading(false);
    }
  }, [getSiswaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ======================
  // STATS
  // ======================
  const stats: JurnalStats = {
    total: jurnals.length,
    disetujui: jurnals.filter(
      (j) => j.status_verifikasi === "diterima"
    ).length,
    pending: jurnals.filter(
      (j) => j.status_verifikasi === "pending"
    ).length,
    ditolak: jurnals.filter(
      (j) => j.status_verifikasi === "ditolak"
    ).length,
  };

  // ======================
  // FILTER
  // ======================
  const q = searchQuery.trim().toLowerCase();

  const filteredJurnals = jurnals.filter((j) => {
    const matchesSearch =
      q === "" ||
      j.kegiatan.toLowerCase().includes(q) ||
      (j.kendala?.toLowerCase() || "").includes(q);

    const matchesStatus =
      statusFilter === "all" ||
      j.status_verifikasi === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ======================
  // MODAL
  // ======================
  const openModal = (
    mode: ModalState["mode"],
    data: Jurnal | null = null
  ) => {
    setModalState({ isOpen: true, mode, selectedData: data });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: "tambah",
      selectedData: null,
    });
  };

  // ======================
  // SAVE (TAMBAH / EDIT)
  // ======================
  const handleSave = async (formData: FormJurnalData) => {
    setLoading(true);

    try {
      const siswaId = getSiswaId();
      if (!siswaId) throw new Error("Siswa tidak ditemukan");

      const { data: magang, error: magangError } = await supabase
        .from("magang")
        .select("id")
        .eq("siswa_id", siswaId)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (magangError || !magang) {
        throw new Error("Magang tidak ditemukan");
      }

      let finalFileUrl =
        formData.lampiran_url ||
        modalState.selectedData?.file ||
        "";

      // upload file jika ada
      if (formData.file) {
        const ext = formData.file.name.split(".").pop();
        const fileName = `${Date.now()}.${ext}`;
        const filePath = `jurnal/${fileName}`;

        const { error } = await supabase.storage
          .from("Gambar Alat")
          .upload(filePath, formData.file);

        if (error) throw error;

        const { data } = supabase.storage
          .from("Gambar Alat")
          .getPublicUrl(filePath);

        finalFileUrl = data.publicUrl;
      }

      const payload = {
        tanggal: formData.tanggal,
        kegiatan: formData.kegiatan,
        kendala: formData.kendala,
        file: finalFileUrl,
        status_verifikasi: "pending" as const,
      };

      if (modalState.mode === "edit" && modalState.selectedData) {
        await supabase
          .from("logbook")
          .update(payload)
          .eq("id", modalState.selectedData.id);

        toast.success("Jurnal diperbarui");
      } else {
        await supabase.from("logbook").insert([
          {
            ...payload,
            magang_id: magang.id,
            is_deleted: false,
          },
        ]);

        toast.success("Jurnal ditambahkan");
      }

      closeModal();
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async () => {
    if (!modalState.selectedData?.id) return;

    await supabase
      .from("logbook")
      .update({ is_deleted: true })
      .eq("id", modalState.selectedData.id);

    toast.success("Jurnal dihapus");
    closeModal();
    fetchData();
  };

  return {
    jurnals,
    filteredJurnals,
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
    refetch: fetchData,
  };
}
