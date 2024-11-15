"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import TraerNoticiasPersonalizadas from './traer-noticias-personalizadas';
import TraerNoticias from './traer-noticias';

export default function NewsContainer({ isAuthenticated: initialAuthState }: { isAuthenticated: boolean }) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {isAuthenticated ? (
        <TraerNoticiasPersonalizadas />
      ) : (
        <TraerNoticias />
      )}
    </div>
  );
} 