"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase/client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Error al iniciar sesión: " + error.message);
    } else {
      router.push("/"); // Redirige a la página principal si el inicio de sesión es exitoso
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
          {error && <p className="error">{error}</p>}
          <button type="submit">Iniciar sesión</button>
        </form>
        <p className="register-link">
          ¿No tienes cuenta? <a href="/sign-up">Regístrate</a>
        </p>
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
  );
};

export default SignIn;
