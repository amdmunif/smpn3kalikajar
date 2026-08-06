
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, BookMarked } from 'lucide-react';

const navLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Profil', path: '/profil' },
  { name: 'Program', path: '/program' },
  { name: 'Berita', path: '/berita' },
  { name: 'Galeri', path: '/galeri' },
  { name: 'Kontak', path: '/kontak' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetch('/api/get_content.php')
      .then(res => res.json())
      .then(data => {
        if (data.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(err => console.error('Error fetching logo:', err));
  }, []);

  const activeLinkStyle = {
    color: '#FFC107',
    fontWeight: '600',
  };

  return (
    <nav className="bg-brand-blue shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 text-white">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Sekolah" className="h-10 w-auto" />
              ) : (
                <BookMarked className="h-8 w-8 text-brand-secondary" />
              )}
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">SMPN 3</span>
                <span className="text-sm leading-tight">Kalikajar</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end
                  style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                  className="text-gray-300 hover:bg-brand-lightblue hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end
                onClick={() => setIsOpen(false)}
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="text-gray-300 hover:bg-brand-lightblue hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
