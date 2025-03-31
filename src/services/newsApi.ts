import axios from 'axios';

// Instancias de axios para cada API
const thenewsapi = axios.create({
  baseURL: 'https://api.thenewsapi.com/v1/news',
});

const gnewsapi = axios.create({
  baseURL: 'https://gnews.io/api/v4',
});

const currentsapi = axios.create({
  baseURL: 'https://api.currentsapi.services/v1',
});

const newsdataapi = axios.create({
  baseURL: 'https://newsdata.io/api/1',
});

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image_url: string;
  published_at: string;
  source: string;
  snippet?: string;
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

// Función para obtener noticias de TheNewsAPI
async function getTheNewsAPIArticles(limit: number = 3): Promise<NewsArticle[]> {
  try {
    const response = await thenewsapi.get('/all', {
      params: {
        api_token: import.meta.env.PUBLIC_THENEWSAPI_KEY || '',
        search: 'Bayern Munich football',
        language: 'es,en',
        limit: limit,
        published_after: getLastMonthDate()
      }
    });
    
    // Si no hay respuesta o token inválido
    if (!response.data || !response.data.data) {
      return [];
    }
    
    return response.data.data as NewsArticle[];
  } catch (error) {
    console.error('Error al obtener noticias de TheNewsAPI:', error);
    return [];
  }
}

