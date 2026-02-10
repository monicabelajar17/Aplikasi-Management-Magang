// types.ts
export interface JurnalData {
  id: number;
  tanggal: string;
  kegiatan: string;
  kendala: string | null;
  file: string | null;
  status_verifikasi: 'pending' | 'diterima' | 'ditolak';
  catatan_guru: string | null;
  magang?: {
    siswa?: {
      nama: string;
      nis: string;
      kelas: string;
    };
  };
}

export interface StatsData {
  total: number;
  pending: number;
  diterima: number;
  ditolak: number;
}

export interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}

export interface JurnalTableRowProps {
  data: {
    name: string;
    date: string;
    kegiatan: string;
    status: string;
    feedback: string;
  };
  onView: () => void;
}

export interface JurnalModalProps {
  isOpen: boolean;
  selectedJurnal: JurnalData | null;
  catatan: string;
  isProcessing: boolean;
  onClose: () => void;
  onCatatanChange: (catatan: string) => void;
  onVerifikasi: (status: 'diterima' | 'ditolak') => Promise<void>;
  onDownload: (url: string) => void;
}