import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  const supabase = await createClient()

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // =========================
  // CEK APAKAH USER SUDAH ADA DI TABLE users
  // =========================
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .maybeSingle()

  let dbUser = existingUser

  // =========================
  // JIKA BELUM ADA → INSERT SEBAGAI SISWA
  // =========================
  if (!existingUser) {
    const { data: newUser } = await supabase
      .from("users")
      .insert([
        {
          email: user.email,
          full_name: user.user_metadata.full_name || "Siswa",
          password: "", // kosong karena login Google
          role: "siswa",
        },
      ])
      .select()
      .single()

    dbUser = newUser

    // Insert ke tabel siswa
    await supabase.from("siswa").insert([
      {
        user_id: newUser.id,
      },
    ])
  }

  // =========================
  // BUAT JWT SAMA SEPERTI LOGIN MANUAL
  // =========================
  const secret = process.env.JWT_SECRET || "kode-rahasia-simmas"

  const token = sign(
    {
      id: dbUser.id,
      role: dbUser.role,
      full_name: dbUser.full_name,
    },
    secret,
    { expiresIn: "1d" }
  )

  const cookieStore = await cookies()

  cookieStore.set("session_token", token, {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  cookieStore.set("user_id", dbUser.id.toString(), {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  cookieStore.set("role", dbUser.role, {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  cookieStore.set("full_name", dbUser.full_name, {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  // Ambil siswa_id
  const { data: siswa } = await supabase
    .from("siswa")
    .select("id")
    .eq("user_id", dbUser.id)
    .single()

  if (siswa) {
    cookieStore.set("siswa_id", siswa.id.toString(), {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24,
    })
  }

  return NextResponse.redirect(`${origin}/dashboard/siswa`)
}
