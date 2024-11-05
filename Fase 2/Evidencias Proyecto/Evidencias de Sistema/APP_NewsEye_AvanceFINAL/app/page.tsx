"use client";

import Hero from "@/components/hero";
import TraerNoticias from "@/components/home/traer-noticias";

export default function Index() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <TraerNoticias />
      </main>
    </>
  );
}
