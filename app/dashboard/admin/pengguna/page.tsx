"use client"

import React, { useEffect, useState } from "react"
import { 
  Users, Plus, Search, Mail, Edit, Trash2, CheckCircle2, Loader2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { Shield, GraduationCap, User as UserIcon } from "lucide-react"

export default function ManajemenUserPage() {
  const supabase = createClient()
  
  // --- STATE UTAMA ---
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [roleFilter, setRoleFilter] = useState("all")

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null); // Menyimpan data user yang sedang diedit
  const triggerEdit = (user: any) => {
  setEditingUser(user);
  setIsEditModalOpen(true);
};

const handleUpdateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // 1. Update tabel users
  const { error: userError } = await supabase
    .from('users')
    .update({ 
      full_name: editingUser.full_name, 
      email: editingUser.email, 
      role: editingUser.role 
    })
    .eq('id', editingUser.id);

  if (!userError) {
    // 2. Update otomatis ke tabel pendamping
    if (editingUser.role === 'guru' || editingUser.role === 'siswa') {
      await supabase
        .from(editingUser.role)
        .update({ nama: editingUser.full_name })
        .eq('user_id', editingUser.id);
    }

    setIsEditModalOpen(false);
    fetchUsers();
    setToastMessage("Data user & profil diperbarui!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  } else {
    alert("Gagal update: " + userError.message);
  }
  setLoading(false);
};

  // --- STATE UNTUK MODAL HAPUS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  // --- FUNGSI AMBIL DATA ---
  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('id', { ascending: true })
    
    if (data) setUsers(data)
    if (error) console.error(error.message)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // --- FUNGSI SEARCH ---
  const filteredUsers = users.filter(user => {
  const matchSearch =
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())

  const matchRole =
    roleFilter === "all" || user.role === roleFilter

  return matchSearch && matchRole
})


  // --- FUNGSI UNTUK MODAL ---
  const triggerDelete = (id: number) => {
    setSelectedUserId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedUserId) {
      const { error } = await supabase.from('users').delete().eq('id', selectedUserId)
      if (!error) {
  setUsers(users.filter(u => u.id !== selectedUserId))
  setIsDeleteModalOpen(false)
  setSelectedUserId(null)

  setToastMessage("User berhasil dihapus")
  setShowToast(true)
  setTimeout(() => setShowToast(false), 3000)
}
    }
  }

  // State untuk Modal Tambah
const [isAddModalOpen, setIsAddModalOpen] = useState(false);

// State untuk Data Form
const [formData, setFormData] = useState({
  full_name: '',
  email: '',
  role: 'siswa',
  password: '',
  confirmPassword: ''
});

