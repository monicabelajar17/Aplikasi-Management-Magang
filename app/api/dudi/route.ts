import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("dudi")
    .select("*")
    .order("id", { ascending: true })

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}
