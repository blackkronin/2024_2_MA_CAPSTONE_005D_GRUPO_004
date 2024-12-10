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
  const [interests, setInterests] = useState<string[]>([]); // Cambiado a array para múltiples intereses
  const [first_cat, setFirstCat] = useState('');
  const [second_cat, setSecondCat] = useState('');
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

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
        interests: string;
        first_cat: string;
        second_cat: string;
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

    let firstCat = '';
    if (age < 18) {
      firstCat = 'estudiante';
    } else if (age >= 18 && age <= 65) {
      firstCat = 'profesional';
    } else {
      firstCat = 'comun';
    }

    setFirstCat(firstCat);

    const signUpData: SignUpData = {
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/',
        data: {
          full_name: name,
          birth_date: birthDate,
          age: age,
          interests: interests.join(','),
          first_cat: firstCat,
          second_cat: second_cat,
        },
      },
    };

    const { data, error: signUpError } = await supabase.auth.signUp(signUpData);

    if (signUpError) {
      console.log("Error en el registro:", signUpError);
      setError(`Database error: ${signUpError.message}`);
      return;
    }

    if (firstCat === 'comun') {
      setNotification(`Hola ${name}, te has registrado exitosamente como un Usuario Común. Por favor, revisa tu correo para confirmar tu cuenta antes de iniciar sesión.`);
    } else {
      setNotification(`Hola ${name}, te has registrado exitosamente como ${firstCat}. Por favor, revisa tu correo para confirmar tu cuenta antes de iniciar sesión.`);
    }

    setTimeout(() => {
      router.push('/sign-in');
    }, 5000);

    console.log("Registro exitoso:", data);
  };

  const hamburgerOptions: Record<string, string[]> = {
    estudiante: ['Universitario', 'Escolar'],
    profesional: ['Divulgador', 'Ingeniero', 'Pedagogía', 'Científico'],
    comun: ['Inf Simple', 'Inf Detallada']
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        <h1>Registro de Usuario</h1>
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
        {first_cat === 'profesional' && (
          <div className="form-group">
            <label htmlFor="secondCat">Subcategoría:</label>
            <select
              id="secondCat"
              value={second_cat}
              onChange={(e) => setSecondCat(e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {hamburgerOptions[first_cat]?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
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
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          background-color: #141414;
          color: #C5C6C7;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(102, 252, 241, 0.1);
        }

        h1 {
          text-align: center;
          color: #66FCF1;
          font-size: 1.8rem;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        label {
          display: block;
          font-size: 0.9rem;
          color: #66FCF1;
          margin-bottom: 0.5rem;
        }

        input, select {
          width: 100%;
          padding: 0.75rem;
          background-color: #1a1a1a;
          border: none;
          border-radius: 4px;
          color: #C5C6C7;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          padding: 1rem;
          background-color: #1a1a1a;
          border-radius: 4px;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #66FCF1;
          font-size: 0.85rem;
        }

        .checkbox-group input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #66FCF1;
          margin: 0;
        }

        button[type="submit"] {
          width: 100%;
          padding: 0.75rem;
          background-color: #66FCF1;
          border: none;
          color: #000000;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
          text-transform: uppercase;
        }

        .login-link {
          text-align: center;
          margin-top: 1rem;
          color: #aaa;
        }
        .login-link a {
          color: #66FCF1;
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
        .subcategory-container {
          position: relative;
          margin-top: 0.5rem;
        }
        .hamburger-button {
          width: 100%;
          padding: 0.5rem;
          background-color: #333;
          border: 1px solid #555;
          color: #fff;
          text-align: left;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          height: 35px;
        }
        .hamburger-menu {
          position: absolute;
          width: 100%;
          background-color: #333;
          border: 1px solid #555;
          border-radius: 4px;
          margin-top: 2px;
          z-index: 10;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .menu-option {
          width: 100%;
          padding: 0.5rem;
          text-align: left;
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 0.85rem;
          height: 35px;
        }
        .menu-option:hover {
          background-color: #444;
        }
        .menu-option.selected {
          background-color: #45A29E;
        }
        input[type="date"] {
          width: 100%;
          padding: 0.75rem;
          background-color: #1a1a1a;
          border: none;
          border-radius: 4px;
          color: #C5C6C7;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.7;
          cursor: pointer;
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default SignUp;