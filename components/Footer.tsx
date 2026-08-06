
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-blue text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-secondary">SMP Negeri 3 Kalikajar</h3>
            <p className="text-gray-300 text-sm">Mencetak generasi cerdas, terampil, dan berakhlak mulia yang siap menghadapi tantangan zaman.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-secondary">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/profil" className="text-sm text-gray-300 hover:text-white">Profil Sekolah</Link></li>
              <li><Link to="/layanan" className="text-sm text-gray-300 hover:text-white">Layanan Publik</Link></li>
              <li><Link to="/berita" className="text-sm text-gray-300 hover:text-white">Berita & Pengumuman</Link></li>
              <li><Link to="/program" className="text-sm text-gray-300 hover:text-white">Program & Ekstrakurikuler</Link></li>
              <li><Link to="/kontak" className="text-sm text-gray-300 hover:text-white">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-secondary">Kontak Kami</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <MapPin className="flex-shrink-0 h-5 w-5 text-brand-secondary mt-0.5" />
                <span className="ml-3 text-sm text-gray-300">Desa Kembaran, Kecamatan Kalikajar, Wonosobo, Jawa Tengah, 56372</span>
              </li>
              <li className="flex items-center">
                <Phone className="flex-shrink-0 h-5 w-5 text-brand-secondary" />
                <span className="ml-3 text-sm text-gray-300">(0286) 329308</span>
              </li>
              <li className="flex items-center">
                <Mail className="flex-shrink-0 h-5 w-5 text-brand-secondary" />
                <span className="ml-3 text-sm text-gray-300">info@smpn3kalikajar.sch.id</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-brand-secondary">Ikuti Kami</h3>
             <div className="flex mt-4 space-x-4">
                <a href="#" className="text-gray-300 hover:text-white"><span className="sr-only">Facebook</span><Facebook /></a>
                <a href="#" className="text-gray-300 hover:text-white"><span className="sr-only">Instagram</span><Instagram /></a>
                <a href="#" className="text-gray-300 hover:text-white"><span className="sr-only">YouTube</span><Youtube /></a>
             </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} SMP Negeri 3 Kalikajar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;