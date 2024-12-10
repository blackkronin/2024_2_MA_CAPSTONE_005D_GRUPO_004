import { createClient } from '@/utils/supabase/server';
import NewsContainer from '@/components/home/news-container';
import CarruselBienvenida from '@/components/home/carrusel-bienvenida';
import Bienvenida from '@/components/home/bienvenida';
import dynamic from 'next/dynamic';
import './/globals.css';

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <>
      <CarruselBienvenida />
      <Bienvenida />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <NewsContainer isAuthenticated={!!session} />
      </main>
    </>
  );
}
