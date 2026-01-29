import { createClient } from "@/utils/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase.from('users').select('email');

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Tes Koneksi Supabase</h1>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <pre className="bg-gray-100 p-4 mt-4">
        {JSON.stringify(users, null, 2)}
      </pre>
    </div>
  );
}