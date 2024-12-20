"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { FaUser, FaUsers, FaRobot, FaBars } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const HeaderAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [second_cat, setSecond_cat] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { user_metadata } = session.user;
        setUserName(user_metadata.full_name || session.user.email);
        setSecond_cat(user_metadata.second_cat || '');
      }
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { user_metadata } = session.user;
        setUserName(user_metadata.full_name || session.user.email);
        setSecond_cat(user_metadata.second_cat || '');
      }
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
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <FaBars />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/Profile">
                <FaUser className="mr-2" /> Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/social">
                <FaUsers className="mr-2" /> Comunidad
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/AIReporter">
                <FaRobot className="mr-2" /> HuemulAI
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-sm">
          Hola, {userName}
          {second_cat && (
            <span className="text-muted-foreground text-xs ml-1">
              • {second_cat}
            </span>
          )}
        </span>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <Button asChild size="sm" variant="outline">
          <Link href="/Profile">
            <FaUser className="mr-2" /> Perfil
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/social">
            <FaUsers className="mr-2" /> Comunidad
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/AIReporter">
            <FaRobot className="mr-2" /> HuemulAI
          </Link>
        </Button>
        <Button onClick={handleSignOut} variant={"outline"}>
          Cerrar Sesión
        </Button>
      </div>
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