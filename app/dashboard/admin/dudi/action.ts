//Berisi semua fungsi yang berinteraksi dengan Supabase (fetchDudi, handleDelete, handleAdd, handleEdit).
import { createClient } from "@/utils/supabase/client";
import { Dudi, DudiFormData } from "./types";

const supabase = createClient();

export async function fetchDudi() {
  const { data, error } = await supabase
    .from('dudi')
    .select(`
      *,
      magang (
        id,
        status
      )
    `)
    .eq('is_deleted', false)
    .order('nama_perusahaan', { ascending: true });

  if (error) {
    console.error("Error fetch DUDI:", error.message);
    throw error;
  }

  if (data) {
    const formattedData = data.map(dudi => {
      const aktifMagang = (dudi.magang || []).filter(
        (m: any) => m.status?.toLowerCase().trim() === 'berlangsung'
      );

      return {
        ...dudi,
        jumlah_siswa: aktifMagang.length
      };
    });

    return formattedData;
  }

  return [];
}

export async function addDudi(formData: DudiFormData) {
  const { data, error } = await supabase
    .from('dudi')
    .insert([{
      nama_perusahaan: formData.nama_perusahaan,
      email: formData.email,
      telepon: formData.telepon,
      penanggung_jawab: formData.penanggung_jawab,
      alamat: formData.alamat,
      status: formData.status,
      is_deleted: false
    }])
    .select();

  if (error) throw error;
  return data;
}

export async function updateDudi(id: string, formData: DudiFormData) {
  const { error } = await supabase
    .from('dudi')
    .update({
      nama_perusahaan: formData.nama_perusahaan,
      email: formData.email,
      telepon: formData.telepon,
      penanggung_jawab: formData.penanggung_jawab,
      alamat: formData.alamat,
      status: formData.status
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteDudi(id: string) {
  const { error } = await supabase
    .from('dudi')
    .update({ is_deleted: true })
    .eq('id', id);

  if (error) throw error;
}

export function validateDudiForm(formData: DudiFormData): string | null {
  if (!formData.nama_perusahaan.trim()) {
    return 'Nama perusahaan harus diisi';
  }
  
  if (!formData.email.trim()) {
    return 'Email harus diisi';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return 'Format email tidak valid';
  }
  
  if (!formData.telepon.trim()) {
    return 'Telepon harus diisi';
  }
  
  if (!formData.penanggung_jawab.trim()) {
    return 'Penanggung jawab harus diisi';
  }
  
  return null;
}