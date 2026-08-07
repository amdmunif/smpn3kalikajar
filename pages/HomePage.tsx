import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NEWS_ARTICLES, FACILITIES } from '../constants';
import { Calendar, ChevronRight, Building, ExternalLink } from 'lucide-react';
import { NewsArticle, PageContent } from '../types';

const HomePage: React.FC = () => {
  const [content, setContent] = useState<PageContent>({});
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [headmasterPhoto, setHeadmasterPhoto] = useState<string | null>(null);
  const [extServices, setExtServices] = useState<any[]>([]);

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

    // Fetch external services
    fetch('/api/external_services.php')
      .then(res => res.json())
      .then(data => setExtServices(data))
      .catch(err => console.error('Error fetching external services:', err));
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
              <div className="mt-4 text-gray-600 leading-relaxed max-w-none" dangerouslySetInnerHTML={{ __html: welcomeMessage }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: News, Announcements, and Public Services */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Column 75%: Berita & Pengumuman */}
            <div className="lg:col-span-3 space-y-12">
               
               {/* Berita Section */}
               <div>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Berita & Prestasi Terbaru</h2>
                      <p className="mt-2 text-gray-600">Ikuti informasi terkini dari sekolah kami.</p>
                    </div>
                    <Link to="/berita" className="hidden sm:flex text-brand-blue hover:text-brand-lightblue font-medium text-sm items-center">
                      Lihat Semua Berita <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {news.filter(n => n.category === 'Berita' || n.category === 'Prestasi').slice(0, 3).map((article: any) => (
                      <div key={article.id} className="flex flex-col rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow border border-gray-100">
                        {article.image_url && (
                          <div className="flex-shrink-0 h-40">
                            <img className="h-full w-full object-cover" src={article.image_url} alt={article.title} />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider mb-2">{article.category}</p>
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">{article.title}</h3>
                          <div className="mt-auto flex items-center text-xs text-gray-500">
                            <Calendar className="mr-1.5 h-4 w-4" />
                            <p>{new Date(article.date).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {news.filter(n => n.category === 'Berita' || n.category === 'Prestasi').length === 0 && (
                      <p className="text-gray-500 py-4 col-span-full">Belum ada berita.</p>
                    )}
                  </div>
                  <div className="mt-4 sm:hidden text-center">
                    <Link to="/berita" className="inline-flex text-brand-blue hover:text-brand-lightblue font-medium text-sm items-center">
                      Lihat Semua Berita <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
               </div>

               {/* Pengumuman Section */}
               <div className="pt-8 border-t border-gray-200">
                  <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Pengumuman</h2>
                    <Link to="/berita" className="hidden sm:flex text-brand-blue hover:text-brand-lightblue font-medium text-sm items-center">
                      Semua Pengumuman <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {news.filter(n => n.category === 'Pengumuman').slice(0, 3).map((article: any) => (
                      <div key={article.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
                         <div className="flex-shrink-0 bg-yellow-50 text-yellow-600 rounded-lg p-3 flex flex-col items-center justify-center min-w-[80px]">
                            <span className="text-xl font-bold">{new Date(article.date).getDate()}</span>
                            <span className="text-xs uppercase font-medium">{new Date(article.date).toLocaleString('id-ID', { month: 'short' })}</span>
                         </div>
                         <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{article.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                         </div>
                      </div>
                    ))}
                    {news.filter(n => n.category === 'Pengumuman').length === 0 && (
                      <p className="text-gray-500 py-4">Belum ada pengumuman.</p>
                    )}
                  </div>
               </div>

            </div>

            {/* Right Column 25%: Layanan Publik */}
            <div className="lg:col-span-1">
               <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
                  <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6 border-b pb-4 flex items-center">
                     <ExternalLink className="h-5 w-5 text-brand-blue mr-2" />
                     Layanan Publik
                  </h2>
                  <div className="space-y-4">
                     {extServices.map((srv: any) => (
                        <a key={srv.id} href={srv.url} target="_blank" rel="noopener noreferrer" className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors group">
                           <div className="flex items-center mb-2">
                             {srv.icon_url ? (
                               <img src={srv.icon_url} alt={srv.name} className="h-8 w-8 object-contain mr-3" />
                             ) : (
                               <div className="h-8 w-8 bg-white rounded flex items-center justify-center mr-3 shadow-sm text-brand-blue">
                                 <ExternalLink className="h-4 w-4" />
                               </div>
                             )}
                             <h3 className="font-semibold text-gray-800 group-hover:text-brand-blue text-sm leading-tight">{srv.name}</h3>
                           </div>
                           <span className="text-xs text-gray-500 flex items-center">Buka Portal <ChevronRight className="h-3 w-3 ml-1" /></span>
                        </a>
                     ))}
                     {extServices.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">Belum ada layanan eksternal.</p>
                     )}
                  </div>
               </div>
            </div>

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
