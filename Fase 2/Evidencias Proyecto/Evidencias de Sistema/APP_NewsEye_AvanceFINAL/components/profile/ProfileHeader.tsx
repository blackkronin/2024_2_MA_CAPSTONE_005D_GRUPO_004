"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import '@/app/Profile.css';

const ProfileHeader = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    user_category: '',
    occupation: '',
    interests: [] as string[] // Asegura que interests es un array
  });

  // Función para obtener datos del usuario
  const fetchUserProfile = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return user;
    } 

  

    // Extrae los datos del usuario autenticado
    if (user) {
      const { full_name, user_category, interests, studies } = user.user_metadata;
      setProfile({
        full_name: full_name || 'Usuario desconocido',
        email: user.email || 'Email no disponible',
        user_category: user_category || 'Categoría no especificada',
        occupation: studies || 'Ocupación no especificada',
        interests: Array.isArray(interests) 
        ? interests 
        : typeof interests === "string" 
          ? interests.split(", ").map((item) => item.trim()) // Convierte una cadena en un array
          : []
      });
    }
  };

  // Ejecuta fetchUserProfile al montar el componente
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="profile-header">
      <img src="https://via.placeholder.com/80" alt="Profile" className="profile-picture" />
      <div className="profile-info">
        <h2>{profile.full_name}</h2>
        <p><strong>Correo:</strong> {profile.email}</p>
        <p><strong>Tipo de usuario:</strong> {profile.user_category}</p>
        <p><strong>Ocupación:</strong> {profile.occupation}</p>
        <div className="profile-interests">
          <strong>Intereses:</strong>
          <ul>
            {profile.interests.map((interest, index) => (
              <li key={index}>{interest}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
