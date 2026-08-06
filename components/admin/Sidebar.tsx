import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Image as ImageIcon, Briefcase, Mail, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const allNavLinks = [
  { icon: LayoutDashboard, name: 'Dashboard', path: '/admin/dashboard', roles: ['admin', 'guru'] },
  { icon: FileText, name: 'Konten Profil', path: '/admin/content', roles: ['admin'] },
  { icon: Users, name: 'Data Guru', path: '/admin/guru', roles: ['admin'] },
  { icon: FileText, name: 'Berita & Pengumuman', path: '/admin/berita', roles: ['admin', 'guru'] },
  { icon: ImageIcon, name: 'Galeri Sekolah', path: '/admin/galeri', roles: ['admin', 'guru'] },
  { icon: Briefcase, name: 'Layanan Publik', path: '/admin/layanan', roles: ['admin'] },
  { icon: Mail, name: 'Pesan Masuk', path: '/admin/pesan', roles: ['admin'] },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const userRole = user?.role;

  const activeClassName = "bg-gray-700 text-white";
  const inactiveClassName = "text-gray-300 hover:bg-gray-700 hover:text-white";
  
  const filteredNavLinks = allNavLinks.filter(link => userRole && link.roles.includes(userRole));

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-20 flex items-center justify-between px-4 bg-gray-900">
        <h1 className="text-xl font-bold tracking-wider">PANEL ADMIN</h1>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 md:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 5rem)' }}>
        {filteredNavLinks.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                isActive ? activeClassName : inactiveClassName
              }`
            }
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.name}
          </NavLink>
        ))}

      </nav>
    </div>
  );
};

export default Sidebar;
