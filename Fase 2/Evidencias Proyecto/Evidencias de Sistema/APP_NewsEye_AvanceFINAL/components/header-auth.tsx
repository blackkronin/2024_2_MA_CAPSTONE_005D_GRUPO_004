"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const HeaderAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();
        setUserName(data?.full_name || session.user.email);
      }
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="flex gap-4 items-center">
        <Badge variant={"default"} className="font-normal pointer-events-none">
          Please update .env.local file with anon key and url
        </Badge>
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span>Hola, {userName}!</span>
      <Button onClick={handleSignOut} variant={"outline"}>
        Cerrar Sesión
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Iniciar Sesión</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Registrarse</Link>
      </Button>
    </div>
  );
};

export default HeaderAuth;