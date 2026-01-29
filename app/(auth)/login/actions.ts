"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const emailInput = (formData.get("email") as string)?.toLowerCase().trim();
  const passwordInput = (formData.get("password") as string)?.trim();

  if (!emailInput || !passwordInput) {
    return { error: "Email dan password wajib diisi!" };
  }

  const supabase = await createClient();

  // 1. Cari user di database
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', emailInput)
    .single();

  if (error || !user) {
    return { error: "Akun tidak ditemukan!" };
  }

  // 2. Cek Password
  if (user.password !== passwordInput) {
    return { error: "Password salah!" };
  }

  // 3. Buat Token JWT
  const secret = process.env.JWT_SECRET || "kode-rahasia-simmas"
  const token = sign(
    { 
      id: user.id, 
      role: user.role, 
      full_name: user.full_name 
    },
    secret,
    { expiresIn: '1d' }
  )

  // 4. Simpan ke Cookie (Next.js 15 wajib await)
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  // 5. OPSI A: Direct Redirect berdasarkan Role
  // Pastikan string ini cocok dengan isi kolom 'role' di tabel Supabase-mu
  const userRole = user.role?.toLowerCase();

  switch (userRole) {
    case 'admin':
      redirect("/dashboard/admin");
    case 'guru':
      redirect("/dashboard/guru");
    case 'siswa':
      redirect("/dashboard/siswa");
    default:
      // Jika role aneh atau tidak terdaftar
      redirect("/dashboard");
  }
}