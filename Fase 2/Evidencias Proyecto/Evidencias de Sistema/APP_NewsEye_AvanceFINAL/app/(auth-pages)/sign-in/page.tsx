"use client"

import { useEffect,useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getSession = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    console.log(session);
  }
  getSession();
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  }
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen">
        <form onSubmit={handleSignIn} className="bg-gray p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">Inicio de Sesión</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Correo de usuario
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
      <style jsx>{`
        .page-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #121212;
          color: #fff;
        }
        .form-container {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          border-radius: 8px;
          background-color: #1e1e1e;
          box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
          text-align: center;
        }
        h1 {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        .form-group label {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: #a1a1a1;
          text-align: left;
        }
        .form-group input {
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #333;
          background-color: #1e1e1e;
          color: #fff;
          font-size: 1rem;
        }
        .form-group input:focus {
          outline: none;
          border-color: #9b59b6;
        }
        .error {
          color: #e74c3c;
          margin-top: 0.5rem;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          background-color: #9b59b6;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 1rem;
        }
        button:hover {
          background-color: #8e44ad;
        }
        .register-link {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #a1a1a1;
        }
        .register-link a {
          color: #9b59b6;
          text-decoration: none;
        }
        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
