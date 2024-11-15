"use client";
import { calculateAge } from '@/utils/calculateAge';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../utils/supabase/client';
import { categorizeUser } from '@/utils/categorizeUser';


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
        age: number;
        studies: string;
        interests: string;
        avatar_url: string;
        user_category: string;
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

    const age = calculateAge(birthDate);
    const userCategory = categorizeUser({
      age,
      occupation: studies
    });

    const signUpData: SignUpData = {
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/',
        data: {
          full_name: name,
          birth_date: birthDate,
          age: age,
          studies: studies,
          interests: interests.join(','),
          avatar_url: avatarUrl,
          user_category: userCategory,
        },
      },
    };

    const { data, error: signUpError } = await supabase.auth.signUp(signUpData);

    if (signUpError) {
      console.log("Error en el registro:", signUpError);
      setError(`Database error: ${signUpError.message}`);
      return;
    }

    setNotification(`Hola ${name}, te has registrado exitosamente como ${userCategory}. Por favor, revisa tu correo para confirmar tu cuenta antes de iniciar sesión.`);

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
          <label htmlFor="currentStatus">Ocupación Actual:</label>
          <select
            id="currentStatus"
            value={studies}
            onChange={(e) => setStudies(e.target.value)}
            required
          >
            <option value="">Seleccione...</option>
            <option value="estudiante">Estudiante</option>
            <option value="trabajando">Trabajando</option>
            <option value="retirado">Retirado</option>
            <option value="no_responde">Prefiero no responder</option>
          </select>
        </div>
        <div className="form-group">
          <label>Intereses:</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="CLIMA"
                checked={interests.includes("CLIMA")}
                onChange={handleInterestChange}
              />
              CLIMA
            </label>
            <label>
              <input
                type="checkbox"
                value="DEPORTES"
                checked={interests.includes("DEPORTES")}
                onChange={handleInterestChange}
              />
              DEPORTES
            </label>
            <label>
              <input
                type="checkbox"
                value="FARANDULA"
                checked={interests.includes("FARANDULA")}
                onChange={handleInterestChange}
              />
              FARANDULA
            </label>
            <label>
              <input
                type="checkbox"
                value="EMERGENCIA"
                checked={interests.includes("EMERGENCIA")}
                onChange={handleInterestChange}
              />
              EMERGENCIA
            </label>
            <label>
              <input
                type="checkbox"
                value="SALUD"
                checked={interests.includes("SALUD")}
                onChange={handleInterestChange}
              />
              SALUD
            </label>
            <label>
              <input
                type="checkbox"
                value="POLITICA"
                checked={interests.includes("POLITICA")}
                onChange={handleInterestChange}
              />
              POLITICA
            </label>
            <label>
              <input
                type="checkbox"
                value="TECNOLOGIA"
                checked={interests.includes("TECNOLOGIA")}
                onChange={handleInterestChange}
              />
              TECNOLOGIA
            </label>
            <label>
              <input
                type="checkbox"
                value="ECONOMIA"
                checked={interests.includes("ECONOMIA")}
                onChange={handleInterestChange}
              />
              ECONOMIA
            </label>
            <label>
              <input
                type="checkbox"
                value="CIENCIA"
                checked={interests.includes("CIENCIA")}
                onChange={handleInterestChange}
              />
              CIENCIA
            </label>
            <label>
              <input
                type="checkbox"
                value="GENERAL"
                checked={interests.includes("GENERAL")}
                onChange={handleInterestChange}
              />
              GENERAL
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
          max-width: 500px;
          margin: auto;
          padding: 2rem;
          background-color: #1F2833;
          color: #C5C6C7;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(102, 252, 241, 0.1);
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

        input[type="email"],
        input[type="password"],
        input[type="text"],
        input[type="date"],
        select {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.5rem;
          background-color: #0B0C10;
          border: 1px solid #45A29E;
          border-radius: 5px;
          color: #C5C6C7;
          transition: all 0.3s ease;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #66FCF1;
          box-shadow: 0 0 10px rgba(102, 252, 241, 0.2);
        }

        .checkbox-group {
          background-color: #0B0C10;
          padding: 1rem;
          border-radius: 5px;
          border: 1px solid #45A29E;
          margin-top: 0.5rem;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          margin: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .checkbox-group label:hover {
          background-color: rgba(102, 252, 241, 0.1);
        }

        .checkbox-group input[type="checkbox"] {
          width: auto;
          margin-right: 0.5rem;
          accent-color: #66FCF1;
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

        .notification {
          text-align: center;
          color: #66FCF1;
          margin-top: 1rem;
          padding: 1rem;
          background-color: rgba(102, 252, 241, 0.1);
          border-radius: 5px;
          text-shadow: 0 0 10px rgba(102, 252, 241, 0.3);
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
};

export default SignUp;