import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, FileText, Calendar, BarChart2, BookOpen, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const allNavLinks = [
  { icon: LayoutDashboard, name: 'Dashboard', path: '/admin/dashboard', roles: ['admin', 'guru_bk'] },
  { icon: FileText, name: 'Konten Website', path: '/admin/content', roles: ['admin'] },
  { icon: Users, name: 'Data Siswa', path: '/admin/siswa', roles: ['admin'] },
  { icon: UserCog, name: 'Data Guru', path: '/admin/guru', roles: ['admin'] },
  { icon: Calendar, name: 'Jadwal Pelajaran', path: '/admin/jadwal', roles: ['admin'] },
  { icon: BarChart2, name: 'Nilai Siswa', path: '/admin/nilai', roles: ['admin'] },
  { icon: BookOpen, name: 'Absensi Siswa', path: '/admin/absensi', roles: ['admin', 'guru_bk', 'ketua_kelas'] },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  const activeClassName = "bg-gray-700 text-white";
  const inactiveClassName = "text-gray-300 hover:bg-gray-700 hover:text-white";
  
  const filteredNavLinks = allNavLinks.filter(link => userRole && link.roles.includes(userRole));

  return (
    <div className="w-64 bg-gray-800 text-white flex-col hidden md:flex">
      <div className="h-20 flex items-center justify-center px-4 bg-gray-900">
        <h1 className="text-xl font-bold tracking-wider">PANEL ADMIN</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {filteredNavLinks.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
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
      {userRole === 'admin' && (
        <div className="px-2 py-4 border-t border-gray-700">
           <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                  isActive ? activeClassName : inactiveClassName
                }`
              }
            >
              <Settings className="h-5 w-5 mr-3" />
              Pengaturan
            </NavLink>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
