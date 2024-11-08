// utils/reports_ai/tavily_scraper.ts
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "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" });

export async function searchArticles(userPrompt: string) {
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
      images: article.images || [],
    }));

    return articles;
  } catch (error) {
    console.error("Error al buscar artículos:", error);
    throw error;
  }
}