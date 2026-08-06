
import React from 'react';
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
             <form className="space-y-4">
                 <div>
                    <label htmlFor="name" className="sr-only">Nama</label>
                    <input type="text" name="name" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="Nama Anda" />
                 </div>
                 <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input type="email" name="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="Email Anda" />
                 </div>
                 <div>
                    <label htmlFor="message" className="sr-only">Pesan</label>
                    <textarea name="message" id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="Pesan Anda"></textarea>
                 </div>
                 <div>
                    <button type="submit" className="w-full bg-brand-blue text-white py-3 px-6 rounded-md hover:bg-brand-lightblue transition-colors duration-300">Kirim Pesan</button>
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