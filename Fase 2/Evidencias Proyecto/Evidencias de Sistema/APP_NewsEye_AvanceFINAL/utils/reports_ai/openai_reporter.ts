// utils/reports_ai/openai_reporter.ts
import { OpenAI } from 'openai';
import { supabase } from '../supabase/client';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const fetchUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};


interface Article {
  title: string;
  url: string;
  content: string;
}

export async function generarStudentUniversityReport(articles: Article[], query: string,tone: string): Promise<ReadableStream> {
  const user = await fetchUser();
  const userInfo = user ? `
    Nombre Completo: ${user.user_metadata.full_name}
    Categoría de Usuario: ${user.user_metadata.user_category}
    Intereses: ${user.user_metadata.interests}
  ` : 'Información del usuario no disponible.';

  const prompt = `
    Información del Usuario:
    -------------------------------------------------
    ${userInfo}
    -------------------------------------------------
    Información:
    -------------------------------------------------
    ${articles.map((a) => `${a.title}: ${a.content}`).join("\n")}
    -------------------------------------------------
    Usando solo la información de arriba, responde la consulta: "${query}" en un informe detallado con el siguiente tono: ${tone}. 
    El informe debe:
    - Estar bien estructurado, con secciones como Resumen,Introducción,Planteamiento del asunto,Punto de vista del autor,Argumento de apoyo,Contexto socio-histórico-cultural,Conclusión,Reacción personal.
    - Usar Markdown y formato de citas en estilo APA.
    - Organizar la información de forma lógica 
    - Incluir pruebas y ejemplos 
    - Realizar una encuesta exhaustiva
    - Elaborar una conclusión significativa 
    - Utilizar títulos y subtítulos para organizar el contenido 
    - Citar las fuentes de información que se hayan consultado 
    - Incluir referencias bibliográficas al final del informe 
    - Escribir párrafos cortos y claros 
    - Utilizar un lenguaje claro y preciso 
    - Revisar y editar el informe para eliminar información innecesaria o confusa
    - Incluir referencias en línea con formato [in-text citation](url).
    - Terminar con una lista de referencias, usando URLs completas sin duplicados.
    - No debe superar las 1500 palabras o el limite permitido por tu modelo.

    Instrucciones adicionales:
    - Usa fuentes confiables y actuales, priorizando relevancia.
    - Cada URL debe estar hipervinculada: [url website](url).
    - Fecha actual: ${new Date().toISOString().split("T")[0]}.

    Formato de Markdown:
    - Título principal: # Título
    - Encabezados principales: ## Encabezado
    - Subtítulos: ### Subtítulo
    - Cuerpo del texto con párrafos normales.

  `;


  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: prompt },
    ],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ""));
      }
      controller.close();
    },
  });
}

export async function generarStudentAdultReport(articles: Article[], query: string,tone: string): Promise<ReadableStream> {
  const user = await fetchUser();
  const userInfo = user ? `
    Nombre Completo: ${user.user_metadata.full_name}
    Categoría de Usuario: ${user.user_metadata.user_category}
    Intereses: ${user.user_metadata.interests}
  ` : 'Información del usuario no disponible.';

  const prompt = `
    Información del Usuario:
    -------------------------------------------------
    ${userInfo}
    -------------------------------------------------
    Información:
    -------------------------------------------------
    ${articles.map((a) => `${a.title}: ${a.content}`).join("\n")}
    -------------------------------------------------
    Usando solo la información de arriba, responde la consulta: "${query}" en un informe detallado con el siguiente tono: ${tone}. 
    El informe debe:
    - Estar bien estructurado, con secciones como Página de título, Términos de referencia, Resumen, Índice, Introducción, Métodos, Resultados, Cuerpo principal, Conclusión.
    - Usar Markdown y formato de citas en estilo APA.
    - Organizar la información de forma lógica 
    - Incluir pruebas y ejemplos 
    - Elaborar una conclusión significativa 
    - Utilizar títulos y subtítulos para organizar el contenido 
    - Citar las fuentes de información que se hayan consultado 
    - Incluir referencias bibliográficas al final del informe 
    - Escribir párrafos cortos y claros 
    - Utilizar un lenguaje claro y preciso 
    - Revisar y editar el informe para eliminar información innecesaria o confusa
    - Incluir referencias en línea con formato [in-text citation](url).
    - Terminar con una lista de referencias, usando URLs completas sin duplicados.

    Instrucciones adicionales:
    - Usa fuentes confiables y actuales, priorizando relevancia.
    - Cada URL debe estar hipervinculada: [url website](url).
    - Fecha actual: ${new Date().toISOString().split("T")[0]}.

    Formato de Markdown:
    - Título principal: # Título
    - Encabezados principales: ## Encabezado
    - Subtítulos: ### Subtítulo
    - Cuerpo del texto con párrafos normales.

  `;


  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: prompt },
    ],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ""));
      }
      controller.close();
    },
  });
}

