// types.ts
export interface Siswa {
  id: number;
  nama: string;
  nis?: string;
  kelas?: string;
}

export interface Dudi {
  id: number;
  nama_perusahaan: string;
}

export interface MagangData {
  id: number;
  status: 'pending' | 'berlangsung' | 'selesai' | 'diterima' | 'ditolak';
  tanggal_mulai: string;
  tanggal_selesai: string;
  nilai_akhir: number | null;
  siswa?: Siswa;
  dudi?: Dudi;
}

export interface FormData {
  siswa_id: string;
  dudi_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  nilai: string;
}

export interface ModalState {
  isOpen: boolean;
  type: 'tambah' | 'edit' | 'hapus';
  selectedData: MagangData | null;
}

export interface StatsData {
  total: number;
  berlangsung: number;
  selesai: number;
  pending: number;
}

export interface StatCardProps {
  title: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
}

export interface MagangTableRowProps {
  data: {
    name: string;
    nis: string;
    dudi: string;
    status: string;
    score: number | null;
    mulai: string;
    selesai: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export interface MagangModalProps {
  isOpen: boolean;
  type: 'tambah' | 'edit' | 'hapus';
  selectedData: MagangData | null;
  formData: FormData;
  siswaList: Siswa[];
  dudiList: Dudi[];
  currentUser: any;
  onClose: () => void;
  onFormChange: (field: keyof FormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}