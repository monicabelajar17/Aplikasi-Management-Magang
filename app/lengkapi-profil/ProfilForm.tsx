"use client"

import { saveProfile } from "./action"

export default function ProfilForm({ role }: { role: string }) {
  return (
    <form action={saveProfile} className="space-y-4">
      {/* UMUM */}
      <input
        name="nama"
        placeholder="Nama Lengkap"
        required
        className="w-full p-3 border rounded-xl"
      />

      <input
        name="alamat"
        placeholder="Alamat"
        required
        className="w-full p-3 border rounded-xl"
      />

      <input
        name="telepon"
        placeholder="No. Telepon"
        required
        className="w-full p-3 border rounded-xl"
      />

      {/* KHUSUS SISWA */}
      {role === "siswa" && (
        <>
          <input
            name="nis"
            placeholder="NIS"
            required
            className="w-full p-3 border rounded-xl"
          />
          <input
            name="kelas"
            placeholder="Kelas"
            required
            className="w-full p-3 border rounded-xl"
          />
          <input
            name="jurusan"
            placeholder="Jurusan"
            required
            className="w-full p-3 border rounded-xl"
          />
        </>
      )}

      {/* KHUSUS GURU */}
      {role === "guru" && (
        <>
          <input
            name="nip"
            placeholder="NIP"
            required
            className="w-full p-3 border rounded-xl"
          />
          <input
            name="mapel"
            placeholder="Mata Pelajaran"
            required
            className="w-full p-3 border rounded-xl"
          />
        </>
      )}

      <button
        type="submit"
        className="w-full bg-[#0A2659] text-white py-3 rounded-xl font-bold"
      >
        Simpan Profil
      </button>
    </form>
  )
}
