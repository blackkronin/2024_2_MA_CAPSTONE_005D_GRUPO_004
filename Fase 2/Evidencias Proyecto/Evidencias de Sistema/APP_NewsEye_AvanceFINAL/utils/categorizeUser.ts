interface UserData {
  age: number;
  occupation: string;
}

export function categorizeUser({ age, occupation }: UserData): string {
  // Convertimos occupation a minúsculas para comparación consistente
  const job = occupation?.toLowerCase() || '';

  // Verificamos si es estudiante
  if (job.includes('estudiante')) {
    if (age < 18) return 'Estudiante Joven';
    if (age < 25) return 'Estudiante Universitario';
    return 'Estudiante Adulto';
  }

  // Categorías por edad si no es estudiante
  if (age < 18) return 'Joven';
  if (age < 30) return 'Joven Adulto';
  if (age < 60) return 'Adulto';
  return 'Adulto Mayor';
} 