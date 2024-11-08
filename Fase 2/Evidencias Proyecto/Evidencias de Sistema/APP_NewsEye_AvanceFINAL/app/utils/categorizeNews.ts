import { Article } from '@/utils/newsapi/traer_noticas';

export type UserInterest = 'CLIMA' | 'DEPORTES' | 'FARANDULA' | 'EMERGENCIA' | 'SALUD' | 'POLITICA' | 'TECNOLOGIA' | 'ECONOMIA' | 'CIENCIA' | 'GENERAL';

export const categoryKeywords: Record<UserInterest, string[]> = {
  CLIMA: ['climate', 'weather', 'temperatura', 'clima', 'meteorolog', 'storm', 'lluvia', 'weather forecast'],
  DEPORTES: ['sports', 'football', 'soccer', 'basketball', 'deportes', 'futbol', 'nfl', 'nba', 'league'],
  FARANDULA: ['celebrity', 'entertainment', 'hollywood', 'movie', 'actor', 'actress', 'farandula', 'television'],
  EMERGENCIA: ['emergency', 'crisis', 'disaster', 'alert', 'warning', 'emergencia', 'desastre', 'catastrofe'],
  SALUD: ['health', 'medical', 'medicine', 'healthcare', 'disease', 'salud', 'hospital', 'doctor'],
  POLITICA: ['politics', 'government', 'election', 'political', 'congress', 'politica', 'gobierno'],
  TECNOLOGIA: ['tech', 'technology', 'digital', 'software', 'hardware', 'tecnologia', 'innovation'],
  ECONOMIA: ['economy', 'financial', 'market', 'business', 'trade', 'economia', 'mercado', 'finanzas'],
  CIENCIA: ['science', 'research', 'study', 'scientific', 'ciencia', 'investigacion', 'discovery'],
  GENERAL: ['news', 'world', 'global', 'international', 'national', 'noticias', 'actualidad']
};

export function categorizeArticle(article: Article): UserInterest {
  if (!article.title && !article.description) return 'GENERAL';
  
  const titleAndDesc = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  
  // Primero intentamos encontrar una coincidencia exacta
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => titleAndDesc.includes(keyword.toLowerCase()))) {
      return category as UserInterest;
    }
  }

  // Si no encontramos coincidencia exacta, buscamos coincidencias parciales
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      const keywordParts = keyword.toLowerCase().split(' ');
      if (keywordParts.every(part => titleAndDesc.includes(part))) {
        return category as UserInterest;
      }
    }
  }

  return 'GENERAL';
}

export function getKeywordsForInterest(interest: UserInterest): string[] {
  return categoryKeywords[interest] || [];
}