import React, { useState, useEffect } from 'react';
import { PageContent } from '../../types';
import { Loader, CheckCircle } from 'lucide-react';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

const ContentManagementPage: React.FC = () => {
  const [content, setContent] = useState<PageContent>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, SaveStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get_content.php');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
    if (saveStatus[key] === 'success' || saveStatus[key] === 'error') {
      setSaveStatus(prev => ({ ...prev, [key]: 'idle' }));
    }
  };

  const handleSave = async (formKeys: string[]) => {
    const key = formKeys.join('_');
    setSaveStatus(prev => ({ ...prev, [key]: 'saving' }));
    
    const payload: Record<string, string> = {};
    formKeys.forEach(k => {
      payload[k] = content[k] || '';
    });

    try {
      const response = await fetch('/api/update_content.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        setSaveStatus(prev => ({ ...prev, [key]: 'success' }));
        setTimeout(() => setSaveStatus(prev => ({ ...prev, [key]: 'idle' })), 2000);
      } else {
        alert('Gagal: ' + result.message);
        setSaveStatus(prev => ({ ...prev, [key]: 'error' }));
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
      setSaveStatus(prev => ({ ...prev, [key]: 'error' }));
    }
  };
  
  const SaveButton: React.FC<{ formKeys: string[] }> = ({ formKeys }) => {
    const key = formKeys.join('_');
    const status = saveStatus[key] || 'idle';
    switch (status) {
        case 'saving':
            return <button disabled className="flex items-center bg-yellow-500 text-white py-2 px-4 rounded-md cursor-not-allowed"><Loader className="h-5 w-5 mr-2 animate-spin" />Menyimpan...</button>;
        case 'success':
            return <button disabled className="flex items-center bg-green-500 text-white py-2 px-4 rounded-md"><CheckCircle className="h-5 w-5 mr-2" />Tersimpan!</button>;
        default:
            return <button onClick={() => handleSave(formKeys)} className="bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-brand-lightblue transition-colors">Simpan Perubahan</button>;
    }
  };

  if (loading) return <div className="flex items-center justify-center p-10"><Loader className="h-8 w-8 animate-spin text-brand-blue" /><p className="ml-3">Memuat konten...</p></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manajemen Konten Website</h1>
      
      <div className="space-y-8">
        
        {/* Visual Settings Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-brand-secondary">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pengaturan Visual & Gambar Utama</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">URL Logo Sekolah (di Navbar)</label>
              <input type="text" placeholder="https://..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" 
                value={content.logo_url || ''} onChange={(e) => handleContentChange('logo_url', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL Gambar Hero (Banner Depan)</label>
              <input type="text" placeholder="https://..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" 
                value={content.hero_image_url || ''} onChange={(e) => handleContentChange('hero_image_url', e.target.value)} />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">URL Gambar Sambutan Kepala Sekolah</label>
              <input type="text" placeholder="https://..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" 
                value={content.welcome_image_url || ''} onChange={(e) => handleContentChange('welcome_image_url', e.target.value)} />
            </div>
            <SaveButton formKeys={['logo_url', 'hero_image_url', 'welcome_image_url']} />
          </div>
        </div>

        {/* Public Services Integration Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Integrasi Layanan Publik Eksternal</h2>
          <p className="text-sm text-gray-500 mb-4">Tautan ini akan muncul sebagai kartu (card) di halaman depan (Beranda).</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border p-4 rounded-md">
              <h3 className="font-semibold mb-3">Layanan Eksternal 1 (Misal: SP4N Lapor)</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Nama Layanan" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue sm:text-sm" 
                  value={content.pub_srv_1_name || ''} onChange={(e) => handleContentChange('pub_srv_1_name', e.target.value)} />
                <input type="text" placeholder="URL Target" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue sm:text-sm" 
                  value={content.pub_srv_1_url || ''} onChange={(e) => handleContentChange('pub_srv_1_url', e.target.value)} />
                <input type="text" placeholder="URL Logo/Icon" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue sm:text-sm" 
                  value={content.pub_srv_1_logo || ''} onChange={(e) => handleContentChange('pub_srv_1_logo', e.target.value)} />
              </div>
            </div>
            <div className="border p-4 rounded-md">
              <h3 className="font-semibold mb-3">Layanan Eksternal 2 (Misal: Lapor Bupati)</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Nama Layanan" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue sm:text-sm" 
                  value={content.pub_srv_2_name || ''} onChange={(e) => handleContentChange('pub_srv_2_name', e.target.value)} />
                <input type="text" placeholder="URL Target" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue sm:text-sm" 
                  value={content.pub_srv_2_url || ''} onChange={(e) => handleContentChange('pub_srv_2_url', e.target.value)} />
                <input type="text" placeholder="URL Logo/Icon" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue sm:text-sm" 
                  value={content.pub_srv_2_logo || ''} onChange={(e) => handleContentChange('pub_srv_2_logo', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-4">
             <SaveButton formKeys={['pub_srv_1_name', 'pub_srv_1_url', 'pub_srv_1_logo', 'pub_srv_2_name', 'pub_srv_2_url', 'pub_srv_2_logo']} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Visi & Misi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Visi</label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                value={content.vision || ''}
                onChange={(e) => handleContentChange('vision', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Misi (pisahkan tiap poin dengan baris baru)</label>
              <textarea
                rows={8}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                value={content.mission || ''}
                onChange={(e) => handleContentChange('mission', e.target.value)}
              />
            </div>
            <SaveButton formKeys={['vision', 'mission']} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Profil & Sejarah Sekolah</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Isi Teks</label>
              <textarea
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                value={content.history || ''}
                onChange={(e) => handleContentChange('history', e.target.value)}
              />
            </div>
            <SaveButton formKeys={['history']} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sambutan Kepala Sekolah</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Kepala Sekolah</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" 
                value={content.headmaster_name || ''}
                onChange={(e) => handleContentChange('headmaster_name', e.target.value)}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Pesan Sambutan</label>
              <textarea
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                value={content.welcome_message || ''}
                onChange={(e) => handleContentChange('welcome_message', e.target.value)}
              />
            </div>
            <SaveButton formKeys={['headmaster_name', 'welcome_message']} />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ContentManagementPage;