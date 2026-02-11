"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0A2659", "#0EA5E9", "#6366F1", "#F59E0B", "#10B981"];

export function GuruChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-48 flex items-center justify-center">
        <p className="text-slate-400 text-sm italic">Data bimbingan belum tersedia</p>
      </div>
    );
  }

  // Mencari nilai tertinggi untuk menentukan jumlah garis (ticks)
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="mb-6">
        <h3 className="font-bold text-[#0A2659]">Statistik Bimbingan Guru</h3>
        <p className="text-xs text-slate-500">Jumlah siswa per pembimbing</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
  {/* Tambahkan strokeOpacity agar garis tidak terlalu dominan */}
  <CartesianGrid 
    vertical={false} 
    stroke="#9b9ea1" 
    strokeDasharray="0" 
    strokeOpacity={0.6} 
  />
  
  <XAxis 
    dataKey="name" 
    tick={{ fill: '#64748b', fontSize: 12 }}
    axisLine={false}
    tickLine={false}
  />
  
  <YAxis 
    tick={{ fill: '#64748b', fontSize: 12 }} 
    axisLine={false} 
    tickLine={false}
    allowDecimals={false}
    domain={[0, 'auto']}
    tickCount={maxValue + 1}
  />
  
  <Tooltip 
    cursor={{ fill: '#f1f5f9', opacity: 0.4 }} // Cursor dibuat agak transparan
    contentStyle={{ 
      borderRadius: '12px', 
      border: 'none', 
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
      zIndex: 1000 // Memastikan tooltip di depan
    }}
    wrapperStyle={{ outline: 'none', zIndex: 1000 }}
  />
  
  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
    {data.map((_, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Bar>
</BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}