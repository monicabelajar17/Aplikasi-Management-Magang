import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProfilForm from "./ProfilForm"

export default async function LengkapiProfilPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get("role")?.value

  if (!role) redirect("/login")

  // Admin tidak perlu isi profil
  if (role === "admin") {
    redirect("/dashboard/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-black text-[#0A2659] mb-2">
          Lengkapi Profil
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Silakan lengkapi data {role === "siswa" ? "siswa" : "guru"} Anda
        </p>
        <ProfilForm role={role} />
      </div>
    </div>
  )
}