// Función para obtener noticias de NewsAPI
async function getNewsAPIArticles(limit: number = 3): Promise<NewsArticle[]> {
  const apiKey = import.meta.env.PUBLIC_NEWSAPI_KEY || '';
  
  // Si no hay API key, retornar array vacío
  if (!apiKey) {
    return [];
  }
  
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=FC+Bayern+Munich&language=es&sortBy=publishedAt&pageSize=${limit}&apiKey=${apiKey}`
    );
    
    if (!response.ok) {
      console.error('Error en NewsAPI:', await response.text());
      return [];
    }
    
    const data = await response.json();
    
    return data.articles.map((article: any) => ({
      title: article.title,
      description: article.description || article.content,
      url: article.url,
      image_url: article.urlToImage,
      published_at: article.publishedAt,
      source: article.source.name,
      snippet: article.content
    }));
  } catch (error) {
    console.error('Error al obtener noticias de NewsAPI:', error);
    return [];
  }
}

// Función para obtener noticias de GNews
async function getGNewsArticles(limit: number = 3): Promise<NewsArticle[]> {
  const apiKey = import.meta.env.PUBLIC_GNEWS_KEY || '';
  
  if (!apiKey) {
    return [];
  }
  
  try {
    const response = await gnewsapi.get('/search', {
      params: {
        q: 'FC Bayern Munich',
        lang: 'es,en',
        max: limit,
        apikey: apiKey
      }
    });
    
    if (!response.data || !response.data.articles) {
      return [];
    }
    
    return response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image_url: article.image || '',
      published_at: article.publishedAt,
      source: article.source.name,
      snippet: article.content
    }));
  } catch (error) {
    console.error('Error al obtener noticias de GNews:', error);
    return [];
  }
}

// Función para obtener noticias de CurrentsAPI
async function getCurrentsAPIArticles(limit: number = 3): Promise<NewsArticle[]> {
  const apiKey = import.meta.env.PUBLIC_CURRENTSAPI_KEY || '';
  
  if (!apiKey) {
    return [];
  }
  
  try {
    const response = await currentsapi.get('/search', {
      params: {
        keywords: 'FC Bayern Munich',
        language: 'es,en',
        limit: limit,
        apiKey: apiKey
      }
    });
    
    if (!response.data || !response.data.news) {
      return [];
    }
    
    return response.data.news.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image_url: article.image || '',
      published_at: article.published,
      source: article.source,
      snippet: article.description
    }));
  } catch (error) {
    console.error('Error al obtener noticias de CurrentsAPI:', error);
    return [];
  }
}

// Función para obtener noticias de NewsData.io
async function getNewsDataArticles(limit: number = 3): Promise<NewsArticle[]> {
  const apiKey = import.meta.env.PUBLIC_NEWSDATA_KEY || '';
  
  if (!apiKey) {
    return [];
  }
  
  try {
    const response = await newsdataapi.get('/news', {
      params: {
        q: 'FC Bayern Munich',
        language: 'es,en',
        size: limit,
        apikey: apiKey
      }
    });
    
    if (!response.data || !response.data.results) {
      return [];
    }
    
    return response.data.results.map((article: any) => ({
      title: article.title,
      description: article.description || article.content,
      url: article.link,
      image_url: article.image_url || '',
      published_at: article.pubDate,
      source: article.source_id,
      snippet: article.content
    }));
  } catch (error) {
    console.error('Error al obtener noticias de NewsData.io:', error);
    return [];
  }
}

// Función principal que combina resultados de todas las APIs
export async function getBayernNews(limit: number = 4): Promise<NewsArticle[]> {
  // Dividir el límite entre las APIs
  const limitPerApi = Math.ceil(limit / 5); // Dividimos entre 5 (las 5 APIs)
  
  // Obtener noticias de todas las APIs en paralelo
  const [theNewsApiArticles, newsApiArticles, gNewsArticles, currentsApiArticles, newsDataArticles] = 
    await Promise.all([
      getTheNewsAPIArticles(limitPerApi),
      getNewsAPIArticles(limitPerApi),
      getGNewsArticles(limitPerApi),
      getCurrentsAPIArticles(limitPerApi),
      getNewsDataArticles(limitPerApi)
    ]);
  
  // Combinar resultados de todas las APIs
  const combinedArticles = [
    ...theNewsApiArticles, 
    ...newsApiArticles,
    ...gNewsArticles,
    ...currentsApiArticles,
    ...newsDataArticles
  ];
  
  // Eliminar posibles duplicados (basados en URL)
  const uniqueArticles = Array.from(
    new Map(combinedArticles.map(article => [article.url, article]))
  ).map(([_, article]) => article);
  
  // Ordenar por fecha (más recientes primero)
  uniqueArticles.sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
  
  // Limitar al número solicitado
  return uniqueArticles.slice(0, limit);
}

// Función para obtener noticias por categoría
export async function getNewsByCategory(category: string, limit: number = 3): Promise<NewsArticle[]> {
  // Dividir el límite entre las APIs
  const limitPerApi = Math.ceil(limit / 5);
  
  // Funciones para obtener noticias por categoría de cada API
  async function getTheNewsAPICategoryArticles(): Promise<NewsArticle[]> {
    try {
      const response = await thenewsapi.get('/all', {
        params: {
          api_token: import.meta.env.PUBLIC_THENEWSAPI_KEY || '',
          search: `Bayern Munich ${category}`,
          language: 'es,en',
          limit: limitPerApi,
          published_after: getLastMonthDate()
        }
      });
      
      if (!response.data || !response.data.data) {
        return [];
      }
      
      return response.data.data as NewsArticle[];
    } catch (error) {
      console.error(`Error al obtener noticias de categoría ${category} de TheNewsAPI:`, error);
      return [];
    }
  }
  
  async function getNewsAPICategoryArticles(): Promise<NewsArticle[]> {
    const apiKey = import.meta.env.PUBLIC_NEWSAPI_KEY || '';
    
    if (!apiKey) {
      return [];
    }
    
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=FC+Bayern+Munich+${category}&language=es&sortBy=publishedAt&pageSize=${limitPerApi}&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        console.error('Error en NewsAPI para categoría:', await response.text());
        return [];
      }
      
      const data = await response.json();
      
      return data.articles.map((article: any) => ({
        title: article.title,
        description: article.description || article.content,
        url: article.url,
        image_url: article.urlToImage,
        published_at: article.publishedAt,
        source: article.source.name,
        snippet: article.content
      }));
    } catch (error) {
      console.error(`Error al obtener noticias de categoría ${category} de NewsAPI:`, error);
      return [];
    }
  }
  
  async function getGNewsCategoryArticles(): Promise<NewsArticle[]> {
    const apiKey = import.meta.env.PUBLIC_GNEWS_KEY || '';
    
    if (!apiKey) {
      return [];
    }
    
    try {
      const response = await gnewsapi.get('/search', {
        params: {
          q: `FC Bayern Munich ${category}`,
          lang: 'es,en',
          max: limitPerApi,
          apikey: apiKey
        }
      });
      
      if (!response.data || !response.data.articles) {
        return [];
      }
      
      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image_url: article.image || '',
        published_at: article.publishedAt,
        source: article.source.name,
        snippet: article.content
      }));
    } catch (error) {
      console.error(`Error al obtener noticias de categoría ${category} de GNews:`, error);
      return [];
    }
  }
  
  async function getCurrentsAPICategoryArticles(): Promise<NewsArticle[]> {
    const apiKey = import.meta.env.PUBLIC_CURRENTSAPI_KEY || '';
    
    if (!apiKey) {
      return [];
    }
    
    try {
      const response = await currentsapi.get('/search', {
        params: {
          keywords: `FC Bayern Munich ${category}`,
          language: 'es,en',
          limit: limitPerApi,
          apiKey: apiKey
        }
      });
      
      if (!response.data || !response.data.news) {
        return [];
      }
      
      return response.data.news.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image_url: article.image || '',
        published_at: article.published,
        source: article.source,
        snippet: article.description
      }));
    } catch (error) {
      console.error(`Error al obtener noticias de categoría ${category} de CurrentsAPI:`, error);
      return [];
    }
  }
  
  async function getNewsDataCategoryArticles(): Promise<NewsArticle[]> {
    const apiKey = import.meta.env.PUBLIC_NEWSDATA_KEY || '';
    
    if (!apiKey) {
      return [];
    }
    
    try {
      const response = await newsdataapi.get('/news', {
        params: {
          q: `FC Bayern Munich ${category}`,
          language: 'es,en',
          size: limitPerApi,
          apikey: apiKey
        }
      });
      
      if (!response.data || !response.data.results) {
        return [];
      }
      
      return response.data.results.map((article: any) => ({
        title: article.title,
        description: article.description || article.content,
        url: article.link,
        image_url: article.image_url || '',
        published_at: article.pubDate,
        source: article.source_id,
        snippet: article.content
      }));
    } catch (error) {
      console.error(`Error al obtener noticias de categoría ${category} de NewsData.io:`, error);
      return [];
    }
  }
  
  // Obtener noticias de todas las APIs en paralelo
  const [theNewsApiArticles, newsApiArticles, gNewsArticles, currentsApiArticles, newsDataArticles] = 
    await Promise.all([
      getTheNewsAPICategoryArticles(),
      getNewsAPICategoryArticles(),
      getGNewsCategoryArticles(),
      getCurrentsAPICategoryArticles(),
      getNewsDataCategoryArticles()
    ]);
  
  // Combinar resultados de todas las APIs
  const combinedArticles = [
    ...theNewsApiArticles, 
    ...newsApiArticles,
    ...gNewsArticles,
    ...currentsApiArticles,
    ...newsDataArticles
  ];
  
  // Eliminar posibles duplicados (basados en URL)
  const uniqueArticles = Array.from(
    new Map(combinedArticles.map(article => [article.url, article]))
  ).map(([_, article]) => article);
  
  // Ordenar por fecha (más recientes primero)
  uniqueArticles.sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
  
  // Limitar al número solicitado
  return uniqueArticles.slice(0, limit);
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