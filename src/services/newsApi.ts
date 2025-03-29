import axios from 'axios';

const newsApi = axios.create({
  baseURL: 'https://api.thenewsapi.com/v1/news',
});

export interface NewsArticle {
  uuid: string;
  title: string;
  description: string;
  snippet: string;
  url: string;
  image_url: string;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
  locale: string;
}

export interface NewsResponse {
  data: NewsArticle[];
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
}

export async function getBayernNews(limit: number = 3) {
  try {
    const response = await newsApi.get('/all', {
      params: {
        api_token: import.meta.env.PUBLIC_NEWS_API_KEY || 'EvXOXT2rHkAJ1CR4kOkwj3FJnqMq8gTO4Iy2RUqF',
        search: 'Bayern Munich football',
        language: 'es,en',
        limit: limit,
        published_after: getLastMonthDate()
      }
    });
    return response.data.data as NewsArticle[];
  } catch (error) {
    console.error('Error al obtener noticias del Bayern:', error);
    return [];
  }
}

export async function getNewsByCategory(category: string, limit: number = 6) {
  try {
    const response = await newsApi.get('/all', {
      params: {
        api_token: import.meta.env.PUBLIC_NEWS_API_KEY || 'EvXOXT2rHkAJ1CR4kOkwj3FJnqMq8gTO4Iy2RUqF',
        search: `Bayern Munich ${category}`,
        language: 'es,en',
        limit: limit,
        published_after: getLastMonthDate()
      }
    });
    return response.data.data as NewsArticle[];
  } catch (error) {
    console.error(`Error al obtener noticias de ${category}:`, error);
    return [];
  }
}

// Función para obtener la fecha de hace un mes en formato ISO
function getLastMonthDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

export default {
  getBayernNews,
  getNewsByCategory
}; 