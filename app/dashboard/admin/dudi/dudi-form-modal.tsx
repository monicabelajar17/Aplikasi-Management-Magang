// dudi-form-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Loader2 } from "lucide-react";

// Sesuaikan interface/props dengan yang dikirim dari page.tsx
export function DudiFormModal({ 
  isOpen,         // Sesuaikan dari page.tsx
  onClose, 
  onSubmit, 
  formData, 
  onFormDataChange, // Sesuaikan dari page.tsx
  isEditMode,     // Sesuaikan dari page.tsx
  submitting      // Tambahan dari page.tsx
}: any) {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden bg-white border-none">
        <div className="bg-[#0A2659] p-6 text-white">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {isEditMode ? <Edit size={20} /> : <Plus size={20} />}
            {isEditMode ? "Edit Data Mitra" : "Tambah Mitra Baru"}
          </DialogTitle>
        </div>
        
        <div className="p-6 space-y-4">
          <Input 
            name="nama_perusahaan" 
            placeholder="Nama Perusahaan" 
            value={formData.nama_perusahaan} 
            onChange={onFormDataChange} 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={onFormDataChange} 
            />
            <Input 
              name="telepon" 
              placeholder="Telepon" 
              value={formData.telepon} 
              onChange={onFormDataChange} 
            />
          </div>

          <Input 
            name="penanggung_jawab" 
            placeholder="Penanggung Jawab" 
            value={formData.penanggung_jawab} 
            onChange={onFormDataChange} 
          />

          <textarea 
            name="alamat"
            className="w-full min-h-[80px] rounded-xl border p-3 text-sm focus:ring-2 focus:ring-cyan-500/20 outline-none" 
            placeholder="Alamat Kantor" 
            value={formData.alamat} 
            onChange={onFormDataChange}
          />

          <select 
            name="status"
            className="w-full rounded-xl border p-2.5 text-sm outline-none bg-transparent"
            value={formData.status}
            onChange={onFormDataChange}
          >
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl" 
              onClick={onClose}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button 
              className="flex-1 rounded-xl bg-cyan-500 hover:bg-cyan-600" 
              onClick={onSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : null}
              {isEditMode ? "Simpan Perubahan" : "Daftarkan Mitra"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}