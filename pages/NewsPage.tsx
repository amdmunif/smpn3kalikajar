import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Search, Tag, ArrowRight } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', 'Berita', 'Pengumuman', 'Prestasi'];

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

  const filteredNews = news.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredNews.length > 0 ? filteredNews[0] : null;
  const standardArticles = filteredNews.slice(1);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-brand-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Portal Berita & Informasi</h1>
            <p className="mt-4 text-lg text-gray-200">Ikuti terus berita, pengumuman, dan prestasi terbaru dari sekolah kami.</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center w-full h-14 rounded-full shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-gray-400">
                <Search className="h-6 w-6" />
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                type="text"
                id="search"
                placeholder="Cari judul atau isi berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-brand-blue text-white shadow-md ring-2 ring-brand-blue/50 ring-offset-2' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-brand-blue'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20 flex flex-col items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
             Memuat berita...
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Berita tidak ditemukan</h3>
            <p className="text-gray-500 mt-2">Coba gunakan kata kunci lain atau ubah kategori filter.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Article */}
            {featuredArticle && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col lg:flex-row group hover:shadow-lg transition-shadow">
                {featuredArticle.image_url ? (
                  <div className="lg:w-7/12 relative overflow-hidden h-72 lg:h-auto">
                    <img 
                      src={featuredArticle.image_url} 
                      alt={featuredArticle.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="lg:w-7/12 bg-gray-200 h-72 lg:h-auto flex items-center justify-center">
                    <span className="text-gray-400">Tidak ada gambar</span>
                  </div>
                )}
                <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${featuredArticle.category === 'Pengumuman' ? 'bg-yellow-100 text-yellow-800' : featuredArticle.category === 'Prestasi' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-brand-blue'}`}>
                      {featuredArticle.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center font-medium">
                      <Calendar className="mr-1.5 h-4 w-4" />
                      {new Date(featuredArticle.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <Link to={`/berita/${featuredArticle.id}`} className="block mt-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 group-hover:text-brand-blue transition-colors leading-tight mb-4">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-lg text-gray-600 line-clamp-3 mb-6">
                      {featuredArticle.excerpt}
                    </p>
                  </Link>
                  <div className="mt-auto">
                    <Link to={`/berita/${featuredArticle.id}`} className="inline-flex items-center font-semibold text-brand-blue hover:text-brand-lightblue group/link">
                      Baca Selengkapnya
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Articles Grid */}
            {standardArticles.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Berita Lainnya</h3>
                <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                  {standardArticles.map((article: NewsArticle) => (
                    <div key={article.id} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                      {article.image_url && (
                        <div className="flex-shrink-0 relative overflow-hidden h-48">
                          <img className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" src={article.image_url} alt={article.title} />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${article.category === 'Pengumuman' ? 'bg-yellow-100 text-yellow-800' : article.category === 'Prestasi' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {article.category}
                          </span>
                        </div>
                        <Link to={`/berita/${article.id}`} className="block flex-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">{article.excerpt}</p>
                        </Link>
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500 font-medium">
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            {new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                          <Link to={`/berita/${article.id}`} className="text-brand-blue hover:text-brand-lightblue font-medium text-sm flex items-center">
                            Baca <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