// Fungsi handle input
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleAddUser = async (e: React.FormEvent) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    alert("Password tidak cocok!");
    return;
  }
  setLoading(true);

  // 1. Insert ke tabel 'users' dan ambil datanya (.select().single())
  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert([{ 
      full_name: formData.full_name, 
      email: formData.email, 
      role: formData.role, 
      password: formData.password 
    }])
    .select()
    .single();

  if (!userError && newUser) {
    // 2. Jika role adalah guru atau siswa, insert ke tabel pendamping
    if (newUser.role === 'guru' || newUser.role === 'siswa') {
      const tableTarget = newUser.role; // akan jadi 'guru' atau 'siswa'
      const { error: profileError } = await supabase
        .from(tableTarget)
        .insert([{ 
          user_id: newUser.id, 
          nama: newUser.full_name // Redundansi nama di sini
        }]);
      
      if (profileError) console.error("Gagal buat profil:", profileError.message);
    }

    setIsAddModalOpen(false);
    setFormData({ full_name: '', email: '', role: 'siswa', password: '', confirmPassword: '' });
    fetchUsers();
    setToastMessage("User & Profil berhasil ditambahkan!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  } else {
    alert("Gagal: " + userError?.message);
  }
  setLoading(false);
};

  return (
    <div className="space-y-8 relative"> {/* Tambahkan relative di sini */}
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen User</h1>
          <p className="text-slate-500 mt-1">Kelola akun Admin, Guru, dan Siswa</p>
        </div>
        <Button 
  onClick={() => setIsAddModalOpen(true)} // Buka modal
  className="bg-[#0A2659] hover:bg-cyan-600 rounded-xl gap-2 shadow-lg shadow-cyan-100 py-6 px-6"
>
  <Plus size={20} /> Tambah User
</Button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#0A2659]">
            <Users className="text-cyan-500" size={20} /> Daftar User
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari user..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-slate-200 rounded-xl focus-visible:ring-cyan-500" 
            />
          </div>
          <select
  value={roleFilter}
  onChange={(e) => setRoleFilter(e.target.value)}
  className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
>
  <option value="all">Semua Role</option>
  <option value="admin">Admin</option>
  <option value="guru">Guru</option>
  <option value="siswa">Siswa</option>
</select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-cyan-500 mb-2" size={32} />
              <p className="text-slate-400 text-sm">Memuat data...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Email</th>
                  <th className="px-8 py-4 text-center">Role</th>
                  <th className="px-8 py-4">Terdaftar</th>
                  <th className="px-8 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <UserTableRow 
                    key={user.id}
                    user={user}
                    onDelete={() => triggerDelete(user.id)} // Panggil fungsi trigger modal
                    onEdit={() => triggerEdit(user)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- MODAL KONFIRMASI HAPUS (Ditaruh paling bawah) --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-[#0A2659] mb-3">Konfirmasi Hapus</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Apakah Anda yakin ingin menghapus data user ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-3 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all text-sm"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="px-8 py-3 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100 transition-all text-sm"
              >
                Ya, Hapus
              </button>
            </div>
            
          </div>
        </div>
      )}
      {/* MODAL TAMBAH USER */}
{isAddModalOpen && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
    <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-[#0A2659]">Tambah User Baru</h3>
        <p className="text-slate-400 text-sm">Lengkapi semua informasi yang diperlukan</p>
      </div>

      <form onSubmit={handleAddUser} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Nama Lengkap *</label>
          <Input name="full_name" placeholder="Masukkan nama lengkap" required onChange={handleChange} className="rounded-xl border-slate-200 py-6" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Email *</label>
          <Input name="email" type="email" placeholder="Contoh: user@email.com" required onChange={handleChange} className="rounded-xl border-slate-200 py-6" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Role *</label>
          <select name="role" onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none">
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Password *</label>
            <Input name="password" type="password" placeholder="Min. 6 karakter" required onChange={handleChange} className="rounded-xl border-slate-200 py-6" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Konfirmasi Password *</label>
            <Input name="confirmPassword" type="password" placeholder="Ulangi password" required onChange={handleChange} className="rounded-xl border-slate-200 py-6" />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
  <Button 
    type="button" 
    variant="outline" 
    onClick={() => {
      setIsAddModalOpen(false);
      setFormData({ full_name: '', email: '', role: 'siswa', password: '', confirmPassword: '' });
    }} 
    // Tambahkan flex-1 dan py-6 biar tingginya sama
    className="flex-1 py-6 rounded-2xl font-bold text-slate-400 border-slate-200"
  >
    Batal
  </Button>
  
  <Button 
    type="submit" 
    // Di sini sudah ada flex-1, makanya dia lebar tadi
    className="flex-1 py-6 rounded-2xl font-bold bg-[#0A2659] hover:bg-slate-800 text-white shadow-lg"
  >
    Simpan
  </Button>
</div>
      </form>
    </div>
  </div>
)}
{/* TOAST NOTIFICATION */}
{showToast && (
  <div className="fixed top-5 right-5 z-[2000] animate-in slide-in-from-right-10 duration-300">
    <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
      <div className="bg-white/20 p-1 rounded-full">
        <CheckCircle2 size={18} />
      </div>
      <div className="flex flex-col">
        <p className="font-bold text-sm">Berhasil!</p>
        <p className="text-xs text-emerald-50">{toastMessage}</p>
      </div>
    </div>
  </div>
)}
{isEditModalOpen && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-[#0A2659]">Edit User</h3>
        <p className="text-slate-400 text-sm">Perbarui informasi user</p>
      </div>

      <form onSubmit={handleUpdateUser} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Nama Lengkap *</label>
          <Input 
            value={editingUser?.full_name} 
            onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
            className="rounded-xl border-slate-200 py-6" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Email *</label>
          <Input 
            value={editingUser?.email} 
            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
            className="rounded-xl border-slate-200 py-6" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Role *</label>
          <select 
            value={editingUser?.role} 
            onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
            className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none"
          >
            <option value="admin">Admin</option>
            <option value="guru">Guru</option>
            <option value="siswa">Siswa</option>
          </select>
        </div>

        {/* CATATAN SESUAI GAMBAR */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-[11px] text-blue-600 leading-relaxed">
            <span className="font-bold">Catatan:</span> Untuk mengubah password, silakan gunakan fitur reset password yang terpisah.
          </p>
        </div>

        <div className="flex gap-3 mt-8">
          <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-6 rounded-2xl font-bold text-slate-400">
            Batal
          </Button>
          <Button type="submit" className="flex-1 py-6 rounded-2xl font-bold bg-[#0A2659] text-white">
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  )
}

// --- KOMPONEN BARIS TABEL ---
function UserTableRow({ user, onDelete, onEdit }: any) {
  const roleConfig: any = {
  admin: {
    label: "Admin",
    class: "bg-purple-100 text-purple-700 border border-purple-200",
    icon: <Shield size={12} />
  },
  guru: {
    label: "Guru",
    class: "bg-blue-100 text-blue-700 border border-blue-200",
    icon: <GraduationCap size={12} />
  },
  siswa: {
    label: "Siswa",
    class: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon: <UserIcon size={12} />
  }
}


  const initial = user.full_name?.charAt(0).toUpperCase() || "U"

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-[#0A2659] rounded-full flex items-center justify-center text-white font-bold text-sm">
            {initial}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{user.full_name}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">ID: #{user.id}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Mail size={12} className="text-slate-300" /> {user.email}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
            <CheckCircle2 size={10} /> Akun Aktif
          </div>
        </div>
      </td>
      
      <td className="px-8 py-5 text-center">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider ${roleConfig[user.role]?.class}`}>
  {roleConfig[user.role]?.icon}
  {roleConfig[user.role]?.label}
</span>

      </td>
      <td className="px-8 py-5">
        <p className="text-xs font-semibold text-slate-600">
          {new Date(user.created_at).toLocaleDateString('id-ID')}
        </p>
      </td>
      <td className="px-8 py-5 text-center">
        <div className="flex justify-center gap-2">
          <button 
  onClick={onEdit} // 'user' adalah data baris tersebut
  className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-xl transition-all"
>
  <Edit size={16} />
</button>
          <button 
            onClick={onDelete} // Memanggil trigger modal
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}