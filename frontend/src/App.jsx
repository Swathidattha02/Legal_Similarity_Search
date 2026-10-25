import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage     from './pages/LandingPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import DashboardPage   from './pages/DashboardPage';
import ResearchPage    from './pages/ResearchPage';
import ResultsPage     from './pages/ResultsPage';
import CaseDetailPage  from './pages/CaseDetailPage';
import HistoryPage     from './pages/HistoryPage';
import SavedCasesPage  from './pages/SavedCasesPage';
import DocumentsPage   from './pages/DocumentsPage';
import ProfilePage     from './pages/ProfilePage';

import AppShell from './components/layout/AppShell';
import './index.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner spinner-dark spinner-lg" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected routes — wrapped in AppShell (sidebar + topbar) */}
          <Route path="/dashboard"   element={<PrivateRoute><AppShell><DashboardPage /></AppShell></PrivateRoute>} />
          <Route path="/research"    element={<PrivateRoute><AppShell><ResearchPage /></AppShell></PrivateRoute>} />
          <Route path="/results/:id" element={<PrivateRoute><AppShell><ResultsPage /></AppShell></PrivateRoute>} />
          <Route path="/case/:id"    element={<PrivateRoute><AppShell><CaseDetailPage /></AppShell></PrivateRoute>} />
          <Route path="/history"     element={<PrivateRoute><AppShell><HistoryPage /></AppShell></PrivateRoute>} />
          <Route path="/saved"       element={<PrivateRoute><AppShell><SavedCasesPage /></AppShell></PrivateRoute>} />
          <Route path="/documents"   element={<PrivateRoute><AppShell><DocumentsPage /></AppShell></PrivateRoute>} />
          <Route path="/profile"     element={<PrivateRoute><AppShell><ProfilePage /></AppShell></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
