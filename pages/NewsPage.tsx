import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
}

const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-brand-blue text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-gray-300">{subtitle}</p>
    </div>
  </div>
);

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news.php')
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white">
      <PageHeader title="Berita & Pengumuman" subtitle="Ikuti terus informasi dan kegiatan terbaru dari sekolah kami" />
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Memuat berita...</div>
        ) : news.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Belum ada berita yang dipublikasikan.</div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {news.map((article: NewsArticle) => (
              <div key={article.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                {article.image_url && (
                  <div className="flex-shrink-0">
                    <img className="h-56 w-full object-cover" src={article.image_url} alt={article.title} />
                  </div>
                )}
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-lightblue">
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${article.category === 'Pengumuman' ? 'bg-yellow-100 text-yellow-800' : article.category === 'Prestasi' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {article.category}
                      </span>
                    </p>
                    <a href="#" className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900 hover:text-brand-blue transition-colors line-clamp-2">{article.title}</p>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">{article.excerpt}</p>
                    </a>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>{new Date(article.date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
