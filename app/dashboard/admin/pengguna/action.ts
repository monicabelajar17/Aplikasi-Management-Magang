"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// 1. Ambil Semua User
export async function getUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

// 2. Tambah User & Profil Otomatis
export async function addUserAction(formData: any) {
  const supabase = await createClient()

  // Simpan ke tabel users
  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert([{ 
      full_name: formData.full_name, 
      email: formData.email, 
      role: formData.role, 
      password: formData.password 
    }])
    .select()
    .single()

  if (userError) return { success: false, error: userError.message }

  // Buat profil di tabel pendamping (guru/siswa)
  if (newUser && (newUser.role === 'guru' || newUser.role === 'siswa')) {
    const { error: profileError } = await supabase
      .from(newUser.role)
      .insert([{ 
        user_id: newUser.id, 
        nama: newUser.full_name 
      }])
    
    if (profileError) console.error("Gagal buat profil:", profileError.message)
  }

  revalidatePath('/dashboard/admin/users')
  return { success: true }
}

// 3. Update User & Sinkronisasi Profil
export async function updateUserAction(id: number, editingUser: any) {
  const supabase = await createClient()

  const { error: userError } = await supabase
    .from('users')
    .update({ 
      full_name: editingUser.full_name, 
      email: editingUser.email, 
      role: editingUser.role 
    })
    .eq('id', id)

  if (userError) return { success: false, error: userError.message }

  // Update otomatis ke tabel pendamping
  if (editingUser.role === 'guru' || editingUser.role === 'siswa') {
    await supabase
      .from(editingUser.role)
      .update({ nama: editingUser.full_name })
      .eq('user_id', id)
  }

  revalidatePath('/dashboard/admin/users')
  return { success: true }
}

// 4. Hapus User
export async function deleteUserAction(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('users').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard/admin/users')
  return { success: true }
}