// utils/reports_ai/openai_reportes.ts
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const Tone: { [key: string]: string } = {
  Objective: "Objetivo (presentación imparcial y sin sesgos de hechos y hallazgos)",
  Formal: "Formal (se ajusta a los estándares académicos con un lenguaje y estructura sofisticados)",
  Analytical: "Analítico (evaluación crítica y examen detallado de datos y teorías)",
  Persuasive: "Persuasivo (convenciendo a la audiencia de un punto de vista o argumento particular)",
  Informative: "Informativo (proporcionando información clara y completa sobre un tema)",
  Explanatory: "Explicativo (aclaración de conceptos y procesos complejos)",
  Descriptive: "Descriptivo (representación detallada de fenómenos, experimentos o estudios de caso)",
  Critical: "Crítico (juzgando la validez y relevancia de la investigación y sus conclusiones)",
  Comparative: "Comparativo (contrastando diferentes teorías, datos o métodos para resaltar diferencias y similitudes)",
  Speculative: "Especulativo (explorando hipótesis y posibles implicaciones o direcciones de investigación futura)",
  Reflective: "Reflexivo (considerando el proceso de investigación y las perspectivas o experiencias personales)",
  Narrative: "Narrativo (contando una historia para ilustrar hallazgos o metodologías de investigación)",
  Humorous: "Humorístico (ligero y entretenido, generalmente para hacer el contenido más relatable)",
  Optimistic: "Optimista (resaltando hallazgos positivos y posibles beneficios)",
  Pessimistic: "Pesimista (enfocándose en limitaciones, desafíos o resultados negativos)",
};

export async function generateSummary(articleContent: string, selectedTone: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: `Resume el siguiente contenido en 300 palabras con un tono ${Tone[selectedTone]} y asegúrate de que el resumen tenga un final lógico:\n\n${articleContent}` }
    ],
    max_tokens: 400,
  });

  return response.choices[0].message.content.trim();
}

export async function generateIntroduction(userPrompt: string, selectedTone: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: `Genera una breve introducción para un informe sobre el siguiente tema: "${userPrompt}" con un tono ${Tone[selectedTone]} y asegúrate de que sea coherente y fluida.` }
    ],
    max_tokens: 200,
  });

  return response.choices[0].message.content.trim();
}

export async function generateConclusion(finalSummary: string, selectedTone: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: `Genera una conclusión basada en el siguiente resumen con un tono ${Tone[selectedTone]} y asegúrate de que tenga un final lógico:\n\n${finalSummary}` }
    ],
    max_tokens: 250,
  });

  return response.choices[0].message.content.trim();
}

export async function categorizeContent(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: `Categoriza el siguiente contenido en una de las siguientes categorías: Salud, Humor, Historia, Noticia, etc.:\n\n${content}` }
    ],
    max_tokens: 50,
  });

  return response.choices[0].message.content.trim();
}

export function generateFullReport(introduction: string, finalSummary: string, conclusion: string, articles: any[], category: string) {
  return {
    introduction,
    summary: finalSummary,
    conclusion,
    references: articles.map(article => ({
      title: article.title,
      url: article.url,
      images: article.images,
    })),
    category,
  };
}