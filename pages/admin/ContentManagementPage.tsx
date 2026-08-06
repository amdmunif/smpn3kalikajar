import React, { useState, useEffect, useRef } from 'react';
import { PageContent, ExternalService } from '../../types';
import { Loader, CheckCircle, Save, Monitor, Link as LinkIcon, Target, History, User, Upload, X, Plus, Trash2, Edit } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';
type TabId = 'visual' | 'services' | 'vision' | 'history' | 'headmaster';

const ContentManagementPage: React.FC = () => {
  const [content, setContent] = useState<PageContent>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, SaveStatus>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('visual');
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  // External services state
  const [extServices, setExtServices] = useState<ExternalService[]>([]);
  const [extFormData, setExtFormData] = useState<Partial<ExternalService>>({});
  const [isEditingExt, setIsEditingExt] = useState(false);

  useEffect(() => {
    fetchContent();
    fetchExtServices();
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

  const fetchExtServices = async () => {
    try {
      const response = await fetch('/api/external_services.php');
      const data = await response.json();
      setExtServices(data);
    } catch (error) {
      console.error('Error fetching external services:', error);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string, isFavicon: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [key]: true }));
    const form = new FormData();
    form.append('file', file);
    if (isFavicon) {
        form.append('is_favicon', 'true');
    }

    try {
      const response = await fetch('/api/upload.php', {
        method: 'POST',
        body: form,
      });
      const data = await response.json();
      if (data.success) {
        if (key === 'ext_icon') {
            setExtFormData(prev => ({ ...prev, icon_url: data.url }));
        } else {
            handleContentChange(key, data.url);
        }
      } else {
        alert('Upload gagal: ' + data.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Terjadi kesalahan saat upload gambar.');
    } finally {
      setIsUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleSaveExtService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/external_services.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extFormData)
      });
      const result = await response.json();
      if (result.success) {
        fetchExtServices();
        setExtFormData({});
        setIsEditingExt(false);
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving external service:', error);
    }
  };

  const handleDeleteExtService = async (id: number) => {
    if (window.confirm('Hapus layanan eksternal ini?')) {
      try {
        const response = await fetch(`/api/external_services.php?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          fetchExtServices();
        }
      } catch (error) {
        console.error('Error deleting external service:', error);
      }
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
    { id: 'services', label: 'Layanan Publik (Eksternal)', icon: LinkIcon },
    { id: 'vision', label: 'Visi & Misi', icon: Target },
    { id: 'history', label: 'Sejarah Profil', icon: History },
    { id: 'headmaster', label: 'Sambutan Kepala Sekolah', icon: User },
  ] as const;

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Konten Profil</h1>
        <p className="text-gray-500 mt-2 text-lg">Konfigurasi seluruh teks, gambar utama, dan identitas website sekolah.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
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
                      isActive ? 'bg-blue-50 text-brand-blue' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            
            {activeTab === 'visual' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Visual & Gambar Utama</h2>
                  <p className="text-gray-500 text-sm mt-1">Atur logo dan banner utama yang tampil di beranda website.</p>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className={labelClassName}>Logo Sekolah & Favicon</label>
                    <div className="mt-2 flex items-center space-x-6">
                      <div className="h-24 w-24 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center p-2">
                        {content.logo_url ? <img src={content.logo_url} className="max-h-full max-w-full object-contain" /> : <Monitor className="h-8 w-8 text-gray-300" />}
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium">
                          {isUploading['logo_url'] ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                          Upload Logo (Juga mengubah Favicon)
                          <input type="file" className="hidden" accept="image/png, image/jpeg, image/ico" onChange={(e) => handleFileUpload(e, 'logo_url', true)} />
                        </label>
                        <p className="text-xs text-gray-500">Gunakan format PNG transparan untuk hasil terbaik.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <label className={labelClassName}>Gambar Hero (Banner Beranda)</label>
                    <div className="mt-2 space-y-4">
                      {content.hero_image_url && (
                        <div className="aspect-[21/9] max-w-2xl rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group">
                          <img src={content.hero_image_url} alt="Hero Banner" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center hover:bg-gray-50">
                              <Upload className="h-4 w-4 mr-2" /> Ganti Banner
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image_url')} />
                            </label>
                          </div>
                        </div>
                      )}
                      {!content.hero_image_url && (
                         <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                           {isUploading['hero_image_url'] ? <Loader className="h-8 w-8 text-gray-400 animate-spin mb-2" /> : <Upload className="h-8 w-8 text-gray-400 mb-2" />}
                           <span className="text-sm font-medium text-gray-600">Klik untuk upload Banner Utama</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image_url')} />
                         </label>
                      )}
                      <p className="text-xs text-gray-500 flex items-center bg-blue-50 text-blue-700 p-3 rounded-lg max-w-2xl">
                        💡 Panduan: Gambar akan terpotong secara otomatis (auto-crop) untuk menyesuaikan layar. Gunakan resolusi ideal seperti 1920x1080 (Lanskap lebar) agar gambar tetap tajam.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex justify-end border-t border-gray-100">
                    <SaveButton formKeys={['logo_url', 'hero_image_url']} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Layanan Publik (Eksternal)</h2>
                    <p className="text-gray-500 text-sm mt-1">Kartu portal eksternal (seperti Lapor Bupati atau E-learning) di beranda.</p>
                  </div>
                  {!isEditingExt && (
                    <button onClick={() => { setExtFormData({}); setIsEditingExt(true); }} className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-lightblue transition-colors">
                      <Plus className="h-4 w-4 mr-2" /> Tambah Tautan
                    </button>
                  )}
                </div>
                
                {isEditingExt ? (
                  <form onSubmit={handleSaveExtService} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800">{extFormData.id ? 'Edit Layanan Eksternal' : 'Layanan Eksternal Baru'}</h3>
                      <button type="button" onClick={() => setIsEditingExt(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClassName}>Nama Layanan / Portal</label>
                        <input type="text" value={extFormData.name || ''} onChange={e => setExtFormData(p => ({...p, name: e.target.value}))} required className={inputClassName} placeholder="Contoh: Portal SP4N Lapor" />
                      </div>
                      <div>
                        <label className={labelClassName}>URL Target</label>
                        <input type="url" value={extFormData.url || ''} onChange={e => setExtFormData(p => ({...p, url: e.target.value}))} required className={inputClassName} placeholder="https://..." />
                      </div>
                      <div>
                        <label className={labelClassName}>Logo / Ikon Portal <span className="text-gray-400 font-normal">(Opsional)</span></label>
                        <div className="flex items-center space-x-4 mt-1">
                           {extFormData.icon_url ? (
                             <div className="h-12 w-12 rounded border bg-white p-1 relative">
                               <img src={extFormData.icon_url} className="w-full h-full object-contain" />
                               <button type="button" onClick={() => setExtFormData(p => ({...p, icon_url: ''}))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="h-3 w-3" /></button>
                             </div>
                           ) : (
                             <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium text-gray-700">
                               {isUploading['ext_icon'] ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload Logo
                               <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'ext_icon')} />
                             </label>
                           )}
                        </div>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <button type="submit" className="px-5 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-lightblue">Simpan</button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {extServices.map(srv => (
                      <div key={srv.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start space-x-4 shadow-sm group hover:border-brand-blue/30 transition-colors">
                        <div className="h-12 w-12 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-100 p-1 flex items-center justify-center">
                          {srv.icon_url ? <img src={srv.icon_url} className="max-h-full max-w-full object-contain" /> : <LinkIcon className="h-6 w-6 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{srv.name}</h4>
                          <a href={srv.url} target="_blank" className="text-xs text-blue-600 truncate hover:underline block mt-0.5">{srv.url}</a>
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setExtFormData(srv); setIsEditingExt(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteExtService(srv.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                    {extServices.length === 0 && (
                      <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-500">Belum ada layanan eksternal.</div>
                    )}
                  </div>
                )}
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
                    <textarea rows={4} className={inputClassName} value={content.vision || ''} onChange={(e) => handleContentChange('vision', e.target.value)} />
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <label className={labelClassName}>
                      Misi Sekolah 
                      <span className="text-gray-400 font-normal ml-2 font-normal text-xs bg-gray-100 px-2 py-1 rounded">Gunakan baris baru (Enter) untuk setiap poin misi</span>
                    </label>
                    <textarea rows={10} className={`${inputClassName} leading-relaxed`} value={content.mission || ''} onChange={(e) => handleContentChange('mission', e.target.value)} />
                  </div>
                  <div className="pt-6 flex justify-end"><SaveButton formKeys={['vision', 'mission']} /></div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Sejarah & Profil Lengkap</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={labelClassName}>Teks Profil Sekolah</label>
                    <textarea rows={14} className={`${inputClassName} leading-relaxed`} value={content.history || ''} onChange={(e) => handleContentChange('history', e.target.value)} />
                  </div>
                  <div className="pt-4 flex justify-end"><SaveButton formKeys={['history']} /></div>
                </div>
              </div>
            )}

            {activeTab === 'headmaster' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Sambutan Kepala Sekolah</h2>
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
                    <User className="h-5 w-5 text-brand-blue mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Nama dan Foto Ditarik Otomatis</h4>
                      <p className="text-sm text-blue-700 mt-1">Sistem akan secara otomatis mengambil Nama dan Foto dari <strong>Data Guru</strong> yang memiliki jabatan <strong>Kepala Sekolah</strong>. Anda cukup menuliskan kata sambutannya di bawah ini.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={labelClassName}>Teks Pesan Sambutan</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue/50 focus-within:border-brand-blue transition-all">
                      <Editor
                        apiKey="a6av81tpfj54ylxetjioaunho1ja53ana1c28l9jndbsbql3"
                        value={content.welcome_message || ''}
                        onEditorChange={(newContent) => handleContentChange('welcome_message', newContent)}
                        init={{
                          height: 400,
                          menubar: false,
                          plugins: ['link', 'lists', 'wordcount'],
                          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | removeformat',
                          content_style: 'body { font-family:Inter,sans-serif; font-size:14px; line-height: 1.6 }'
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-6 flex justify-end border-t border-gray-100">
                    <SaveButton formKeys={['welcome_message']} />
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