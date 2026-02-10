// types.ts
export interface DashboardStats {
  totalSiswa: number;
  totalDudi: number;
  siswaMagang: number;
  logbookToday: number;
}

export interface RecentMagang {
  id: number;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  siswa?: {
    nama: string;
    guru_id: number;
  };
  dudi?: {
    nama_perusahaan: string;
  };
}

export interface RecentLogbook {
  id: number;
  kegiatan: string;
  tanggal: string;
  status_verifikasi: string;
  kendala: string;
  magang?: {
    siswa?: {
      nama: string;
      guru_id: number;
    };
  };
}

export interface ActiveDudi {
  id: number;
  nama_perusahaan: string;
  alamat: string;
  siswa_count: number;
}

export interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}

export interface ListMemberProps {
  name: string;
  company: string;
  date: string;
  badge: string;
}

export interface LogbookItemProps {
  studentName: string;
  title: string;
  date: string;
  status: string;
  statusColor: string;
  kendala: string;
}

export interface DudiItemProps {
  name: string;
  address: string;
  count: number;
}