import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookMarked, User as UserIcon, Key, LogIn, AlertCircle } from 'lucide-react';
import { User } from '../../types';

const mockUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'password',
    user: { id: 1, name: 'Admin Utama', role: 'admin' },
  },
  gurubk: {
    password: 'password',
    user: { id: 2, name: 'Budi (Guru BK)', role: 'guru_bk' },
  },
  // Example for a class president with NISN as username
  '0081234567': {
    password: 'password',
    user: { id: 1, name: 'Ahmad Budi Santoso', role: 'ketua_kelas', class: '9A' }
  }
};

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const account = mockUsers[username.toLowerCase()];

    if (account && account.password === password) {
      login(account.user);
      const redirectPath = account.user.role === 'admin' ? '/admin/dashboard' : '/admin/absensi';
      navigate(redirectPath);
    } else {
      setError('Username atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-2">
          <BookMarked className="h-12 w-12 text-brand-blue" />
          <h1 className="text-2xl font-bold text-center text-gray-900">Admin Panel Login</h1>
          <p className="text-center text-sm text-gray-600">SMP Negeri 3 Kalikajar</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username / NISN
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                placeholder="admin / 0081234567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                    placeholder="password"
                />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </button>
          </div>
           <div className="text-xs text-center text-gray-500 pt-4 border-t">
            <p className="font-semibold">Akun Demo (untuk Pratinjau):</p>
            <p>Admin: <span className="font-mono">admin</span> / <span className="font-mono">password</span></p>
            <p>Guru BK: <span className="font-mono">gurubk</span> / <span className="font-mono">password</span></p>
            <p>Ketua Kelas 9A: <span className="font-mono">0081234567</span> / <span className="font-mono">password</span></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
