import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { ArrowLeft, Save, Loader, Upload, X } from 'lucide-react';
import { NewsArticle } from '../../types';

const NewsFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<NewsArticle, 'id'>>({ title: '', date: new Date().toISOString().split('T')[0], excerpt: '', content: '', imageUrl: '', category: 'Berita' });
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id && id !== 'tambah') {
      fetchNewsDetail(id);
    }
  }, [id]);

  const fetchNewsDetail = async (newsId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/news.php');
      const data = await response.json();
      const article = data.find((item: any) => item.id.toString() === newsId);
      if (article) {
        setFormData({
          title: article.title,
          date: article.date,
          excerpt: article.excerpt,
          content: article.content,
          imageUrl: article.image_url || '',
          category: article.category
        });
      } else {
        alert('Berita tidak ditemukan.');
        navigate('/admin/berita');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const response = await fetch('/api/upload.php', { method: 'POST', body: form });
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        alert('Upload gagal: ' + data.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Terjadi kesalahan saat upload gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
        id: id && id !== 'tambah' ? parseInt(id) : undefined,
        title: formData.title,
        date: formData.date,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: formData.imageUrl,
        category: formData.category
    };

    try {
      const response = await fetch('/api/news.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        navigate('/admin/berita');
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-sm";
  const labelClassName = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin/berita')} className="mr-4 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{id === 'tambah' ? 'Tulis Berita Baru' : 'Edit Berita'}</h1>
            <p className="text-gray-500 mt-1">Publikasikan informasi terbaru untuk warga sekolah.</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={loading} className="flex items-center px-6 py-2.5 bg-brand-blue text-white rounded-lg font-medium shadow-sm hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all disabled:opacity-50">
          {loading ? <Loader className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
          Simpan Publikasi
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <label className={labelClassName}>Judul Artikel</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className={`${inputClassName} text-lg font-medium`} placeholder="Masukkan judul yang menarik..." />
              </div>
              <div>
                <label className={labelClassName}>Ringkasan (Excerpt)</label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} required className={inputClassName} placeholder="Tuliskan 1-2 kalimat ringkasan yang akan tampil di halaman depan..." />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelClassName}>Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClassName}>
                  <option value="Berita">📰 Berita</option>
                  <option value="Pengumuman">📢 Pengumuman</option>
                  <option value="Prestasi">🏆 Prestasi</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>Tanggal Publikasi</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className={inputClassName} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClassName}>Gambar Sampul (Thumbnail)</label>
            <div className="mt-2 flex items-start space-x-6">
               {formData.imageUrl ? (
                  <div className="relative w-64 aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                    <img src={formData.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData(p => ({...p, imageUrl: ''}))} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="w-64 aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 text-gray-400 cursor-pointer hover:bg-blue-50 hover:border-brand-blue hover:text-brand-blue transition-colors flex-shrink-0">
                    {isUploading ? <Loader className="h-8 w-8 animate-spin mb-2" /> : <Upload className="h-8 w-8 mb-2" />}
                    <span className="text-sm font-medium">{isUploading ? 'Mengunggah...' : 'Pilih Gambar'}</span>
                  </div>
                )}
                <div>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  <p className="text-sm text-gray-600 mb-2">Gambar ini akan muncul sebagai sampul artikel di daftar berita dan halaman utama.</p>
                  <p className="text-xs text-gray-500">Rekomendasi ukuran: 800x600 px (Lanskap). Format: JPG/PNG.</p>
                </div>
            </div>
          </div>

          <div>
            <label className={labelClassName}>Isi Berita Lengkap</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue/50 focus-within:border-brand-blue transition-all">
              <Editor
                apiKey="a6av81tpfj54ylxetjioaunho1ja53ana1c28l9jndbsbql3"
                value={formData.content}
                onEditorChange={(newContent) => setFormData(p => ({...p, content: newContent}))}
                init={{
                  height: 600,
                  menubar: true,
                  plugins: ['anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'],
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                  content_style: 'body { font-family:Inter,sans-serif; font-size:15px; line-height:1.6; color:#374151 }'
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewsFormPage;
