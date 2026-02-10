// use-dudi-data.ts
"use client"

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Dudi, DashboardStats } from "./types";

export function useDudiData() {
  const supabase = createClient();
  const [dudiList, setDudiList] = useState<Dudi[]>([]);
  const [guruId, setGuruId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fungsi untuk mendapatkan cookie
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="));
    return match ? match.split("=")[1] : null;
  };

  // Fetch data DUDI
  const fetchDudi = useCallback(async () => {
    if (!guruId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("dudi")
        .select(`
          id,
          nama_perusahaan,
          alamat,
          email,
          telepon,
          penanggung_jawab,
          magang!inner (
            id,
            status,
            siswa!inner ( guru_id )
          )
        `)
        .eq("magang.status", "berlangsung")
        .eq("magang.siswa.guru_id", guruId)
        .eq("is_deleted", false);

      if (error) throw error;

      const formatted = (data || []).map((dudi: any) => ({
        id: dudi.id,
        nama_perusahaan: dudi.nama_perusahaan,
        alamat: dudi.alamat,
        email: dudi.email,
        telepon: dudi.telepon,
        penanggung_jawab: dudi.penanggung_jawab,
        siswa_count: dudi.magang?.length || 0
      }));

      setDudiList(formatted);
    } catch (error) {
      console.error("Error fetching DUDI data:", error);
    } finally {
      setLoading(false);
    }
  }, [guruId, supabase]);

  // Set guruId dari cookie
  useEffect(() => {
    const cookie = getCookie("guru_id");
    if (!cookie) return;

    const id = parseInt(cookie);
    if (!isNaN(id)) {
      setGuruId(id);
    }
  }, []);

  // Fetch data ketika guruId tersedia
  useEffect(() => {
    if (guruId) {
      fetchDudi();
    }
  }, [guruId, fetchDudi]);

  // Filter data berdasarkan search term
  const filteredDudi = dudiList.filter((dudi) =>
    dudi.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dudi.penanggung_jawab && dudi.penanggung_jawab.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (dudi.alamat && dudi.alamat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Hitung statistik
  const stats: DashboardStats = {
    totalDudi: dudiList.length,
    totalSiswaAktif: dudiList.reduce((total, dudi) => total + dudi.siswa_count, 0),
    rataRata: dudiList.length > 0
      ? Math.round(dudiList.reduce((total, dudi) => total + dudi.siswa_count, 0) / dudiList.length).toString()
      : "0"
  };

  return {
    dudiList: filteredDudi,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    refetch: fetchDudi
  };
}