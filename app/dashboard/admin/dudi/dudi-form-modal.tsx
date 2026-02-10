//Gabungan modal Tambah dan Edit (karena isinya mirip).
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";

export function DudiFormModal({ open, onClose, onSubmit, formData, setFormData, isEdit }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden bg-white border-none">
        <div className="bg-[#0A2659] p-6 text-white">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {isEdit ? <Edit size={20} /> : <Plus size={20} />}
            {isEdit ? "Edit Data Mitra" : "Tambah Mitra Baru"}
          </DialogTitle>
        </div>
        <div className="p-6 space-y-4">
          <Input placeholder="Nama Perusahaan" value={formData.nama_perusahaan} onChange={(e) => setFormData({...formData, nama_perusahaan: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <Input placeholder="Telepon" value={formData.telepon} onChange={(e) => setFormData({...formData, telepon: e.target.value})} />
          </div>
          <Input placeholder="Penanggung Jawab" value={formData.penanggung_jawab} onChange={(e) => setFormData({...formData, penanggung_jawab: e.target.value})} />
          <textarea 
            className="w-full min-h-[80px] rounded-xl border p-3 text-sm focus:ring-2 focus:ring-cyan-500/20 outline-none" 
            placeholder="Alamat Kantor" 
            value={formData.alamat} 
            onChange={(e) => setFormData({...formData, alamat: e.target.value})}
          />
          <select 
            className="w-full rounded-xl border p-2.5 text-sm outline-none"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Batal</Button>
            <Button className="flex-1 rounded-xl bg-cyan-500 hover:bg-cyan-600" onClick={onSubmit}>
              {isEdit ? "Simpan Perubahan" : "Daftarkan Mitra"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}