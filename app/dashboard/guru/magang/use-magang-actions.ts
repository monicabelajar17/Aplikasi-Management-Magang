// use-magang-actions.ts
"use client"

import { useState, useEffect, useCallback } from "react";
import Cookies from 'js-cookie';
import { createClient } from "@/utils/supabase/client";
import { MagangData, Siswa, Dudi, FormData } from "./types";

const supabase = createClient();

export function useMagangActions() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [dudiList, setDudiList] = useState<Dudi[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [magangData, setMagangData] = useState<MagangData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<FormData>({
    siswa_id: "",
    dudi_id: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    status: "pending",
    nilai: ""
  });

  // Fetch initial data
  useEffect(() => {
    const getInitialData = async () => {
      const guruIdFromCookie = Cookies.get("guru_id");
      const fullNameFromCookie = Cookies.get("full_name");

      if (guruIdFromCookie) {
        const guruIdNumber = Number(guruIdFromCookie);
        setCurrentUser({ id: guruIdNumber, nama: fullNameFromCookie });
        await fetchMagangData(guruIdNumber);
        await fetchDropdownData();
      } else {
        setLoading(false);
      }
    };
    
    getInitialData();
  }, []);

  // Fetch dropdown data
  const fetchDropdownData = useCallback(async () => {
    try {
      const [siswaResult, dudiResult] = await Promise.all([
        supabase.from('siswa').select('id, nama'),
        supabase.from('dudi').select('id, nama_perusahaan')
      ]);

      setSiswaList(siswaResult.data || []);
      setDudiList(dudiResult.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  }, []);

  // Fetch magang data
  const fetchMagangData = useCallback(async (guruId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("magang")
        .select(`
          id, status, tanggal_mulai, tanggal_selesai, nilai_akhir,
          siswa ( id, nama, nis, kelas ), 
          dudi ( id, nama_perusahaan )
        `)
        .eq("guru_id", guruId);

      if (error) throw error;

      // Transform data dari Supabase
      const transformedData: MagangData[] = (data || []).map(item => {
        const siswa = Array.isArray(item.siswa) ? item.siswa[0] : item.siswa;
        const dudi = Array.isArray(item.dudi) ? item.dudi[0] : item.dudi;

        return {
          id: item.id,
          status: item.status,
          tanggal_mulai: item.tanggal_mulai,
          tanggal_selesai: item.tanggal_selesai,
          nilai_akhir: item.nilai_akhir,
          siswa: siswa ? {
            id: siswa.id,
            nama: siswa.nama,
            nis: siswa.nis,
            kelas: siswa.kelas
          } : undefined,
          dudi: dudi ? {
            id: dudi.id,
            nama_perusahaan: dudi.nama_perusahaan
          } : undefined
        };
      });

      setMagangData(transformedData);
    } catch (error) {
      console.error("Error fetching magang data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form data change
  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle save (CRUD operations)
  const handleSave = async (
    type: 'tambah' | 'edit' | 'hapus',
    selectedData: MagangData | null,
    formData: FormData,
    currentGuruId: number
  ): Promise<boolean> => {
    try {
      const payload = {
        siswa_id: Number(formData.siswa_id),
        dudi_id: Number(formData.dudi_id),
        guru_id: Number(currentGuruId),
        tanggal_mulai: formData.tanggal_mulai || null,
        tanggal_selesai: formData.tanggal_selesai || null,
        status: formData.status,
        nilai_akhir: formData.nilai ? Number(formData.nilai) : null
      };

      if (type === 'tambah') {
        const { error } = await supabase.from('magang').insert([payload]);
        if (error) throw error;
      } else if (type === 'edit' && selectedData) {
        const { error } = await supabase.from('magang').update(payload).eq('id', selectedData.id);
        if (error) throw error;
      } else if (type === 'hapus' && selectedData) {
        const { error } = await supabase.from('magang').delete().eq('id', selectedData.id);
        if (error) throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Save error:", error);
      throw error;
    }
  };

  // Calculate statistics
  const stats = {
    total: magangData.length,
    berlangsung: magangData.filter(m => m.status === 'berlangsung').length,
    selesai: magangData.filter(m => m.status === 'selesai').length,
    pending: magangData.filter(m => m.status === 'pending').length
  };

  // Filter data based on search term
  const filteredData = magangData.filter(m => 
    m.siswa?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.dudi?.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    siswaList,
    dudiList,
    currentUser,
    magangData: filteredData,
    loading,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    handleFormChange,
    fetchMagangData: (guruId: number) => fetchMagangData(guruId),
    handleSave,
    stats
  };
}