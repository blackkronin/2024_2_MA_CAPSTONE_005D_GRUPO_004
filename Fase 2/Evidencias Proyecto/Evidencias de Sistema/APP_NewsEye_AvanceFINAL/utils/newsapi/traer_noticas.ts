// utils/newsapi/traer_noticas.ts
export interface Article {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}

export const traerNoticias = async (
    apiKey: string,
    country: string = '',
    page: number = 1
): Promise<NewsApiResponse> => {
    const url = new URL('https://newsapi.org/v2/top-headlines');
    url.searchParams.append('apiKey', apiKey);
    if (country) url.searchParams.append('country', country);
    url.searchParams.append('page', page.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`Error fetching news: ${response.statusText}`);
    }

    const data: NewsApiResponse = await response.json();
    if (data.status !== 'ok') {
        throw new Error(`Error fetching news: ${data.status}`);
    }

    // Filtrar artículos que contienen "[Removed]" en sus campos
    const filteredArticles = data.articles.filter((article: Article) => {
        return !(
            article.title?.includes('[Removed]') ||
            article.description?.includes('[Removed]') ||
            article.url?.includes('[Removed]') ||
            article.urlToImage?.includes('[Removed]')
        );
    });

    return {
        ...data,
        articles: filteredArticles,
    };
};