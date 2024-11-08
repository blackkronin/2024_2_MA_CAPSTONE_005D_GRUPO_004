import { createClient } from '@/utils/supabase/server';
import NewsContainer from '@/components/home/news-container';
import dynamic from 'next/dynamic';

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <main className="flex-1 flex flex-col gap-6 px-4">
      <NewsContainer isAuthenticated={!!session} />
    </main>
  );
}
