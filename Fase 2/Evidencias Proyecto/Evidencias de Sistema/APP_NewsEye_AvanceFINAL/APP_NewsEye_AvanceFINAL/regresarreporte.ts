const { tavily } = require("@tavily/core"); // Cliente Tavily
const { OpenAI } = require("openai"); // Importar OpenAI
const fs = require("fs"); // Para guardar el informe
const readline = require("readline"); // Para la entrada del usuario

// Instanciar el cliente Tavily
const tvly = tavily({ apiKey: "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" });

// Instanciar el cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY // Asegúrate de que la variable de entorno esté configurada
});

// Definición de tonos
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

// Función para solicitar el tono al usuario
function askForTone(userPrompt: string) {
  console.log("Seleccione el tono para el informe:");
  Object.keys(Tone).forEach((key, index) => {
    console.log(`${index + 1}. ${Tone[key]}`);
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Ingrese el número del tono deseado: ", (answer: string) => { // Especificar el tipo de 'answer'
    const toneIndex = parseInt(answer) - 1;
    if (toneIndex >= 0 && toneIndex < Object.keys(Tone).length) {
      const selectedTone = Object.keys(Tone)[toneIndex];
      rl.close();
      searchAndGenerateReport(userPrompt, selectedTone);
    } else {
      console.log("Selección inválida. Intente de nuevo.");
      rl.close();
      askForTone(userPrompt); // Volver a preguntar si la selección es inválida
    }
  });
}

// Función para buscar información y generar el informe
async function searchAndGenerateReport(userPrompt: string, selectedTone: string) {
  try {
    console.log("Iniciando la búsqueda de artículos...");
    const response = await tvly.search(userPrompt, {
      includeAnswer: true,
      includeImages: true,
      maxResults: 4,
    });
    console.log("Búsqueda completada. Artículos encontrados:", response.results.length);

    const articles = response.results.map((article: any) => ({
      title: article.title,
      url: article.url,
      content: article.content,
      images: response.images || [],
    }));

    console.log("Generando resúmenes de los artículos...");
    const combinedSummary: string[] = [];
    for (let article of articles) {
      const summary = await generateSummary(article.content, selectedTone);
      combinedSummary.push(summary);
    }
    console.log("Resúmenes generados exitosamente.");

    const finalSummary = combinedSummary.join("\n\n"); // Combinar todos los resúmenes en un solo string
    const limitedFinalSummary = limitToWords(finalSummary, 1000); // Limitar el resumen combinado a 1000 palabras

    console.log("Generando introducción...");
    const introduction = await generateIntroduction(userPrompt, selectedTone);
    console.log("Introducción generada.");

    console.log("Generando conclusión...");
    const conclusion = await generateConclusion(limitedFinalSummary, selectedTone);
    console.log("Conclusión generada.");

    // 6. Categorizar el informe
    const category = await categorizeContent(limitedFinalSummary);
    console.log("Categoría generada:", category);

    // 7. Crear el informe final con introducción, resúmenes, y conclusiones
    console.log("Generando informe final...");
    const report = generateFullReport(introduction, limitedFinalSummary, conclusion, articles, category);

    // 8. Guardar el informe en un archivo JSON
    fs.writeFileSync("informe.json", JSON.stringify(report, null, 2));
    console.log("Informe generado exitosamente: informe.json");
  } catch (error) {
    console.error("Error al buscar o generar el informe:", error);
  }
}

// Función para limitar el texto a un número específico de palabras
function limitToWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(" ") + "..."; // Limitar el texto y agregar "..."
}

// Función para generar resúmenes con OpenAI
async function generateSummary(articleContent: string, selectedTone: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "user", content: `Resume el siguiente contenido en 300 palabras con un tono ${Tone[selectedTone]} y asegúrate de que el resumen tenga un final lógico:\n\n${articleContent}` }
    ],
    max_tokens: 400,
  });

  return response.choices[0].message.content.trim();
}

// Función para generar una introducción con OpenAI
async function generateIntroduction(userPrompt: string, selectedTone: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "user", content: `Genera una breve introducción para un informe sobre el siguiente tema: "${userPrompt}" con un tono ${Tone[selectedTone]} y asegúrate de que sea coherente y fluida.` }
    ],
    max_tokens: 200,
  });

  return response.choices[0].message.content.trim();
}

// Función para generar conclusiones basadas en los resúmenes
async function generateConclusion(finalSummary: string, selectedTone: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "user", content: `Genera una conclusión basada en el siguiente resumen con un tono ${Tone[selectedTone]} y asegúrate de que tenga un final lógico:\n\n${finalSummary}` }
    ],
    max_tokens: 250,
  });

  return response.choices[0].message.content.trim();
}

// Función para categorizar el contenido
async function categorizeContent(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "user", content: `Categoriza el siguiente contenido en una de las siguientes categorías: Salud, Humor, Historia, Noticia, etc.:\n\n${content}` }
    ],
    max_tokens: 50,
  });

  return response.choices[0].message.content.trim();
}

// Función para generar el informe final en formato JSON
function generateFullReport(introduction: string, finalSummary: string, conclusion: string, articles: any[], category: string) {
  return {
    introduction,
    summary: finalSummary,
    conclusion,
    references: articles.map(article => ({
      title: article.title,
      url: article.url,
      images: article.images,
    })),
    category, // Añadir la categoría al informe
  };
}

// Iniciar el proceso preguntando por el tono
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question("Ingrese su consulta: ", (userPrompt: string) => {
  rl.close();
  askForTone(userPrompt); // Pasar el prompt ingresado al solicitar el tono
});
