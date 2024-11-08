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
        <span className="text-sm text-muted-foreground">
          ¡Hola, {fullName}!
        </span>
      )}
      <Button 
        onClick={handleLogout}
        variant="ghost" 
        size="sm"
        className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-100/10"
      >
        <LogOut size={16} />
        Cerrar Sesión
      </Button>
    </div>
  );
} 