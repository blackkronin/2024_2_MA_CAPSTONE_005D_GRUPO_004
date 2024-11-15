"use client";

import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {fullName && (
        <span className="text-sm text-[#4f91ff] text-shadow-[0_0_5px_#4f91ff,0_0_10px_#4f91ff]">
          ¡Hola, {fullName}!
        </span>
      )}
      <Button 
        onClick={handleLogout}
        variant="ghost" 
        size="sm"
        className="flex items-center gap-2 bg-[#4f91ff] text-white hover:bg-[#3a6fbd] hover:shadow-[0_0_8px_#4f91ff,0_0_12px_#4f91ff] transition-all duration-300"
      >
        <LogOut size={16} className="mr-1" />
        Cerrar Sesión
      </Button>
    </div>
  );
} 