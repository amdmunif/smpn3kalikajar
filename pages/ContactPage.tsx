import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-brand-blue text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-gray-300">{subtitle}</p>
    </div>
  </div>
);

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    sender_name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch('/api/messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitStatus({ type: 'success', message: 'Pesan Anda berhasil dikirim! Kami akan segera merespons.' });
        setFormData({ sender_name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: 'Gagal mengirim pesan: ' + result.message });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus({ type: 'error', message: 'Terjadi kesalahan pada sistem. Silakan coba lagi nanti.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-background">
      <PageHeader title="Kontak & Lokasi" subtitle="Kami siap membantu. Hubungi kami melalui informasi di bawah ini." />

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info & Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-brand-blue" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Alamat</h3>
                  <p className="text-gray-600">Desa Kembaran, Kecamatan Kalikajar, Wonosobo, Jawa Tengah, 56372</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-brand-blue" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Telepon</h3>
                  <p className="text-gray-600">(0286) 329308</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-brand-blue" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">info@smpn3kalikajar.sch.id</p>
                </div>
              </div>
            </div>
            
             <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Kirim Pesan</h2>
             {submitStatus && (
               <div className={`p-4 mb-6 rounded-md ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                 {submitStatus.message}
               </div>
             )}
             <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="sender_name" className="sr-only">Nama</label>
                    <input type="text" name="sender_name" id="sender_name" value={formData.sender_name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="Nama Anda" />
                 </div>
                 <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="Email Anda" />
                 </div>
                 <div>
                    <label htmlFor="subject" className="sr-only">Subjek</label>
                    <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="Subjek Pesan" />
                 </div>
                 <div>
                    <label htmlFor="message" className="sr-only">Pesan</label>
                    <textarea name="message" id="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="Pesan Anda"></textarea>
                 </div>
                 <div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-brand-blue text-white py-3 px-6 rounded-md hover:bg-brand-lightblue transition-colors duration-300 disabled:bg-gray-400">
                      {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                    </button>
                 </div>
             </form>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=-7.4091118,110.0321960&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi SMP Negeri 3 Kalikajar"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;