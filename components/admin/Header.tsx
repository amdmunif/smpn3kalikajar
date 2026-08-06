import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  const getRoleName = (role: string | undefined) => {
    switch (role) {
      case 'admin': return 'Admin Utama';
      case 'guru_bk': return 'Guru';
      default: return 'User';
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 relative shadow-sm">
      <button
        onClick={toggleSidebar}
        className="p-2 mr-4 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 md:hidden transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Spacer for desktop to keep user menu on the right */}
      <div className="hidden md:block flex-1"></div>

      <div className="relative flex-1 md:flex-none flex justify-end">
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)} 
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
        >
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-800">{user?.name || 'User'}</span>
            <span className="text-xs text-gray-500">{getRoleName(user?.role)}</span>
          </div>
          <User className="h-8 w-8 text-gray-600 bg-gray-200 rounded-full p-1 ml-2" />
          <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
