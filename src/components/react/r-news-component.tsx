import { useEffect, useState } from "react";
import { getBayernNews, type NewsArticle } from "../../services/newsApi";
import { formatDate } from "../NewsPreview.astro";

const ReactNewsPreview = () => {
   const [data, setData] = useState<NewsArticle[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // esta llamada fue la prueba inicial con newsapi, luego cambiamos definida en newsApi.ts
            // const response = await fetch(`https://newsapi.org/v2/everything?q=Appley`, {
            //    headers: {
            //      "x-api-key": `${apiKey}`
            //    },
            // });

            // const allNews = await response.json().then((res) => res.articles);
            const allNews = await getBayernNews(4);
            setData(allNews);
         } catch (error) {
            setData([]);
            console.log(error);
         } finally {
            setLoading(false);
         }
      };

      fetchData(); // Initial fetch
   }, []);
   return (
      <section className="rounded-lg border bg-white p-4 shadow-sm">
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
               Últimas Noticias
            </h2>
            <a href="/noticias" className="text-xs font-medium text-bayern-red hover:underline">
               Ver todas
            </a>
         </div>
         {loading ? (
            <div className="flex justify-center p-5">
               <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-bayern-red border-t-transparent mr-2" />
            </div>
               ) : data.length > 0 ? (
                  <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                     {data.map((article, index) => (
                        <div key={article.url} className={`news-card ${index > 0 ? 'hidden md:block' : ''} ${index > 1 ? 'lg:block hidden' : ''}`}>
                           <a href={article.url} target="_blank" rel="noopener noreferrer" className="block group">
                              <div className="overflow-hidden rounded-md bg-gray-100">
                                 <img
                                    src={article.image_url || '/placeholder-news.svg'}
                                    alt={article.title}
                                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-news.svg'; }}
                                 />
                              </div>
                              <div className="mt-3">
                                 <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-bayern-red">
                                    {article.title}
                                 </h3>
                                 <p className="mt-1 text-xs text-gray-500 line-clamp-2">{article.description}</p>
                                 <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{formatDate(article.published_at)}</span>
                                    <span className="text-xs text-gray-500">{article.source}</span>
                                 </div>
                              </div>
                           </a>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="rounded-md border border-gray-200 p-4 text-center">
                     <p className="text-sm text-gray-500">No se encontraron noticias recientes</p>
                  </div>
               )}
      </section>
   );
};

export default ReactNewsPreview;