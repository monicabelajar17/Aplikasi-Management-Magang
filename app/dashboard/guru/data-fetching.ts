// data-fetching.ts
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { 
  RecentMagang, 
  RecentLogbook, 
  ActiveDudi,
  DashboardStats 
} from "./types";

// Helper function untuk menangani data relasi dari Supabase
function extractFirst<T>(data: any): T | undefined {
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as T;
  }
  return data as T | undefined;
}

export async function getGuruId() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  
  const guruId = Number(cookieStore.get("guru_id")?.value);
  
  if (!guruId) {
    throw new Error("Guru belum login");
  }
  
  return guruId;
}

export async function getDashboardStats(guruId: number): Promise<DashboardStats> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Total Siswa
    const { count: totalSiswa } = await supabase
      .from('siswa')
      .select('*', { count: 'exact', head: true })
      .eq('guru_id', guruId);

    // 2. Total DUDI
    const { data: dudiData } = await supabase
      .from("magang")
      .select(`
        dudi_id,
        siswa!inner ( guru_id )
      `)
      .eq("siswa.guru_id", guruId);

    const totalDudi = new Set(dudiData?.map(d => d.dudi_id)).size;

    // 3. Siswa Magang Aktif
    const { count: siswaMagang } = await supabase
      .from("magang")
      .select(`
        id,
        siswa!inner ( guru_id )
      `, { count: "exact", head: true })
      .eq("status", "berlangsung")
      .eq("siswa.guru_id", guruId);

    // 4. Logbook Hari Ini
    const { count: logbookToday } = await supabase
      .from("logbook")
      .select(`
        id,
        magang!inner (
          siswa!inner ( guru_id )
        )
      `, { count: "exact", head: true })
      .eq("tanggal", today)
      .eq("magang.siswa.guru_id", guruId);

    return {
      totalSiswa: totalSiswa || 0,
      totalDudi: totalDudi || 0,
      siswaMagang: siswaMagang || 0,
      logbookToday: logbookToday || 0
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalSiswa: 0,
      totalDudi: 0,
      siswaMagang: 0,
      logbookToday: 0
    };
  }
}

export async function getRecentMagang(guruId: number): Promise<RecentMagang[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("magang")
      .select(`
        id,
        status,
        tanggal_mulai,
        tanggal_selesai,
        siswa!inner ( nama, guru_id ),
        dudi ( nama_perusahaan )
      `)
      .eq("siswa.guru_id", guruId)
      .order("created_at", { ascending: false })
      .limit(2);

    if (error) throw error;

    // Transform data Supabase ke format yang kita inginkan
    const transformedData: RecentMagang[] = (data || []).map(item => {
      const siswa = extractFirst<{ nama: string; guru_id: number }>(item.siswa);
      const dudi = extractFirst<{ nama_perusahaan: string }>(item.dudi);

      return {
        id: item.id as number,
        status: item.status as string,
        tanggal_mulai: item.tanggal_mulai as string,
        tanggal_selesai: item.tanggal_selesai as string,
        siswa: siswa ? {
          nama: String(siswa.nama || ''),
          guru_id: Number(siswa.guru_id || 0)
        } : undefined,
        dudi: dudi ? {
          nama_perusahaan: String(dudi.nama_perusahaan || '')
        } : undefined
      };
    });

    return transformedData;
  } catch (error) {
    console.error("Error fetching recent magang:", error);
    return [];
  }
}

export async function getRecentLogbooks(guruId: number): Promise<RecentLogbook[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("logbook")
      .select(`
        id,
        kegiatan,
        tanggal,
        status_verifikasi,
        kendala,
        magang!inner (
          siswa!inner ( nama, guru_id )
        )
      `)
      .eq("magang.siswa.guru_id", guruId)
      .order("created_at", { ascending: false })
      .limit(2);

    if (error) throw error;

    const transformedData: RecentLogbook[] = (data || []).map(item => {
      const magangSiswa = extractFirst<{ siswa?: { nama: string; guru_id: number } }>(item.magang);
      const siswa = magangSiswa?.siswa 
        ? extractFirst<{ nama: string; guru_id: number }>(magangSiswa.siswa)
        : undefined;

      return {
        id: item.id as number,
        kegiatan: item.kegiatan as string,
        tanggal: item.tanggal as string,
        status_verifikasi: item.status_verifikasi as string,
        kendala: item.kendala as string,
        magang: siswa ? {
          siswa: {
            nama: String(siswa.nama || ''),
            guru_id: Number(siswa.guru_id || 0)
          }
        } : undefined
      };
    });

    return transformedData;
  } catch (error) {
    console.error("Error fetching recent logbooks:", error);
    return [];
  }
}

export async function getActiveDudi(guruId: number): Promise<ActiveDudi[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("dudi")
      .select(`
        id,
        nama_perusahaan,
        alamat,
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

    const transformedData: ActiveDudi[] = (data || []).map(d => ({
      id: d.id as number,
      nama_perusahaan: d.nama_perusahaan as string,
      alamat: d.alamat as string,
      siswa_count: Array.isArray(d.magang) ? d.magang.length : 0
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching active DUDI:", error);
    return [];
  }
}