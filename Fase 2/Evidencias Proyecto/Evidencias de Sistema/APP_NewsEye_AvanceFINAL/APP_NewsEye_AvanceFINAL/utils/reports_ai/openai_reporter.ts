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



export async function generateDetailedReport(articles: Article[], query: string, tone: string): Promise<ReadableStream> {
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