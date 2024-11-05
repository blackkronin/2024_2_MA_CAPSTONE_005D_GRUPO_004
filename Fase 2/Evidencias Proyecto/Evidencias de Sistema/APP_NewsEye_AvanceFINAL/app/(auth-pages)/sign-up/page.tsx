"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../utils/supabase/client';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [studies, setStudies] = useState('');
  const [interests, setInterests] = useState<string[]>([]); // Cambiado a array para múltiples intereses
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  interface InterestChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleInterestChange = (event: InterestChangeEvent) => {
    const value = event.target.value;
    setInterests(prevInterests =>
      prevInterests.includes(value)
        ? prevInterests.filter(interest => interest !== value)
        : [...prevInterests, value]
    );
  };

  interface SignUpData {
    email: string;
    password: string;
    options: {
      emailRedirectTo: string;
      data: {
        full_name: string;
        birth_date: string;
        studies: string;
        interests: string;
        avatar_url: string;
      };
    };
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');

    const signUpData: SignUpData = {
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/',
        data: {
          full_name: name,
          birth_date: birthDate,
          studies: studies,
          interests: interests.join(','), // Convertimos el array a una cadena de texto separada por comas
          avatar_url: avatarUrl,
        },
      },
    };

    const { data, error: signUpError } = await supabase.auth.signUp(signUpData);

    if (signUpError) {
      console.log("Error en el registro:", signUpError);
      setError(`Database error: ${signUpError.message}`);
      return;
    }

    setNotification(`Hola ${name}, te has registrado exitosamente. Por favor, revisa tu correo para confirmar tu cuenta antes de iniciar sesión.`);

    setTimeout(() => {
      router.push('/sign-in');
    }, 5000);
  };

  return (
    <div className="page-container">
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Repetir Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="studies">Nivel de Estudios:</label>
          <select
            id="studies"
            value={studies}
            onChange={(e) => setStudies(e.target.value)}
            required
          >
            <option value="">Seleccione...</option>
            <option value="profesionales">Estudios Profesionales</option>
            <option value="básicos">Estudios Básicos</option>
            <option value="cursando">Cursando</option>
          </select>
        </div>
        <div className="form-group">
          <label>Intereses:</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="deportes"
                checked={interests.includes("deportes")}
                onChange={handleInterestChange}
              />
              Deportes
            </label>
            <label>
              <input
                type="checkbox"
                value="ciencia"
                checked={interests.includes("ciencia")}
                onChange={handleInterestChange}
              />
              Ciencia
            </label>
            <label>
              <input
                type="checkbox"
                value="tecnologia"
                checked={interests.includes("tecnologia")}
                onChange={handleInterestChange}
              />
              Tecnología
            </label>
            <label>
              <input
                type="checkbox"
                value="salud"
                checked={interests.includes("salud")}
                onChange={handleInterestChange}
              />
              Salud
            </label>
            <label>
              <input
                type="checkbox"
                value="entretenimiento"
                checked={interests.includes("entretenimiento")}
                onChange={handleInterestChange}
              />
              Entretenimiento
            </label>
            <label>
              <input
                type="checkbox"
                value="negocios"
                checked={interests.includes("negocios")}
                onChange={handleInterestChange}
              />
              Negocios
            </label>
            <label>
              <input
                type="checkbox"
                value="general"
                checked={interests.includes("general")}
                onChange={handleInterestChange}
              />
              General
            </label>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit">Crear Cuenta</button>
      </form>
      <p className="login-link">
        ¿Ya tienes una cuenta? <Link href="/sign-in">Inicia Sesión</Link>
      </p>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

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
        input[type="email"],
        input[type="password"],
        input[type="text"],
        input[type="date"],
        select {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.5rem;
          background-color: #333;
          border: 1px solid #555;
          border-radius: 5px;
          color: #fff;
        }
        .checkbox-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #aaa;
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
        .notification {
          text-align: center;
          color: #22c55e;
          margin-top: 1rem;
        }
        .error-message {
          color: #f87171;
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
