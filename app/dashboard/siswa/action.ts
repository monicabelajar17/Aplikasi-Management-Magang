"use server"

import { cookies } from "next/headers"

export async function getStudentProfile() {
  const cookieStore = await cookies()
  const fullName = cookieStore.get("full_name")?.value
  
  // Kita decode jika datanya berasal dari format URI
  const decodedName = fullName ? decodeURIComponent(fullName) : "Siswa"

  return {
    fullName: decodedName
  }
}