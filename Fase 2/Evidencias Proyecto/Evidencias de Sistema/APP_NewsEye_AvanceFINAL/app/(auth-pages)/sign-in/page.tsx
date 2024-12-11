"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { calculateAge } from '@/utils/calculateAge';
import { Toaster, toast } from 'react-hot-toast';
import { categorizeUser } from '@/utils/categorizeUser';

const toastOptions = {
  duration: 10000,
  style: {
    background: '#333',
    color: '#fff',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    zIndex: 9999,
  },
} as const;

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  const router = useRouter();

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push('/');
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        const { full_name, birth_date, first_cat,second_cat } = data.user.user_metadata;
        const age = calculateAge(birth_date);
        const userInfo = {
          age,
          occupation: first_cat
        };
        
        const categoria = categorizeUser(userInfo);

        toast.success(
          `¡Bienvenido ${full_name}! Tu categoría es: ${second_cat}`,
          {
            ...toastOptions,
            position: 'top-center',
            duration: 10000,
          }
        );

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('Error inesperado durante el inicio de sesión');
    }
  };

  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: toastOptions.style
        }}
      />
      <form onSubmit={handleSignIn} className="form">
        <h1>Inicio de Sesión</h1>
        <div className="form-group">
          <label htmlFor="email">Correo de usuario</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Iniciar Sesión</button>
        <p className="login-link">
          ¿No tienes una cuenta? <Link href="/sign-up">Regístrate</Link>
        </p>
      </form>

      <style jsx>{`
        .page-container {
          max-width: 400px;
          margin: auto;
          padding: 2rem;
          background-color: #1a1a1a;
          color: #fff;
          border-radius: 10px;
          box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
        }

        h1 {
          text-align: center;
          color: #fff;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          font-size: 0.9rem;
          color: #aaa;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.5rem;
          background-color: #333;
          border: 1px solid #555;
          border-radius: 5px;
          color: #fff;
        }

        input:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          background-color: #8b5cf6;
          border: none;
          color: #fff;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        button:hover {
          background-color: #7c3aed;
        }

        .login-link {
          text-align: center;
          margin-top: 1rem;
          color: #aaa;
        }

        .login-link a {
          color: #8b5cf6;
          text-decoration: underline;
        }

        .error-message {
          color: #f87171;
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
