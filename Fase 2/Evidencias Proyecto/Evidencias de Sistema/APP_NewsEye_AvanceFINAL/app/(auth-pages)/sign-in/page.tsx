"use client"; // Indicar que es un Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(`Bienvenido, has iniciado sesión con el correo: ${email}`);
    router.push('/');
  };

  return (
    <div>
      <div className="container">
        <h1>Inicio de Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Ingresar</button>
        </form>

        <p className="register-link">
          ¿No tienes una cuenta?{" "}
          <Link href="/sign-up">Regístrate</Link>
        </p>
      </div>

      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #1a1a2e;
          padding: 10px; /* Asegurar que haya espacio alrededor en pantallas pequeñas */
        }

        .container {
          background-color: #16213e;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(255, 105, 180, 0.75);
          max-width: 360px; /* Limitar el ancho máximo */
          width: 100%;
          box-sizing: border-box;
        }

        h1 {
          text-align: center;
          color: #ff1493;
          font-size: 24px;
          text-shadow: 0 0 10px #ff1493, 0 0 20px #ff1493, 0 0 30px #ff1493;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #00ffff;
          text-shadow: 0 0 5px #00ffff;
        }

        input[type="email"],
        input[type="password"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ff1493;
          border-radius: 5px;
          background-color: #0f3460;
          color: white;
          font-size: 14px;
          box-sizing: border-box;
        }

        button {
          width: 100%;
          padding: 10px;
          background-color: #ff1493;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          text-transform: uppercase;
          box-shadow: 0 0 10px #ff1493, 0 0 20px #ff1493;
          box-sizing: border-box;
        }

        button:hover {
          background-color: #ff66b2;
        }

        input:focus {
          border-color: #00ffff;
          outline: none;
          box-shadow: 0 0 5px #00ffff;
        }

        .register-link {
          text-align: center;
          margin-top: 10px;
          font-size: 14px;
          color: #ccc;
        }

        .register-link a {
          color: #00ffff;
          text-decoration: none;
        }

        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
