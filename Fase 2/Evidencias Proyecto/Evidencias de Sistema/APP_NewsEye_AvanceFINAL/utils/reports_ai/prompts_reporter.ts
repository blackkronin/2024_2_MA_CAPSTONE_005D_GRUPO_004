import { OpenAI } from 'openai';
import { supabase } from '../supabase/client';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Definir tipos para las configuraciones
export type ConfigurationsType = {
  estudiante: {
    Universitario: { structure: string[]; tone: string };
    Escolar: { structure: string[]; tone: string };
  };
  profesional: {
    Ingeniero: { structure: string[]; tone: string };
    Científico: { structure: string[]; tone: string };
    Pedagogía: { structure: string[]; tone: string };
    Divulgador: { structure: string[]; tone: string };
  };
  comun: {
    Simple: { structure: string[]; tone: string };
    Detallado: { structure: string[]; tone: string };
  };
};

const configurations:ConfigurationsType = {
  estudiante: {
    Universitario: { structure: ["Resumen", "Introducción", "Resultados", "Conclusión"], tone: "formal educativo" },
    Escolar: { structure: ["Resumen", "Ejemplos", "Conclusión"], tone: "sencillo" },
  },
  profesional: {
    Ingeniero: { structure: ["Resumen técnico", "Especificaciones","Técnicas y Estrategias","Propuestas de como aplicar","Conclusión"], tone: "técnico" },
    Científico: { structure: ["Introducción", "Metodología","Evidencia Científica", "Resultados", "Discusión"], tone: "académico" },
    Pedagogía: { structure: ["Datos clave", "Propuestas","Como doctrinar","Juegos de aprendizaje recomendados", "Conclusión"], tone: "educativo" },
    Divulgador: { structure: ["Introducción", "Narrativa", "Pruebas", "Conclusión"], tone: "persuasivo" },
  },
  comun: {
    Simple: { structure: ["Resumen", "Información básica", "Conclusión"], tone: "claro" },
    Detallado: { structure: ["Resumen", "Análisis", "Conclusión"], tone: "formal" },
  },
};

export const fetchUserCategories = async (userId: string) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('first_cat, second_cat')
    .eq('id', userId)
    .single();

  if (error || !data) throw new Error('Error al obtener las categorías del usuario.');

  return {
    primaryCategory: data.first_cat as keyof ConfigurationsType,
    secondaryCategory: data.second_cat as keyof ConfigurationsType,
  };
};

// Nueva función para obtener la configuración basada en categorías
export const getConfigForUser = (
  primaryCategory: keyof ConfigurationsType,
  secondaryCategory: string
): ConfType => {
  const primaryConfig = configurations[primaryCategory];
  if (!primaryConfig) {
    throw new Error(`Categoría primaria no encontrada: ${primaryCategory}`);
  }

  const secondaryConfig = (primaryConfig as any)[secondaryCategory];
  if (!secondaryConfig) {
    console.warn(`Categoría secundaria no encontrada: ${secondaryCategory}, usando fallback.`);
    return {
      structure: ["Resumen", "Introducción", "Desarrollo", "Conclusión"],
      tone: "neutral",
    };
  }

  return secondaryConfig;
};

/*categorias de informe */
export const topics: string[] = ["conocimiento", "profesion", "para_mi"];
export const selectedTopic: string = topics[0];
type ConfType = {
  structure: string[]; tone: string ;}
export const generateDynamicPrompt = (
  userInfo: string,
  articles: { title: string; content: string }[],
  query: string,
  primaryCategory: keyof ConfigurationsType,
  secondaryCategory: typeof primaryCategory,
): string => {
  

      
  const config: ConfType = getConfigForUser(primaryCategory, secondaryCategory);

  const formattedArticles = articles.map(a => `${a.title}: ${a.content}`).join("\n");

  return `
  Informe de Consulta

  Información del Usuario:
  -------------------------------------------------
  ${userInfo}
  -------------------------------------------------

  Información de los Artículos:
  -------------------------------------------------
  ${articles.map((a) => `${a.title}: ${a.content}`).join("\n")}
  -------------------------------------------------

  Consulta:
  Utilizando únicamente la información proporcionada arriba, responde la siguiente consulta de forma detallada: "${query}".

  Tono:
  El informe debe escribirse con el siguiente tono: ${config.tone}.

  Estructura del Informe:
  El informe debe seguir esta estructura: ${config.structure.join(", ")}.

  Requisitos Adicionales:
  - Asegúrate de utilizar la estructura de informe señalada y el tono especificado para redactar el informe.
  - Profundiza en los conceptos del tono y de la estructura para generar una idea clara del destinatario del informe y sus necesidades.
  - Organiza la información de manera lógica, asegurando una presentación coherente y fácil de seguir.
  - Incluye pruebas y ejemplos para respaldar los puntos abordados a lo largo del informe.
  - Elabora una conclusión significativa que resuma los hallazgos y brinde una perspectiva clara.
  - Utiliza títulos y subtítulos para estructurar y organizar el contenido de manera efectiva.
  - Cita todas las fuentes de información consultadas y añade referencias bibliográficas al final del informe siguiendo el formato APA.
  - Emplea un lenguaje claro y preciso que facilite la comprensión del contenido.
  - Usa Markdown y el formato APA para las referencias, asegurando la cohesión en el formato del documento.
  - Incluye citas en el texto con formato [cita en texto](url) para mantener la claridad y la referencia adecuada.
  - Termina con una lista detallada de referencias, sin duplicados, utilizando URLs completas para facilitar el acceso a las fuentes.

  Instrucciones Adicionales:
  - Usa fuentes confiables y actuales, priorizando la relevancia y precisión de la información.
  - Asegúrate de que cada URL esté hipervinculada en el formato [nombre del sitio](url).
  - Limita la extensión del informe a 1500 palabras para mantener la concisión y la claridad.
  - Incluye la fecha actual: ${new Date().toISOString().split("T")[0]}.
  - Define la categoría exacta a la que se relaciona el reporte y guárdala en una variable ${selectedTopic} para su importación a la base de datos: ${topics}.

  Formato de Markdown:
  - Título principal: # Título
  - Encabezados principales: ## Encabezado
  - Subtítulos: ### Subtítulo
  - Cuerpo del texto con párrafos normales.
  - Listas: * Ítem 1, * Ítem 2, * Ítem 3
  `;
  /*? */
};
