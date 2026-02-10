"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! //FULL ACCESS
)

export async function saveProfile(formData: FormData) {
  const cookieStore = await cookies()

  const userId = cookieStore.get("user_id")?.value
  const role = cookieStore.get("role")?.value

  if (!userId || !role) {
    throw new Error("User tidak valid")
  }

  // contoh data
  const payload = {
    user_id: userId,
    nama: formData.get("nama"),
    kelas: formData.get("kelas"),
  }

  if (role === "siswa") {
    // 🔎 CEK APAKAH DATA SUDAH ADA
    const { data: existing } = await supabase
      .from("siswa")
      .select("id")
      .eq("user_id", userId)
      .single()

    // ❌ BELUM ADA → INSERT
    if (!existing) {
      const { error } = await supabase
        .from("siswa")
        .insert(payload)

      if (error) {
        console.error("INSERT ERROR:", error)
        throw new Error(error.message)
      }
    }

    // ✅ SUDAH ADA → UPDATE
    else {
      const { error } = await supabase
        .from("siswa")
        .update(payload)
        .eq("user_id", userId)

      if (error) {
        console.error("UPDATE ERROR:", error)
        throw new Error(error.message)
      }
    }
  }
}
