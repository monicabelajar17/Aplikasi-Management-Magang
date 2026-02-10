// actions.ts
import { createClient } from "@/utils/supabase/client";
import { DashboardStats, MagangData, DropdownData } from "./types";

const supabase = createClient();

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      { count: total },
      { count: pend },
      { count: acc },
      { count: rej }
    ] = await Promise.all([
      supabase.from('siswa').select('*', { count: 'exact', head: true }),
      supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'diterima'),
      supabase.from('magang').select('*', { count: 'exact', head: true }).eq('status', 'ditolak')
    ]);

    return {
      totalSiswa: total || 0,
      pending: pend || 0,
      diterima: acc || 0,
      ditolak: rej || 0
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}

// actions.ts - Perbaikan fetchMagangData()
export async function fetchMagangData(): Promise<MagangData[]> {
  try {
    const { data, error } = await supabase
      .from('magang')
      .select(`
        id,
        status,
        siswa ( id, nama, kelas ),
        dudi ( id, nama_perusahaan ),
        guru ( id, nama )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform data dari Supabase ke format yang kita butuhkan
    const transformedData = (data || []).map(item => {
      // Supabase mengembalikan array untuk relasi, ambil elemen pertama
      const siswaData = Array.isArray(item.siswa) ? item.siswa[0] : item.siswa;
      const dudiData = Array.isArray(item.dudi) ? item.dudi[0] : item.dudi;
      const guruData = Array.isArray(item.guru) ? item.guru[0] : item.guru;

      return {
        id: item.id as number,
        status: item.status as MagangData['status'],
        siswa: siswaData ? {
          id: Number(siswaData.id),
          nama: String(siswaData.nama || ''),
          kelas: String(siswaData.kelas || '')
        } : undefined,
        dudi: dudiData ? {
          id: Number(dudiData.id),
          nama_perusahaan: String(dudiData.nama_perusahaan || '')
        } : undefined,
        guru: guruData ? {
          id: Number(guruData.id),
          nama: String(guruData.nama || '')
        } : undefined
      };
    });

    return transformedData;
  } catch (error) {
    console.error("Error fetching magang data:", error);
    throw error;
  }
}

export async function fetchDropdownData(): Promise<DropdownData> {
  try {
    const [
      { data: siswa },
      { data: dudi },
      { data: guru }
    ] = await Promise.all([
      supabase.from('siswa').select('id, nama'),
      supabase.from('dudi').select('id, nama_perusahaan'),
      supabase.from('guru').select('id, nama')
    ]);

    return {
      siswa: siswa || [],
      dudi: dudi || [],
      guru: guru || []
    };
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    throw error;
  }
}

export async function addMagang(formData: any): Promise<void> {
  const { error } = await supabase
    .from('magang')
    .insert([{
      siswa_id: formData.siswa_id,
      dudi_id: formData.dudi_id,
      guru_id: formData.guru_id,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      status: formData.status
    }]);

  if (error) throw error;
}

export async function updateMagangGuru(id: number, guruId: string): Promise<void> {
  const { error } = await supabase
    .from('magang')
    .update({ guru_id: guruId })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteMagang(id: number): Promise<void> {
  const { error } = await supabase
    .from('magang')
    .delete()
    .eq('id', id);

  if (error) throw error;
}