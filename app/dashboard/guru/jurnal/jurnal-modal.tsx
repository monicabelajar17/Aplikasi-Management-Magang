// jurnal-modal.tsx
import React from "react";
import { X, BookOpen, AlertCircle, FileText, Download, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JurnalModalProps } from "./types";

export function JurnalModal({
  isOpen,
  selectedJurnal,
  catatan,
  isProcessing,
  onClose,
  onCatatanChange,
  onVerifikasi,
  onDownload
}: JurnalModalProps) {
  if (!isOpen || !selectedJurnal) return null;

  const handleDownloadClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    onDownload(url);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="bg-cyan-500 p-2.5 rounded-xl text-white shadow-lg shadow-cyan-100">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0A2659]">Detail Jurnal Harian</h3>
              <p className="text-xs text-slate-400 font-medium">
                {selectedJurnal.magang?.siswa?.nama} • {new Date(selectedJurnal.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 p-1">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Section Kegiatan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <BookOpen size={16} className="text-cyan-500" />
              Kegiatan
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed">{selectedJurnal.kegiatan}</p>
            </div>
          </div>

          {/* Section Kendala */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <AlertCircle size={16} className="text-orange-500" />
              Kendala yang Dihadapi
            </div>
            <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {selectedJurnal.kendala || "Tidak ada kendala dilaporkan"}
              </p>
            </div>
          </div>

          {/* Section Dokumentasi */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <FileText size={16} className="text-emerald-500" />
              Dokumentasi
            </div>
            
            {selectedJurnal.file ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => window.open(selectedJurnal.file!, '_blank')}
                  className="flex-1 bg-emerald-50/30 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-emerald-50 transition-all group"
                >
                  <div className="text-emerald-600 group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-600 truncate max-w-[180px]">
                      {selectedJurnal.file.split('/').pop()}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">Klik untuk melihat foto</span>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-2 px-4 h-[52px] shadow-sm shadow-emerald-100"
                  onClick={(e) => handleDownloadClick(e, selectedJurnal.file!)}
                  disabled={isProcessing}
                >
                  <Download size={16} />
                </Button>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 p-4 rounded-2xl text-center">
                <p className="text-xs text-slate-400 italic">Tidak ada file terlampir</p>
              </div>
            )}
          </div>

          {/* Section Input Catatan Guru */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <MessageSquare size={16} className="text-indigo-500" />
              Berikan Catatan / Feedback
            </div>
            <textarea 
              className="w-full min-h-[100px] border-2 border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50 transition-all resize-none"
              placeholder="Tulis masukan untuk siswa di sini..."
              value={catatan}
              onChange={(e) => onCatatanChange(e.target.value)}
              disabled={selectedJurnal.status_verifikasi !== 'pending' || isProcessing}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-slate-50/50 flex justify-between items-center">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Status Saat Ini: <span className={`font-bold ${
              selectedJurnal.status_verifikasi === 'diterima' ? 'text-emerald-500' : 
              selectedJurnal.status_verifikasi === 'ditolak' ? 'text-rose-500' : 'text-amber-500'
            }`}>
              {selectedJurnal.status_verifikasi}
            </span>
          </div>
          
          <div className="flex gap-3">
            {selectedJurnal.status_verifikasi === 'pending' ? (
              <>
                <Button 
                  onClick={onClose}
                  variant="ghost" 
                  className="rounded-xl px-6 font-bold text-slate-500"
                  disabled={isProcessing}
                >
                  Batal
                </Button>
                <Button 
                  onClick={() => onVerifikasi('ditolak')}
                  className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6 font-bold gap-2 shadow-lg shadow-rose-100"
                  disabled={isProcessing}
                >
                  <XCircle size={16} /> Tolak
                </Button>
                <Button 
                  onClick={() => onVerifikasi('diterima')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 font-bold gap-2 shadow-lg shadow-emerald-100"
                  disabled={isProcessing}
                >
                  <CheckCircle size={16} /> Setujui
                </Button>
              </>
            ) : (
              <Button 
                onClick={onClose}
                variant="outline" 
                className="rounded-xl px-10 font-bold border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}