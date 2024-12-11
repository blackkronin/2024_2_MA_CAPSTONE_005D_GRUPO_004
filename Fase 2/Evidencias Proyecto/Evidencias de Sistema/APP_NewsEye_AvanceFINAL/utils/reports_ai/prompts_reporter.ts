import { OpenAI } from 'openai';
import { supabase } from '../supabase/client';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Definir tipos para las configuraciones
export type ConfigurationsType = {
  estudiante: {
    universitario: { structure: string[]; tone: string };
    escolar: { structure: string[]; tone: string };
  };
  profesional: {
    ingeniero: { structure: string[]; tone: string };
    científico: { structure: string[]; tone: string };
    pedagogía: { structure: string[]; tone: string };
    divulgador: { structure: string[]; tone: string };
  };
  comun: {
    simple: { structure: string[]; tone: string };
    detallado: { structure: string[]; tone: string };
  };
};

const configurations:ConfigurationsType = {
  estudiante: {
    universitario: { structure: ["Resumen general", "Introducción", "Resultados", "Análisis profundo" ,"Datos estadísticos", "Conclusión"], tone: "formal educativo" },
    escolar: { structure: ["Resumen", "Ejemplos","glosario de términos", "Conclusión"], tone: "sencillo" },
  },
  profesional: {
    ingeniero: { structure: ["Resumen técnico", "Objetivos y contexto","Problemas o limitaciones","Identificar oportunidades","Idea de implementacion", "Conclusión y siguientes pasos"], tone: "técnico" },
    científico: { structure: ["Introducción", "palabras clave","Metodología", "Resultados", "Discusión"], tone: "académico" },
    pedagogía: { structure: ["Definicion de objetivos de aprendizaje", "Necesidades y conocimientos previos","planificacion de actividades secuenciales", "Recursos y Herramientas", "Estrategias de Evaluación Formativa", "Evaluación y cierre"], tone: "educativo" },
    divulgador: { structure: ["Definicion de tema y relevancia", "analisis de contexto y problemas", "Soluciones y beneficios", "Adaptacion a la audiencia", "Conclusión y llamado a la accion"], tone: "persuasivo" },
  },
  comun: {
    simple: { structure: ["Introducción", "Conexion con interés público","Contextualizacion", "Soluciones resonantes", "Recursos y herramientas","Llamado a la accion "], tone: "directo atractivo" },
    detallado: { structure: ["Contexto", "Marco legal","Análisis de problemas/soluciones", "Participacion de poblacion", "Herramientas para ahondar el tema", "Conclusión "], tone: "directo exhaustivo" },
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
    secondaryCategory: data.second_cat as keyof ConfigurationsType[keyof ConfigurationsType],
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

  const secondaryConfig = (primaryConfig as any)[secondaryCategory.toLowerCase()];
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
  secondaryCategory: keyof ConfigurationsType[keyof ConfigurationsType]
): string => {
  

  
  const config: ConfType = getConfigForUser(primaryCategory, secondaryCategory);
  const Tone = config.tone;
  
  const formattedArticles = articles.map(a => `${a.title}: ${a.content}`).join("\n");

  return `
  Informe de Consulta

  Información del Usuario:

  ${userInfo}


  Información de los Artículos:
 
  ${articles.map((a) => `${a.title}: ${a.content}`).join("\n")}

  Consulta:
  Utilizando únicamente la información proporcionada arriba, responde la siguiente consulta de forma detallada: "${query}".

  Tono:
  El informe debe escribirse con el siguiente tono: ${Tone}.

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
  - Al mencionar al usuario solo menciona información que sea de utilidad y no que tenga que ver con los procesos a realizar.
  - Crea una estructura con titulos dinámicos, claros y que se adecuen al contexto y segun la estructura del usuario.
  - Usa fuentes confiables y actuales, priorizando la relevancia y precisión de la información.
  - Asegúrate de que cada URL esté hipervinculada en el formato [nombre del sitio](url).
  - Limita la extensión del informe a 1500 palabras para mantener la concisión y la claridad.
  - Incluye la fecha actual: ${new Date().toISOString().split("T")[0]}.
  - Define la categoría exacta a la que se relaciona el reporte y guárdala en una variable ${selectedTopic} para su importación a la base de datos: ${topics}

  Formato de Markdown:
  - Título principal: # Título
  - Encabezados principales: ## Encabezado
  - Subtítulos: ### Subtítulo
  - Cuerpo del texto con párrafos normales.
  - Listas: * Ítem 1, * Ítem 2, * Ítem 3
    `;
  /*instruccion adicional de titulos dinámicos */
};
export const determineTopic = (query: string, articles: { title: string; content: string }[]): string => {
  const lowerCaseQuery = query.toLowerCase();
  if (lowerCaseQuery.includes("estudiar") || lowerCaseQuery.includes("tarea") || lowerCaseQuery.includes("información")) {
    return "conocimiento";
  }
  if (lowerCaseQuery.includes("trabajo") || lowerCaseQuery.includes("profesional") || lowerCaseQuery.includes("carrera")) {
    return "profesion";
  }
  return "para_mi";
};