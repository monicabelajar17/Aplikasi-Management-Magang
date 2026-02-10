// types.ts
export interface Jurnal {
  id: number;
  tanggal: string;
  kegiatan: string;
  kendala: string | null;
  file: string | null;
  status_verifikasi: 'pending' | 'diterima' | 'ditolak';
  catatan_guru: string | null;
  is_deleted: boolean;
}

export interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}

export interface JurnalStats {
  total: number;
  disetujui: number;
  pending: number;
  ditolak: number;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'tambah' | 'edit' | 'delete' | 'view';
  selectedData: Jurnal | null;
}

export interface FormJurnalData {
  tanggal: string;
  kegiatan: string;
  kendala: string;
  file?: File | null;
  lampiran_url?: string;
}

export interface JurnalTableRowProps {
  date: string;
  kegiatan: string;
  status: 'pending' | 'diterima' | 'ditolak';
  feedback: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface FilterSelectProps {
  label: string;
  placeholder: string;
}

export interface JurnalBannerProps {
  hasJournalToday: boolean;
  loading: boolean;
  onAddClick: () => void;
}