export async function generarProfessionalAdultReport(articles: Article[], query: string,tone: string): Promise<ReadableStream> {
  const user = await fetchUser();
  const userInfo = user ? `
    Nombre Completo: ${user.user_metadata.full_name}
    Categoría de Usuario: ${user.user_metadata.user_category}
    Intereses: ${user.user_metadata.interests}
  ` : 'Información del usuario no disponible.';

  const prompt = `
    Información del Usuario:
    -------------------------------------------------
    ${userInfo}
    -------------------------------------------------
    Información:
    -------------------------------------------------
    ${articles.map((a) => `${a.title}: ${a.content}`).join("\n")}
    -------------------------------------------------
    Usando solo la información de arriba, responde la consulta: "${query}" en un informe detallado donde se estudian problemas, estrategias de mejora y se analiza meticulosamente el contexto de dicha idea con el siguiente tono: ${tone}. 
    El informe debe:
    Pasos a seguir:
    1.Analiza la idea, la tesis o pensamiento que se quiere estudiar a fondo. Lee sobre ella, infórmate con libros, documentales y todo tipo de pensamientos suscitados al respecto.
    2.Escribe de una forma objetiva, sin exponer tu pensamiento, sobre la idea en cuestión. Qué es, qué significado ha tenido a lo largo de la historia, evolución, etc.
    3.Seguidamente, haz una exposición de todas aquellas tesis contrarias a la idea que estás estudiando. A partir del pensamiento y creencia, siempre bien fundamentados y racionalizados, que rebatan dicha idea, crea también una antítesis.
    4.Pon muchos ejemplos de críticas hacia tu idea o pensamiento, todos los que puedas, a poder ser de personajes importantes. Cita bibliografía de la que sacas dichos pensamientos.
    5.Con la tesis y antítesis del problema, crea tu propio pensamiento. Redacta dando tu opinión, a través de todo lo expuesto anteriormente. Dí qué te parece realmente a ti la cuestión, si estás de acuerdo o no, y el porqué. Debes ser lo más racional posible y demostrar en todo momento tus argumentos.
    6.Una vez terminada, revisa bien la sintaxis de tu escrito, además de la ortografía. Intenta que quede lo mejor escrito posible, ya que así dará más credibilidad

    Instrucciones adicionales:
    - Infórmate mucho sobre el tema a tratar.
    - Lee mucho y así podrás desarrollar tu pensamiento crítico y reflexivo.
    - Usa fuentes confiables y actuales, priorizando relevancia.
    - Cada URL debe estar hipervinculada: [url website](url).
    - Fecha actual: ${new Date().toISOString().split("T")[0]}.

    Formato de Markdown:
    - Título principal: # Título
    - Encabezados principales: ## Encabezado
    - Subtítulos: ### Subtítulo
    - Cuerpo del texto con párrafos normales.

  `;


  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: prompt },
    ],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ""));
      }
      controller.close();
    },
  });
}

export async function generarThirdAgeReport(articles: Article[], query: string,tone: string): Promise<ReadableStream> {
  const user = await fetchUser();
  const userInfo = user ? `
    Nombre Completo: ${user.user_metadata.full_name}
    Categoría de Usuario: ${user.user_metadata.user_category}
    Intereses: ${user.user_metadata.interests}
  ` : 'Información del usuario no disponible.';

  const prompt = `
    Información del Usuario:
    -------------------------------------------------
    ${userInfo}
    -------------------------------------------------
    Información:
    -------------------------------------------------
    ${articles.map((a) => `${a.title}: ${a.content}`).join("\n")}
    -------------------------------------------------
    Usando solo la información de arriba, responde la consulta: "${query}" en un informe detallado con el siguiente tono: ${tone}. 
    El informe debe:
    - Estar bien estructurado, con secciones como Portada, Objetivo, Resumen, Introducción, Desarrollo, Conclusiones.
    - Usar Markdown y formato de citas en estilo APA.
    - Organizar la información de forma lógica 
    - Incluir pruebas y ejemplos 
    - Realizar una encuesta exhaustiva
    - Elaborar una conclusión significativa 
    - Utilizar títulos y subtítulos para organizar el contenido 
    - Citar las fuentes de información que se hayan consultado 
    - Incluir referencias bibliográficas al final del informe 
    - Limitar la subjetividad y describir los hechos observados sin opiniones.
    - Mencionar todos los datos posibles.
    - Usar párrafos cortos y concisos.
    - Utilizar un lenguaje claro y preciso.
    - Evitar la ambigüedad y utilizar términos específicos.
    - Incluir referencias en línea con formato [in-text citation](url).
    - Terminar con una lista de referencias, usando URLs completas sin duplicados.
    - No debe superar las 1500 palabras o el limite permitido por tu modelo.

    Instrucciones adicionales:
    - Como está pensado para un público adulto mayor, evita tecnicismos y términos complejos.
    - Usa fuentes confiables y actuales, priorizando relevancia.
    - Cada URL debe estar hipervinculada: [url website](url).
    - Fecha actual: ${new Date().toISOString().split("T")[0]}.

    Formato de Markdown:
    - Título principal: # Título
    - Encabezados principales: ## Encabezado
    - Subtítulos: ### Subtítulo
    - Cuerpo del texto con párrafos normales.

  `;


  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: prompt },
    ],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ""));
      }
      controller.close();
    },
  });
}

