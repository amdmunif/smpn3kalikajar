
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProgramsPage from './pages/ProgramsPage';
import NewsPage from './pages/NewsPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import PublicServicePage from './pages/PublicServicePage';

// Admin components
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import StudentManagementPage from './pages/admin/StudentManagementPage';
import TeacherManagementPage from './pages/admin/TeacherManagementPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import ScheduleManagementPage from './pages/admin/ScheduleManagementPage';
import GradeManagementPage from './pages/admin/GradeManagementPage';
import AttendanceManagementPage from './pages/admin/AttendanceManagementPage';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const PublicSiteRoutes = () => (
  <div className="flex flex-col min-h-screen font-sans">
    <Navbar />
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/program" element={<ProgramsPage />} />
        <Route path="/berita" element={<NewsPage />} />
        <Route path="/galeri" element={<GalleryPage />} />
        <Route path="/kontak" element={<ContactPage />} />
        <Route path="/layanan" element={<PublicServicePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

const AdminRoutes = () => (
   <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/*" element={
      <ProtectedRoute>
        <AdminLayout>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/content" element={<ContentManagementPage />} />
            <Route path="/siswa" element={<StudentManagementPage />} />
            <Route path="/guru" element={<TeacherManagementPage />} />
            <Route path="/jadwal" element={<ScheduleManagementPage />} />
            <Route path="/nilai" element={<GradeManagementPage />} />
            <Route path="/absensi" element={<AttendanceManagementPage />} />
            {/* Fallback to dashboard for any other admin route */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </AdminLayout>
      </ProtectedRoute>
    } />
  </Routes>
);


const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<PublicSiteRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;