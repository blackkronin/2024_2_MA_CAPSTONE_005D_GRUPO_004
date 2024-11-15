export interface NewsSource {
  id: string | null;
  name: string;
}

export interface Article {
  source: NewsSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  category?: string;
}

export interface NewsCategory {
  name: string;
  sources: NewsSource[];
  articles: Article[];
} 