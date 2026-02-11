import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JurnalBannerProps } from "./types";

export function JurnalBanner({
  hasJournalToday,
  loading,
  isClosed,
  onAddClick,
}: JurnalBannerProps) {
  if (loading || hasJournalToday) return null;

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
          <AlertCircle size={20} />
        </div>

        <div>
          {isClosed ? (
            <>
              <p className="text-sm font-bold text-amber-800">
                ⏰ Pengisian Jurnal Ditutup
              </p>
              <p className="text-[11px] text-amber-700/80">
                Jurnal hanya dapat diisi sampai pukul <b>22.00 WIB</b>.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-amber-800">
                Jangan Lupa Jurnal Hari Ini!
              </p>
              <p className="text-[11px] text-amber-700/80">
                Anda belum membuat jurnal hari ini (
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                })}
                ).
              </p>
            </>
          )}
        </div>
      </div>

      {/* ❌ tombol HILANG kalau sudah closed */}
      {!isClosed && (
        <Button
          onClick={onAddClick}
          size="sm"
          className="bg-[#E67E22] hover:bg-orange-600 text-white rounded-xl text-[11px] font-bold px-4"
        >
          Buat Sekarang
        </Button>
      )}
    </div>
  );
}

