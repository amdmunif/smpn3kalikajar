
import React from 'react';
import { NEWS_ARTICLES } from '../constants';
import { NewsArticle } from '../types';
import { Calendar } from 'lucide-react';

const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-brand-blue text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-gray-300">{subtitle}</p>
    </div>
  </div>
);

const NewsPage: React.FC = () => {
  return (
    <div className="bg-white">
      <PageHeader title="Berita & Pengumuman" subtitle="Ikuti terus informasi dan kegiatan terbaru dari sekolah kami" />
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {NEWS_ARTICLES.map((article: NewsArticle) => (
            <div key={article.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex-shrink-0">
                <img className="h-56 w-full object-cover" src={article.imageUrl} alt={article.title} />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-lightblue">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">{article.category}</span>
                  </p>
                  <a href="#" className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900 hover:text-brand-blue transition-colors">{article.title}</p>
                    <p className="mt-3 text-base text-gray-500">{article.excerpt}</p>
                  </a>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>{article.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
