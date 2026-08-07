import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronLeft, Loader } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  content: string;
  image_url: string;
  category: string;
}

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We can fetch all news and find the one, or create a specific endpoint
    // Since /api/news.php returns all, we will find by id
    fetch('/api/news.php')
      .then(res => res.json())
      .then(data => {
        const found = data.find((n: any) => n.id.toString() === id);
        setArticle(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news detail:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <Loader className="h-10 w-10 text-brand-blue animate-spin mb-4" />
        <p className="text-gray-500">Memuat artikel...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-gray-50 min-h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Artikel Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Berita yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
        <Link to="/berita" className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-lightblue transition-colors">
          Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/berita" className="inline-flex items-center text-brand-blue hover:text-brand-lightblue font-medium mb-8 group">
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Berita
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {article.image_url && (
            <div className="w-full h-[400px] sm:h-[500px] relative">
              <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-8 sm:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${article.category === 'Pengumuman' ? 'bg-yellow-100 text-yellow-800' : article.category === 'Prestasi' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {article.category}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(article.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-8">
              {article.title}
            </h1>

            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetailPage;
