"use client";

import  Link  from 'next/link'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [studies, setStudies] = useState('');
  const [category, setCategory] = useState('');
  const [notification, setNotification] = useState(''); // Para la notificación

  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Lógica de categorización basada en el nivel de estudios
    let userCategory = '';
    if (studies === 'profesionales') {
      userCategory = 'Profesional';
    } else if (studies === 'cursando') {
      userCategory = 'Joven';
    } else {
      userCategory = 'Adulto Mayor';
    }

    setCategory(userCategory);
    setNotification(`Hola ${name}, te hemos categorizado como: ${userCategory}.`);

    // Mostrar la notificación durante 3 segundos y luego redirigir
    setTimeout(() => {
      router.push('/'); // Redirigir a la página principal
    }, 3000);
  };

  return (
    <div>
      <div className="container">
        <h1>Registro de Usuario</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label htmlFor="birthYear">Año de Nacimiento:</label>
            <input
              type="number"
              id="birthYear"
              name="birthYear"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              min="1900"
              max="2023"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="studies">Nivel de Estudios:</label>
            <select
              id="studies"
              name="studies"
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

          <button type="submit">Enviar</button>
        </form>
        <p>
        ¿Ya tienes cuenta?{" "}
        <Link href="/sign-in">Ingresa aquí</Link>
        </p>
        

        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #1a1a2e;
          padding: 20px;
        }

        .container {
          background-color: #16213e;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(255, 105, 180, 0.75);
          max-width: 380px;
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

        input[type="text"],
        input[type="email"],
        input[type="number"],
        select {
          width: 95%;
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
          margin-top: 10px;
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

        input:focus,
        select:focus {
          border-color: #00ffff;
          outline: none;
          box-shadow: 0 0 5px #00ffff;
        }

        .notification {
          margin-top: 20px;
          padding: 10px;
          background-color: #00ffcc;
          color: #000;
          text-align: center;
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(0, 255, 204, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SignUp;
