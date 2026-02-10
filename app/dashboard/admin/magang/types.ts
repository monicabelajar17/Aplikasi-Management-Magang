// types.ts
export interface DashboardStats {
  totalSiswa: number;
  pending: number;
  diterima: number;
  ditolak: number;
}

export interface MagangData {
  id: number;
  status: 'pending' | 'diterima' | 'ditolak' | 'berlangsung' | 'selesai' | 'dibatalkan';
  siswa?: {
    id: number;
    nama: string;
    kelas: string;
  };
  dudi?: {
    id: number;
    nama_perusahaan: string;
  };
  guru?: {
    id: number;
    nama: string;
  };
}

export interface DropdownData {
  siswa: Array<{ id: number; nama: string }>;
  dudi: Array<{ id: number; nama_perusahaan: string }>;
  guru: Array<{ id: number; nama: string }>;
}

export interface MagangFormData {
  siswa_id: string;
  guru_id: string;
  dudi_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export interface MagangTableProps {
  data: MagangData[];
  searchTerm: string;
  loading: boolean;
  onEdit: (magang: MagangData) => void;
  onDelete: (id: number) => void;
  onSearch: (term: string) => void;
  onAddNew: () => void;
}

export interface MagangModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: MagangFormData;
  dropdowns: DropdownData;
  onFormChange: (field: keyof MagangFormData, value: string) => void;
  loading?: boolean;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ToastState {
  show: boolean;
  message: string;
}