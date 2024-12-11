interface UserData {
  age: number;
  occupation: string;
}

const hamburgerOptions: Record<string, string[]> = {
  estudiante: ['Universitario', 'Escolar'],
  profesional: ['Divulgador', 'Ingeniero', 'Pedagogía', 'Científico'],
  comun: ['Inf Simple', 'Inf Detallada']
};

export function categorizeUser({ age, occupation }: UserData): { firstCat: string, secondCatOptions: string[] } {
  let firstCat = '';
  let secondCatOptions: string[] = [];

  if (age < 18) {
    firstCat = 'estudiante';
    secondCatOptions = hamburgerOptions.estudiante.filter(option => option === 'Escolar');
  } else if (age >= 18 && age <= 24) {
    firstCat = 'estudiante';
    secondCatOptions = hamburgerOptions.estudiante.filter(option => option === 'Universitario');
  } else if (age >= 25 && age <= 50) {
    firstCat = 'profesional';
    secondCatOptions = hamburgerOptions.profesional;
  } else if (age >= 51 && age <= 60) {
    firstCat = 'comun';
    secondCatOptions = hamburgerOptions.comun.filter(option => option === 'Inf Detallada');
  } else {
    firstCat = 'comun';
    secondCatOptions = hamburgerOptions.comun.filter(option => option === 'Inf Simple');
  }

  return { firstCat, secondCatOptions };
}