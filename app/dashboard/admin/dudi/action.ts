// // app/dashboard/admin/dudi/action.ts
// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { revalidatePath } from "next/cache"

// export async function createDudi(formData: FormData) {
//   console.log("🚀 CREATE DUDI DIPANGGIL")
  
//   // Debug: Lihat semua data form
//   const data: Record<string, string> = {}
//   formData.forEach((value, key) => {
//     data[key] = value.toString()
//   })
//   console.log("📋 Form Data:", data)
  
//   try {
//     const supabase = await createClient()
//     console.log("✅ Supabase client created")
    
//     const { data: result, error } = await supabase
//       .from("dudi")
//       .insert([{
//         nama_perusahaan: data.nama_perusahaan,
//         alamat: data.alamat || null,
//         telepon: data.telepon || null,
//         email: data.email || null,
//         penanggung_jawab: data.penanggung_jawab,
//         status: data.status || "Aktif"
//       }])
//       .select()
//       .single()

//     console.log("📊 Supabase response - Error:", error)
//     console.log("📊 Supabase response - Data:", result)

//     if (error) {
//       throw new Error(`Supabase error: ${error.message}`)
//     }

//     revalidatePath("/dashboard/admin/dudi")
//     console.log("✅ Revalidate path done")
    
//     return { 
//       success: true, 
//       message: "Data DUDI berhasil ditambahkan!",
//       data: result 
//     }

//   } catch (error: any) {
//     console.error("❌ ERROR in createDudi:", error)
//     return { 
//       error: error.message || "Terjadi kesalahan server" 
//     }
//   }
// }

// export async function deleteDudi(id: string) {
//   console.log("🗑️ DELETE DUDI DIPANGGIL - ID:", id)
  
//   try {
//     const supabase = await createClient()
//     console.log("✅ Supabase client created for delete")
    
//     const { error } = await supabase
//       .from("dudi")
//       .delete()
//       .eq("id", id)

//     console.log("📊 Delete response - Error:", error)

//     if (error) {
//       throw new Error(`Supabase delete error: ${error.message}`)
//     }

//     revalidatePath("/dashboard/admin/dudi")
//     console.log("✅ Revalidate path after delete")
    
//     return { 
//       success: true, 
//       message: "Data berhasil dihapus!" 
//     }

//   } catch (error: any) {
//     console.error("❌ ERROR in deleteDudi:", error)
//     return { 
//       error: error.message || "Gagal menghapus data" 
//     }
//   }
// }

// export async function getDudiList() {
//   console.log("📖 GET DUDI LIST DIPANGGIL")
  
//   try {
//     const supabase = await createClient()
    
//     const { data, error } = await supabase
//       .from("dudi")
//       .select("*")
//       .order("created_at", { ascending: false })

//     if (error) throw error
    
//     console.log("✅ Data fetched, count:", data?.length || 0)
//     return { data, error: null }
    
//   } catch (error: any) {
//     console.error("❌ ERROR in getDudiList:", error)
//     return { data: null, error: error.message }
//   }
// }