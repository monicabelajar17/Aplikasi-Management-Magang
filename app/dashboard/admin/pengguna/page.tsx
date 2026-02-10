// page.tsx
"use client"

import React, { useEffect, useState } from "react";
import { Users, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTableRow } from "./user-table";
import { AddUserModal } from "./add-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { Toast } from "./toast";
import { fetchUsers, addUser, updateUser, deleteUser, validateUserForm } from "./action";
import { User, UserFormData, ToastState } from "./type";

export default function ManajemenUserPage() {
  // State utama
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Data states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: ""
  });

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    full_name: '',
    email: '',
    role: 'siswa',
    password: '',
    confirmPassword: ''
  });

  // Fetch data
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Error loading users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Toast handler
  const showToast = (message: string) => {
    setToast({
      show: true,
      message
    });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      role: 'siswa',
      password: '',
      confirmPassword: ''
    });
  };

  // Add user handler
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateUserForm(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    try {
      await addUser(formData);
      showToast("User & Profil berhasil ditambahkan!");
      setIsAddModalOpen(false);
      resetForm();
      loadUsers();
    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit user handler
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    try {
      await updateUser(editingUser);
      showToast("Data user & profil diperbarui!");
      setIsEditModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (error: any) {
      alert("Gagal update: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user handler
  const handleDeleteUser = async () => {
    if (!selectedUserId) return;

    try {
      await deleteUser(selectedUserId);
      setUsers(users.filter(u => u.id !== selectedUserId));
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
      showToast("User berhasil dihapus");
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-8 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2659]">Manajemen User</h1>
          <p className="text-slate-500 mt-1">Kelola akun Admin, Guru, dan Siswa</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0A2659] hover:bg-cyan-600 rounded-xl gap-2 shadow-lg shadow-cyan-100 py-6 px-6"
        >
          <Plus size={20} /> Tambah User
        </Button>
      </div>

      {/* Table Section */}
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
                    onDelete={() => {
                      setSelectedUserId(user.id);
                      setIsDeleteModalOpen(true);
                    }}
                    onEdit={() => {
                      setEditingUser(user);
                      setIsEditModalOpen(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
        formData={formData}
        onFormDataChange={handleFormChange}
        onResetForm={resetForm}
        loading={loading}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleEditUser}
        editingUser={editingUser}
        onEditingUserChange={setEditingUser}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUserId(null);
        }}
        onConfirm={handleDeleteUser}
      />

      {/* Toast Notification */}
      <Toast toast={toast} />
    </div>
  );
}