export async function generarCommonUserReport(articles: Article[], query: string,tone: string): Promise<ReadableStream> {
  const user = await fetchUser();
  const userInfo = user ? `
    Nombre Completo: ${user.user_metadata.full_name}
    Categoría de Usuario: ${user.user_metadata.user_category}
    Intereses: ${user.user_metadata.interests}
  ` : 'Información del usuario no disponible.';

  const prompt = `
    Información del Usuario:
    -------------------------------------------------
    ${userInfo}
    -------------------------------------------------
    Información:
    -------------------------------------------------
    ${articles.map((a) => `${a.title}: ${a.content}`).join("\n")}
    -------------------------------------------------
    Usando solo la información de arriba, responde la consulta: "${query}" en un informe detallado con el siguiente tono: ${tone}. 
    El informe debe:
    - Estar bien estructurado, con secciones como Portada,Índice,Resumen e Introducción,Desarrollo,Conclusiones,Recomendaciones,Anexos y Bibliografía.
    - Usar Markdown y formato de citas en estilo APA.
    - Organizar la información de forma lógica 
    - Incluir pruebas y ejemplos 
    - Realizar una encuesta exhaustiva
    - Elaborar una conclusión significativa 
    - Utilizar títulos y subtítulos para organizar el contenido 
    - Citar las fuentes de información que se hayan consultado 
    - Incluir referencias bibliográficas al final del informe 
    - Limitar la subjetividad y describir los hechos observados sin opiniones.
    - Mencionar todos los datos posibles.
    - Usar párrafos cortos y concisos.
    - Utilizar un lenguaje claro y preciso.
    - Evitar la ambigüedad y utilizar términos específicos.
    - Incluir referencias en línea con formato [in-text citation](url).
    - Terminar con una lista de referencias, usando URLs completas sin duplicados.
    - No debe superar las 1500 palabras o el limite permitido por tu modelo.

    Instrucciones adicionales:
    - Usa fuentes confiables y actuales, priorizando relevancia.
    - Cada URL debe estar hipervinculada: [url website](url).
    - Fecha actual: ${new Date().toISOString().split("T")[0]}.

    Formato de Markdown:
    - Título principal: # Título
    - Encabezados principales: ## Encabezado
    - Subtítulos: ### Subtítulo
    - Cuerpo del texto con párrafos normales.

  `;


  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: prompt },
    ],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ""));
      }
      controller.close();
    },
  });
}

export async function generarCommonUserYoungReport(articles: Article[], query: string,tone: string): Promise<ReadableStream> {
  const user = await fetchUser();
  const userInfo = user ? `
    Nombre Completo: ${user.user_metadata.full_name}
    Categoría de Usuario: ${user.user_metadata.user_category}
    Intereses: ${user.user_metadata.interests}
  ` : 'Información del usuario no disponible.';

  const prompt = `
    Información del Usuario:
    -------------------------------------------------
    ${userInfo}
    -------------------------------------------------
    Información:
    -------------------------------------------------
    ${articles.map((a) => `${a.title}: ${a.content}`).join("\n")}
    -------------------------------------------------
    Usando solo la información de arriba, responde la consulta: "${query}" en un informe detallado con el siguiente tono: ${tone}. 
    El informe debe:
    - Estar bien estructurado, con secciones como Introducción, Desarrollo, Conclusión y Referencias.
    - Usar Markdown y formato de citas en estilo APA.
    - Ser profundo y comprensivo, basado en hechos y números si están disponibles, y con una extensión mínima de 1000 palabras.
    - Incluir referencias en línea con formato [in-text citation](url).
    - Terminar con una lista de referencias, usando URLs completas sin duplicados.

    Instrucciones adicionales:
    - Usa fuentes confiables y actuales, priorizando relevancia.
    - Cada URL debe estar hipervinculada: [url website](url).
    - Fecha actual: ${new Date().toISOString().split("T")[0]}.

    Formato de Markdown:
    - Título principal: # Título
    - Encabezados principales: ## Encabezado
    - Subtítulos: ### Subtítulo
    - Cuerpo del texto con párrafos normales.

  `;


  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: prompt },
    ],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ""));
      }
      controller.close();
    },
  });
}