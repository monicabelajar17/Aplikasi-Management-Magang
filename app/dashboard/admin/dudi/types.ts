//Untuk menyimpan definisi interface (misal: data DUDI, tipe Toast).
export interface Dudi {
  id: string;
  nama_perusahaan: string;
  email: string;
  telepon: string;
  penanggung_jawab: string;
  alamat: string;
  status: 'aktif' | 'nonaktif';
  is_deleted: boolean;
  magang?: Magang[];
  jumlah_siswa?: number;
}

export interface Magang {
  id: string;
  status: string;
}

export interface ToastState {
  show: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
}

export interface DudiFormData {
  nama_perusahaan: string;
  email: string;
  telepon: string;
  penanggung_jawab: string;
  alamat: string;
  status: 'aktif' | 'nonaktif';
}

export interface StatCardProps {
  title: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
}

export interface TableRowProps {
  dudi: Dudi;
  onEditClick: () => void;
  onDeleteClick: () => void;
}