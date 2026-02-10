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
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  const userRole = user.role?.toLowerCase();
  
// 🔎 JIKA ROLE = GURU, AMBIL guru_id & SIMPAN KE COOKIE
if (userRole === "guru") {
  const { data: guru } = await supabase
    .from("guru")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!guru) {
    return { error: "Data guru tidak ditemukan" }
  }

  cookieStore.set("guru_id", guru.id.toString(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
}
if (userRole === "siswa") {
  const { data: siswa } = await supabase
    .from("siswa")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (siswa) {
    // Simpan id dari tabel siswa, bukan id dari tabel users
    cookieStore.set("siswa_id", siswa.id.toString(), { 
      httpOnly: false, // Agar bisa dibaca client-side jika perlu
      path: "/", 
      maxAge: 60 * 60 * 24 
    });
  } else {
    return { error: "Data profil siswa tidak ditemukan!" };
  }
}
// Simpan user_id
cookieStore.set("user_id", user.id.toString(), {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24,
})

cookieStore.set("role", user.role, {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24,
})

// Simpan full_name (untuk dashboard siswa)
cookieStore.set("full_name", user.full_name, {
  httpOnly: false, // ⚠️ HARUS false biar client bisa baca
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24,
})

  // 5. OPSI A: Direct Redirect berdasarkan Role


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