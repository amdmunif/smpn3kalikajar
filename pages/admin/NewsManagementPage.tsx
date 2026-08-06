import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable, { Column } from '../../components/ui/DataTable';
import { NewsArticle } from '../../types';

const NewsManagementPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news.php');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      try {
        const response = await fetch(`/api/news.php?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          fetchNews();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Berita': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pengumuman': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Prestasi': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const columns: Column<NewsArticle>[] = [
    { 
      header: 'Judul', 
      accessor: (item) => <span className="font-medium text-gray-900 line-clamp-2" title={item.title}>{item.title}</span>,
      className: 'w-1/3'
    },
    { 
      header: 'Kategori', 
      accessor: (item) => (
        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getCategoryColor(item.category)}`}>
          {item.category}
        </span>
      ),
      className: 'w-32'
    },
    { 
      header: 'Tanggal', 
      accessor: (item) => new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      className: 'w-40'
    },
    {
      header: 'Aksi',
      accessor: (item) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate(`/admin/berita/${item.id}`)} 
            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(item.id)} 
            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
            title="Hapus"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: 'w-24 text-center'
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Berita & Pengumuman</h1>
          <p className="text-gray-500 mt-1">Kelola artikel informasi untuk ditampilkan ke publik</p>
        </div>
        <button 
          onClick={() => navigate('/admin/berita/tambah')} 
          className="flex items-center px-5 py-2.5 bg-brand-blue text-white rounded-lg shadow-sm hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tulis Berita Baru
        </button>
      </div>

      <DataTable
        columns={columns}
        data={news}
        searchPlaceholder="Cari judul berita..."
      />
    </div>
  );
};

export default NewsManagementPage;
