"use client";

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { traerNoticias, Article } from '@/utils/newsapi/traer_noticas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Database } from '@/types/supabase';

type UserInterest = 'CLIMA' | 'DEPORTES' | 'FARANDULA' | 'EMERGENCIA' | 'SALUD' | 'POLITICA' | 'TECNOLOGIA' | 'ECONOMIA' | 'CIENCIA' | 'GENERAL';

const categoryKeywords: Record<UserInterest, string[]> = {
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

const getKeywordsForInterest = (interest: UserInterest): string[] => {
  return categoryKeywords[interest] || [];
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

const TraerNoticiasPersonalizadas = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterParam, setFilterParam] = useState<UserInterest | 'ALL'>('ALL');
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getUserInterests = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('interests')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        
        if (data?.interests) {
          const interests = Array.isArray(data.interests) 
            ? data.interests 
            : typeof data.interests === 'string'
            ? data.interests.split(',').map(i => i.trim() as UserInterest)
            : [data.interests as UserInterest];
          
          setUserInterests(interests);
        }
      } catch (error) {
        console.error('Error:', error);
        setIsError(true);
        setErrorMessage('Error al cargar tus intereses');
      } finally {
        setIsLoading(false);
      }
    };

    getUserInterests();
  }, [supabase]);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const data = await traerNoticias('c9eda70565b646d38e6ecdf2890392e3', 'us', page);
        
        if (userInterests.length === 0) {
          setArticles(data.articles);
          return;
        }

        const filteredArticles = data.articles.filter(article => {
          if (!article.title || !article.description) return false;
          
          const articleText = `${article.title} ${article.description}`.toLowerCase();
          return userInterests.some(interest => {
            const keywords = getKeywordsForInterest(interest);
            return keywords.some(keyword => articleText.includes(keyword.toLowerCase()));
          });
        });

        setArticles(filteredArticles);
      } catch (error) {
        console.error('Error al obtener noticias:', error);
        setIsError(true);
        setErrorMessage('Error al cargar las noticias');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [page, userInterests]);

  const filteredArticles = articles.filter(article => {
    const category = categorizeArticle(article);
    return filterParam === 'ALL' || category === filterParam;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{errorMessage}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Noticias basadas en tus intereses
      </h1>
      
      <div className="flex justify-center mb-6">
        <select
          onChange={(e) => setFilterParam(e.target.value as UserInterest | 'ALL')}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          value={filterParam}
        >
          <option value="ALL">Todas las categorías</option>
          {Object.keys(categoryKeywords).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
          <Card key={`${article.url}-${index}`} className="flex flex-col">
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt={article.title} 
                className="h-48 w-full object-cover rounded-t-lg"
              />
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3">
                {article.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="mt-auto">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full"
              >
                <Button className="w-full">Leer más</Button>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          ← Anterior
        </Button>
        <span className="self-center">Página {page}</span>
        <Button onClick={handleNextPage}>
          Siguiente →
        </Button>
      </div>
    </div>
  );
};

export default TraerNoticiasPersonalizadas;