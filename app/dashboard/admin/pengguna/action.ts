//semua fungsi yang berurusan dengan Supabase
import { createClient } from "@/utils/supabase/client";
import { User, UserFormData } from "./type";

const supabase = createClient();

export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
  
  return data || [];
}

export async function addUser(formData: UserFormData): Promise<User> {
  if (formData.password !== formData.confirmPassword) {
    throw new Error("Password tidak cocok!");
  }

  // Insert ke tabel users
  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert([{ 
      full_name: formData.full_name, 
      email: formData.email, 
      role: formData.role, 
      password: formData.password 
    }])
    .select()
    .single();

  if (userError) {
    throw userError;
  }

  if (!newUser) {
    throw new Error("Gagal membuat user");
  }

  // Jika role adalah guru atau siswa, insert ke tabel pendamping
  if (newUser.role === 'guru' || newUser.role === 'siswa') {
    const tableTarget = newUser.role;
    const { error: profileError } = await supabase
      .from(tableTarget)
      .insert([{ 
        user_id: newUser.id, 
        nama: newUser.full_name
      }]);
    
    if (profileError) {
      console.error("Gagal buat profil:", profileError.message);
    }
  }

  return newUser;
}

export async function updateUser(user: User): Promise<void> {
  // Update tabel users
  const { error: userError } = await supabase
    .from('users')
    .update({ 
      full_name: user.full_name, 
      email: user.email, 
      role: user.role 
    })
    .eq('id', user.id);

  if (userError) {
    throw userError;
  }

  // Update otomatis ke tabel pendamping
  if (user.role === 'guru' || user.role === 'siswa') {
    await supabase
      .from(user.role)
      .update({ nama: user.full_name })
      .eq('user_id', user.id);
  }
}

export async function deleteUser(id: number): Promise<void> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export function validateUserForm(formData: UserFormData): string | null {
  if (!formData.full_name.trim()) {
    return "Nama lengkap harus diisi";
  }
  
  if (!formData.email.trim()) {
    return "Email harus diisi";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return "Format email tidak valid";
  }
  
  if (!formData.password) {
    return "Password harus diisi";
  }
  
  if (formData.password.length < 6) {
    return "Password minimal 6 karakter";
  }
  
  if (formData.password !== formData.confirmPassword) {
    return "Password tidak cocok";
  }
  
  return null;
}