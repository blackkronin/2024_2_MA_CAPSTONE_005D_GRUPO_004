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
    try {
        const response = await fetch(`/api/news?apiKey=${apiKey}&country=${country}&page=${page}`);

        if (!response.ok) {
            throw new Error(`Error fetching news: ${response.statusText}`);
        }

        const data: NewsApiResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};