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
        const { full_name, birth_date, studies } = data.user.user_metadata;
        const age = calculateAge(birth_date);
        const userInfo = {
          age,
          occupation: studies
        };
        
        const categoria = categorizeUser(userInfo);

        toast.success(
          `¡Bienvenido ${full_name}! Tu categoría es: ${categoria}`,
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
    <div className="page-container">
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
          background-color: #1F2833;
          color: #C5C6C7;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(102, 252, 241, 0.1);
        }

        .form {
          width: 100%;
        }

        h1 {
          text-align: center;
          color: #66FCF1;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 10px rgba(102, 252, 241, 0.3);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          font-size: 0.9rem;
          color: #C5C6C7;
          margin-bottom: 0.5rem;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.5rem;
          background-color: #0B0C10;
          border: 1px solid #45A29E;
          border-radius: 5px;
          color: #C5C6C7;
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          border-color: #66FCF1;
          box-shadow: 0 0 10px rgba(102, 252, 241, 0.2);
        }

        button {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1.5rem;
          background-color: #45A29E;
          border: none;
          color: #0B0C10;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button:hover {
          background-color: #66FCF1;
          box-shadow: 0 0 15px rgba(102, 252, 241, 0.4);
        }

        .login-link {
          text-align: center;
          margin-top: 1.5rem;
          color: #C5C6C7;
        }

        .login-link a {
          color: #66FCF1;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .login-link a:hover {
          text-shadow: 0 0 10px rgba(102, 252, 241, 0.5);
        }

        .error-message {
          color: #ff6b6b;
          text-align: center;
          margin-top: 1rem;
          text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
        }
      `}</style>
    </div>
  );
}
