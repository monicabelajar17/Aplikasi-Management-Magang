//Untuk menyimpan definisi interface
export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'admin' | 'guru' | 'siswa';
  password?: string;
  created_at: string;
}

export interface UserFormData {
  full_name: string;
  email: string;
  role: 'admin' | 'guru' | 'siswa';
  password: string;
  confirmPassword: string;
}

export interface ToastState {
  show: boolean;
  message: string;
}

export interface UserTableRowProps {
  user: User;
  onDelete: () => void;
  onEdit: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading?: boolean;
}

export interface AddUserModalProps extends ModalProps {
  formData: UserFormData;
  onFormDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onResetForm: () => void;
}

export interface EditUserModalProps extends ModalProps {
  editingUser: User | null;
  onEditingUserChange: (user: User) => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}