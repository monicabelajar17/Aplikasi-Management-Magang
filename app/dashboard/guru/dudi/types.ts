// types.ts
export interface Dudi {
  id: number;
  nama_perusahaan: string;
  alamat: string;
  email: string;
  telepon: string;
  penanggung_jawab: string;
  siswa_count: number;
}

export interface DashboardStats {
  totalDudi: number;
  totalSiswaAktif: number;
  rataRata: string;
}

export interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}

export interface TableRowProps {
  company: string;
  address: string;
  email: string;
  phone: string;
  pic: string;
  count: number;
}

export interface DudiStatsProps {
  stats: DashboardStats;
}

export interface DudiTableProps {
  data: Dudi[];
  searchTerm: string;
  loading: boolean;
  onSearch: (term: string) => void;
}