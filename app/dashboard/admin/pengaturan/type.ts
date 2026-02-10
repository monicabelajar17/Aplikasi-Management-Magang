// types.ts
export interface SchoolSettings {
  id: number | null;
  nama_sekolah: string;
  npsn: string;
  alamat: string;
  telepon: string;
  email: string;
  website: string;
  kepala_sekolah: string;
  logo_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  type?: string;
}

export interface PreviewSectionProps {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  children: React.ReactNode;
}

export interface SchoolFormProps {
  formData: SchoolSettings;
  isEditing: boolean;
  isSaving: boolean;
  isUploading: boolean;
  onFormChange: (field: keyof SchoolSettings, value: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDeleteLogo: () => void;
  onToggleEdit: () => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export interface SchoolPreviewProps {
  formData: SchoolSettings;
}