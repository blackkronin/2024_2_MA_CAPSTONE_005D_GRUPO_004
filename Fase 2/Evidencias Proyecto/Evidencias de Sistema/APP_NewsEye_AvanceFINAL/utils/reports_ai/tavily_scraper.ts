// utils/reports_ai/tavily_scraper.ts
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY! });

interface Article {
  title: string;
  url: string;
  content: string;
}

export async function searchArticles(userPrompt: string): Promise<Article[]> {
  try {
    console.log("Iniciando la búsqueda de artículos...");
    const response = await tvly.search(userPrompt, {
      includeAnswer: true,
      includeImages: false,
      maxResults: 8,
    });
    console.log("Búsqueda completada. Artículos encontrados:", response.results.length);

    const articles: Article[] = response.results.map((article: any) => ({
      title: article.title,
      url: article.url,
      content: article.content,
    }));

    return articles;
  } catch (error) {
    console.error("Error al buscar artículos:", error);
    throw error;
  }
}