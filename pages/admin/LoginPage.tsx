import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { BookMarked, User as UserIcon, Key, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for premium feel
    setTimeout(() => {
      const account = mockUsers[username.toLowerCase()];

      if (account && account.password === password) {
        login(account.user);
        const redirectPath = account.user.role === 'admin' ? '/admin/dashboard' : '/admin/absensi';
        navigate(redirectPath);
      } else {
        setError('Kredensial tidak valid. Silakan periksa kembali username dan password Anda.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transform scale-105 transition-transform duration-10000 ease-in-out"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          animation: 'slowZoom 20s infinite alternate'
        }}
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-blue/90 via-blue-900/80 to-slate-900/95" />

      {/* Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-lightblue/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-0 animate-fade-in-up">
        <div className="backdrop-blur-xl bg-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20">
          
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="bg-white/20 p-4 rounded-2xl shadow-inner mb-4 backdrop-blur-md hover:bg-white/30 transition-colors group cursor-pointer" title="Kembali ke Beranda">
               <BookMarked className="h-10 w-10 text-brand-secondary group-hover:scale-110 transition-transform" />
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Portal Akses</h1>
            <p className="text-blue-200 mt-2 text-sm font-medium">Sistem Informasi Manajemen Sekolah</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-blue-100 ml-1">
                Username / NISN
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:ring-2 focus:ring-brand-secondary focus:border-transparent focus:bg-white/20 transition-all duration-300 outline-none"
                  placeholder="Masukkan username Anda"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password"className="block text-sm font-medium text-blue-100 ml-1">
                Kata Sandi
              </label>
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:ring-2 focus:ring-brand-secondary focus:border-transparent focus:bg-white/20 transition-all duration-300 outline-none"
                      placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-white transition-colors focus:outline-none"
                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
              </div>
            </div>
            
            {error && (
              <div className="flex items-center text-sm text-red-200 bg-red-900/50 p-3 rounded-lg border border-red-500/30 animate-shake">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-brand-blue bg-brand-secondary hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-brand-secondary transition-all duration-300 disabled:opacity-70 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengautentikasi...
                </span>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Masuk ke Sistem
                </>
              )}
            </button>
            
            <div className="pt-6 border-t border-white/10">
              <div className="text-xs text-center text-blue-200 bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <p className="font-semibold text-white mb-2 uppercase tracking-wider">Kredensial Demo</p>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="bg-white/5 p-2 rounded">
                    <span className="block text-[10px] text-blue-300">Admin Utama</span>
                    <span className="font-mono text-white">admin</span> / <span className="font-mono text-white">password</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded">
                    <span className="block text-[10px] text-blue-300">Ketua Kelas 9A</span>
                    <span className="font-mono text-white">0081234567</span> / <span className="font-mono text-white">password</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <p className="text-center text-blue-200/60 mt-6 text-sm">
          &copy; {new Date().getFullYear()} SMP Negeri 3 Kalikajar
        </p>
      </div>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
