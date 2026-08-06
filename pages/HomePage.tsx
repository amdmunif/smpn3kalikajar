import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NEWS_ARTICLES, FACILITIES } from '../constants';
import { Calendar, ChevronRight, Building, ExternalLink } from 'lucide-react';
import { NewsArticle, PageContent } from '../types';

const HomePage: React.FC = () => {
  const [content, setContent] = useState<PageContent>({});
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [headmasterPhoto, setHeadmasterPhoto] = useState<string | null>(null);

  useEffect(() => {
    // Fetch content
    fetch('/api/get_content.php')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        // After content is loaded, try to fetch teachers to find headmaster's photo
        if (data.headmaster_name) {
          fetch('/api/teachers.php')
            .then(res => res.json())
            .then(teachers => {
              const headmaster = teachers.find((t: any) => t.name.toLowerCase() === data.headmaster_name.toLowerCase());
              if (headmaster && headmaster.photo_url) {
                setHeadmasterPhoto(headmaster.photo_url);
              }
            })
            .catch(err => console.error('Error fetching teachers for headmaster photo:', err));
        }
      })
      .catch(err => console.error('Error fetching content:', err));

    // Fetch news
    fetch('/api/news.php')
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error('Error fetching news:', err));
  }, []);

  const heroImageUrl = content.hero_image_url || "https://picsum.photos/seed/hero/1600/900";
  // Use headmasterPhoto from teacher table, fallback to content's welcome_image_url
  const welcomeImageUrl = headmasterPhoto || content.welcome_image_url || "https://picsum.photos/id/1005/300/300";
  const headmasterName = content.headmaster_name || "Kepala Sekolah";
  const welcomeMessage = content.welcome_message || "Selamat datang di sekolah kami.";

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-brand-blue text-white">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover" src={heroImageUrl} alt="Suasana Sekolah" />
          <div className="absolute inset-0 bg-brand-blue opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Selamat Datang di <span className="text-brand-secondary">SMP Negeri 3 Kalikajar</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
            Membentuk Generasi Unggul, Berkarakter, dan Berwawasan Global.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/profil" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-brand-blue bg-white hover:bg-gray-100">
              Tentang Kami
            </Link>
            <Link to="/kontak" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-secondary hover:bg-amber-400">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>

      {/* Public Services External Cards */}
      {(content.pub_srv_1_name || content.pub_srv_2_name) && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Layanan Publik & Pengaduan</h2>
              <p className="mt-2 text-gray-600">Portal layanan terpadu yang terhubung dengan pemerintah.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {content.pub_srv_1_name && content.pub_srv_1_url && (
                <a href={content.pub_srv_1_url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 w-full max-w-sm group">
                  {content.pub_srv_1_logo ? (
                    <img src={content.pub_srv_1_logo} alt={content.pub_srv_1_name} className="h-12 w-12 object-contain mr-4" />
                  ) : (
                    <ExternalLink className="h-10 w-10 text-brand-blue mr-4" />
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors">{content.pub_srv_1_name}</h3>
                    <p className="text-sm text-gray-500">Klik untuk menuju portal</p>
                  </div>
                </a>
              )}
              {content.pub_srv_2_name && content.pub_srv_2_url && (
                <a href={content.pub_srv_2_url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 w-full max-w-sm group">
                  {content.pub_srv_2_logo ? (
                    <img src={content.pub_srv_2_logo} alt={content.pub_srv_2_name} className="h-12 w-12 object-contain mr-4" />
                  ) : (
                    <ExternalLink className="h-10 w-10 text-brand-blue mr-4" />
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors">{content.pub_srv_2_name}</h3>
                    <p className="text-sm text-gray-500">Klik untuk menuju portal</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Welcome Message */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <img src={welcomeImageUrl} alt={headmasterName} className="rounded-full shadow-lg mx-auto w-48 h-48 md:w-64 md:h-64 object-cover" />
            </div>
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900">Sambutan Kepala Sekolah</h2>
              <p className="text-lg font-medium text-brand-blue mt-1">{headmasterName}</p>
              <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
                {welcomeMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* News Preview */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Berita & Pengumuman Terbaru</h2>
            <p className="mt-4 text-lg text-gray-600">Ikuti informasi terkini dari sekolah kami.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {news.length > 0 ? news.slice(0, 3).map((article: any) => (
              <div key={article.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                {article.image_url && (
                  <div className="flex-shrink-0">
                    <img className="h-48 w-full object-cover" src={article.image_url} alt={article.title} />
                  </div>
                )}
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-lightblue">
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${article.category === 'Pengumuman' ? 'bg-yellow-100 text-yellow-800' : article.category === 'Prestasi' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{article.category}</span>
                    </p>
                    <p className="text-xl font-semibold text-gray-900 mt-2 line-clamp-2">{article.title}</p>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">{article.excerpt}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>{new Date(article.date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
               <div className="col-span-3 text-center text-gray-500 py-8">Belum ada berita.</div>
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/berita" className="inline-flex items-center text-brand-blue hover:text-brand-lightblue font-semibold">
                Lihat Semua Berita
                <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Facilities Preview */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Fasilitas Unggulan</h2>
            <p className="mt-4 text-lg text-gray-600">Menunjang proses belajar mengajar yang kondusif dan modern.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
              {FACILITIES.slice(0,4).map(facility => (
                  <div key={facility.id} className="flex flex-col items-center space-y-3">
                      <div className="p-4 bg-blue-100 rounded-full">
                           <Building className="h-8 w-8 text-brand-blue"/>
                      </div>
                      <p className="font-semibold text-gray-800">{facility.name}</p>
                  </div>
              ))}
          </div>
           <div className="mt-10 text-center">
              <Link to="/profil" className="inline-flex items-center text-brand-blue hover:text-brand-lightblue font-semibold">
                  Lihat Semua Fasilitas
                  <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
