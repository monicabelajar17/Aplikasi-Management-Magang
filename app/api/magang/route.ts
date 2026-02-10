//file ini menangani permintaan data untuk fitur "Magang" di alamat domainkamu.com/api/magang.
import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()

  const { dudi_id, user_id } = body

  const { error } = await supabase
    .from("magang")
    .insert([
      {
        dudi_id,
        user_id,
        status: "pending",
      },
    ])

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
