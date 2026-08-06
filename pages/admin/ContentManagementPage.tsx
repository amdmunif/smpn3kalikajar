import React, { useState, useEffect } from 'react';
import { PageContent } from '../../types';
import { Loader, CheckCircle, Save, Monitor, Link as LinkIcon, Target, History, User } from 'lucide-react';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';
type TabId = 'visual' | 'services' | 'vision' | 'history' | 'headmaster';

const ContentManagementPage: React.FC = () => {
  const [content, setContent] = useState<PageContent>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, SaveStatus>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('visual');

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
            return <button disabled className="flex items-center justify-center w-full sm:w-auto bg-amber-500 text-white py-2.5 px-6 rounded-lg shadow-sm font-medium transition-colors cursor-not-allowed text-sm"><Loader className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...</button>;
        case 'success':
            return <button disabled className="flex items-center justify-center w-full sm:w-auto bg-emerald-500 text-white py-2.5 px-6 rounded-lg shadow-sm font-medium transition-colors text-sm"><CheckCircle className="h-4 w-4 mr-2" /> Tersimpan!</button>;
        default:
            return <button onClick={() => handleSave(formKeys)} className="flex items-center justify-center w-full sm:w-auto bg-brand-blue text-white py-2.5 px-6 rounded-lg shadow-sm font-medium hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all text-sm"><Save className="h-4 w-4 mr-2" /> Simpan Perubahan</button>;
    }
  };

  const inputClassName = "mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all sm:text-sm";
  const labelClassName = "block text-sm font-semibold text-gray-700 mb-1.5";

  if (loading) return <div className="flex flex-col items-center justify-center min-h-[60vh]"><Loader className="h-10 w-10 animate-spin text-brand-blue mb-4" /><p className="text-gray-500 font-medium">Memuat pengaturan konten...</p></div>;

  const tabs = [
    { id: 'visual', label: 'Visual & Gambar', icon: Monitor },
    { id: 'services', label: 'Layanan Publik', icon: LinkIcon },
    { id: 'vision', label: 'Visi & Misi', icon: Target },
    { id: 'history', label: 'Sejarah Profil', icon: History },
    { id: 'headmaster', label: 'Kepala Sekolah', icon: User },
  ] as const;

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Konten Profil</h1>
        <p className="text-gray-500 mt-2 text-lg">Konfigurasi seluruh teks, gambar utama, dan identitas website sekolah.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation for Tabs */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <nav className="flex flex-col p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-brand-blue' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-brand-blue' : 'text-gray-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            
            {activeTab === 'visual' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Visual & Gambar Utama</h2>
                  <p className="text-gray-500 text-sm mt-1">Atur logo dan banner utama yang tampil di beranda website.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={labelClassName}>URL Logo Sekolah (Header/Navbar)</label>
                    <input type="url" placeholder="https://..." className={inputClassName} 
                      value={content.logo_url || ''} onChange={(e) => handleContentChange('logo_url', e.target.value)} />
                    <p className="text-xs text-gray-500 mt-2">Disarankan format PNG dengan latar transparan.</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <label className={labelClassName}>URL Gambar Hero (Banner Besar Beranda)</label>
                    <input type="url" placeholder="https://..." className={inputClassName} 
                      value={content.hero_image_url || ''} onChange={(e) => handleContentChange('hero_image_url', e.target.value)} />
                    {content.hero_image_url && (
                      <div className="mt-3 aspect-video max-w-md overflow-hidden rounded-lg border border-gray-200">
                         <img src={content.hero_image_url} alt="Hero Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                   <div className="pt-4 border-t border-gray-100">
                    <label className={labelClassName}>URL Gambar Sambutan Kepala Sekolah</label>
                    <input type="url" placeholder="https://..." className={inputClassName} 
                      value={content.welcome_image_url || ''} onChange={(e) => handleContentChange('welcome_image_url', e.target.value)} />
                  </div>
                  <div className="pt-6 flex justify-end">
                    <SaveButton formKeys={['logo_url', 'hero_image_url', 'welcome_image_url']} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Layanan Publik Eksternal</h2>
                  <p className="text-gray-500 text-sm mt-1">Kartu layanan cepat (seperti portal lapor atau e-learning) yang tampil di beranda.</p>
                </div>
                
                <div className="grid gap-8">
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-5 flex items-center">
                      <span className="bg-brand-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                      Tautan Layanan Eksternal Pertama
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClassName}>Nama Layanan</label>
                        <input type="text" placeholder="Misal: Portal SP4N Lapor" className={inputClassName} 
                          value={content.pub_srv_1_name || ''} onChange={(e) => handleContentChange('pub_srv_1_name', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClassName}>URL Target</label>
                        <input type="url" placeholder="https://..." className={inputClassName} 
                          value={content.pub_srv_1_url || ''} onChange={(e) => handleContentChange('pub_srv_1_url', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClassName}>URL Logo/Ikon</label>
                        <input type="url" placeholder="https://..." className={inputClassName} 
                          value={content.pub_srv_1_logo || ''} onChange={(e) => handleContentChange('pub_srv_1_logo', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-5 flex items-center">
                      <span className="bg-brand-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                      Tautan Layanan Eksternal Kedua
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClassName}>Nama Layanan</label>
                        <input type="text" placeholder="Misal: PPDB Online" className={inputClassName} 
                          value={content.pub_srv_2_name || ''} onChange={(e) => handleContentChange('pub_srv_2_name', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClassName}>URL Target</label>
                        <input type="url" placeholder="https://..." className={inputClassName} 
                          value={content.pub_srv_2_url || ''} onChange={(e) => handleContentChange('pub_srv_2_url', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClassName}>URL Logo/Ikon</label>
                        <input type="url" placeholder="https://..." className={inputClassName} 
                          value={content.pub_srv_2_logo || ''} onChange={(e) => handleContentChange('pub_srv_2_logo', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                   <SaveButton formKeys={['pub_srv_1_name', 'pub_srv_1_url', 'pub_srv_1_logo', 'pub_srv_2_name', 'pub_srv_2_url', 'pub_srv_2_logo']} />
                </div>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Visi & Misi Sekolah</h2>
                  <p className="text-gray-500 text-sm mt-1">Teks visi misi yang akan ditampilkan di halaman Profil.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={labelClassName}>Visi Sekolah</label>
                    <textarea
                      rows={4}
                      className={inputClassName}
                      placeholder="Terwujudnya sekolah yang..."
                      value={content.vision || ''}
                      onChange={(e) => handleContentChange('vision', e.target.value)}
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <label className={labelClassName}>
                      Misi Sekolah 
                      <span className="text-gray-400 font-normal ml-2 font-normal text-xs bg-gray-100 px-2 py-1 rounded">Gunakan baris baru (Enter) untuk setiap poin misi</span>
                    </label>
                    <textarea
                      rows={10}
                      className={`${inputClassName} leading-relaxed`}
                      placeholder="1. Menyelenggarakan pendidikan yang...&#10;2. Meningkatkan kompetensi..."
                      value={content.mission || ''}
                      onChange={(e) => handleContentChange('mission', e.target.value)}
                    />
                  </div>
                  <div className="pt-6 flex justify-end">
                    <SaveButton formKeys={['vision', 'mission']} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Sejarah & Profil Lengkap</h2>
                  <p className="text-gray-500 text-sm mt-1">Cerita singkat mengenai sejarah berdirinya sekolah dan deskripsi profil.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={labelClassName}>Teks Profil Sekolah</label>
                    <textarea
                      rows={14}
                      className={`${inputClassName} leading-relaxed`}
                      placeholder="Sekolah ini didirikan pada tahun..."
                      value={content.history || ''}
                      onChange={(e) => handleContentChange('history', e.target.value)}
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <SaveButton formKeys={['history']} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'headmaster' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Sambutan Kepala Sekolah</h2>
                  <p className="text-gray-500 text-sm mt-1">Pesan sambutan yang tampil di beranda website untuk menyambut pengunjung.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={labelClassName}>Nama Lengkap Kepala Sekolah</label>
                    <input type="text" className={inputClassName} 
                      placeholder="Beserta gelar akademik..."
                      value={content.headmaster_name || ''}
                      onChange={(e) => handleContentChange('headmaster_name', e.target.value)}
                    />
                  </div>
                   <div className="pt-4 border-t border-gray-100">
                    <label className={labelClassName}>Teks Pesan Sambutan</label>
                    <textarea
                      rows={10}
                      className={`${inputClassName} leading-relaxed`}
                      placeholder="Assalamu'alaikum Wr. Wb.&#10;Selamat datang di website resmi..."
                      value={content.welcome_message || ''}
                      onChange={(e) => handleContentChange('welcome_message', e.target.value)}
                    />
                  </div>
                  <div className="pt-6 flex justify-end">
                    <SaveButton formKeys={['headmaster_name', 'welcome_message']} />
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ContentManagementPage;