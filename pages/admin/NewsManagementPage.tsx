import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
}

const NewsManagementPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState<Omit<NewsArticle, 'id'>>({
    title: '', date: '', excerpt: '', content: '', image_url: '', category: 'Berita'
  });

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

  const handleOpenModal = (article: NewsArticle | null = null) => {
    setSelectedNews(article);
    if (article) {
      setFormData({
        title: article.title,
        date: article.date,
        excerpt: article.excerpt,
        content: article.content,
        image_url: article.image_url || '',
        category: article.category
      });
    } else {
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        content: '',
        image_url: '',
        category: 'Berita'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/news.php';
      const bodyData = selectedNews ? { ...formData, id: selectedNews.id } : formData;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const result = await response.json();
      if (result.success) {
        fetchNews();
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
    handleCloseModal();
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

  const columns: Column<NewsArticle>[] = [
    {
      header: 'Gambar',
      accessor: (item) => item.image_url ? (
        <img src={item.image_url} alt={item.title} className="h-12 w-16 object-cover rounded shadow-sm border border-gray-100" />
      ) : (
        <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 shadow-sm">
          <ImageIcon className="h-6 w-6 opacity-50" />
        </div>
      ),
      className: 'w-24'
    },
    { 
      header: 'Judul', 
      accessor: (item) => (
        <div className="font-medium text-gray-900 max-w-xs truncate" title={item.title}>
          {item.title}
        </div>
      )
    },
    {
      header: 'Kategori',
      accessor: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.category === 'Pengumuman' ? 'bg-amber-100 text-amber-800' : item.category === 'Prestasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
          {item.category}
        </span>
      )
    },
    { 
      header: 'Tanggal', 
      accessor: (item) => new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) 
    },
    {
      header: 'Aksi',
      accessor: (item) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleOpenModal(item)} 
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
          <p className="text-gray-500 mt-1">Kelola artikel berita, pengumuman, dan prestasi</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center px-5 py-2.5 bg-brand-blue text-white rounded-lg shadow-sm hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tulis Berita
        </button>
      </div>

      <DataTable
        columns={columns}
        data={news}
        searchPlaceholder="Cari judul, konten, atau kategori..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedNews ? 'Edit Berita' : 'Tulis Berita Baru'}
        maxWidth="max-w-3xl"
      >
        <form id="news-form" onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Berita</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
              >
                <option value="Berita">Berita</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Prestasi">Prestasi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL Gambar Utama</label>
              <input 
                type="url" 
                name="image_url" 
                value={formData.image_url} 
                onChange={handleChange} 
                placeholder="https://contoh.com/gambar.jpg" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kutipan Singkat (Excerpt)</label>
              <textarea 
                name="excerpt" 
                value={formData.excerpt} 
                onChange={handleChange} 
                rows={2} 
                required 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
                placeholder="Ringkasan berita (tampil di halaman depan)..." 
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Berita Lengkap</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue/50 focus-within:border-brand-blue transition-all">
                <Editor
                  apiKey="a6av81tpfj54ylxetjioaunho1ja53ana1c28l9jndbsbql3"
                  value={formData.content}
                  onEditorChange={(newContent) => {
                    setFormData(prev => ({ ...prev, content: newContent }));
                  }}
                  init={{
                    height: 400,
                    menubar: true,
                    plugins: [
                      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    content_style: 'body { font-family:Inter,sans-serif; font-size:14px }'
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-5 border-t border-gray-100 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={handleCloseModal} 
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-lightblue shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-colors"
            >
              Simpan Berita
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NewsManagementPage;
