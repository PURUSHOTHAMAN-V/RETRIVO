import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { getBackendHealth, getMlHealth } from './services/api'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import ErrorBoundary from './components/common/ErrorBoundary'
import ChatBot from './components/chat/ChatBot'
import ProtectedRoute from './components/common/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginSelection from './pages/auth/LoginSelection'
import UserAuth from './pages/auth/UserAuth'
import HubAuth from './pages/auth/HubAuth'
import OTPVerification from './pages/auth/OTPVerification'
import ReportLostItem from './pages/user/ReportLostItem'
import ReportFound from './pages/user/ReportFound'
import SearchItems from './pages/user/SearchItems'
import Rewards from './pages/user/Rewards'
import MyReports from './pages/user/MyReports'
import MyClaims from './pages/user/MyClaims'
import RewardsWallet from './pages/user/RewardsWallet'
import HubDashboard from './pages/hub/HubDashboard'
import ClaimsManagement from './pages/hub/ClaimsManagement'
import Analytics from './pages/hub/Analytics'

// Component to conditionally render footer
const AppContent = () => {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/login-user', '/login-hub', '/signup', '/otp'];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginSelection />} />
          <Route path="/login-user" element={<UserAuth />} />
          <Route path="/login-hub" element={<HubAuth />} />
          <Route path="/signup" element={<UserAuth />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/user" element={<Navigate to="/user/search" replace />} />
          <Route path="/user/report-lost" element={<ProtectedRoute><ReportLostItem /></ProtectedRoute>} />
          <Route path="/user/report-found" element={<ProtectedRoute><ReportFound /></ProtectedRoute>} />
          <Route path="/user/search" element={<ProtectedRoute><SearchItems /></ProtectedRoute>} />
          <Route path="/user/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
          <Route path="/user/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
          <Route path="/user/my-claims" element={<ProtectedRoute><MyClaims /></ProtectedRoute>} />
          <Route path="/user/wallet" element={<ProtectedRoute><RewardsWallet /></ProtectedRoute>} />
          <Route path="/hub" element={<HubDashboard />} />
          <Route path="/hub/claims" element={<ClaimsManagement />} />
          <Route path="/hub/analytics" element={<Analytics />} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
      <ChatBot />
    </div>
  );
};

export default function App() {
  const [backend, setBackend] = useState(null)
  const [ml, setMl] = useState(null)

  useEffect(() => {
    getBackendHealth().then(setBackend).catch(() => setBackend({ ok: false }))
    getMlHealth().then(setMl).catch(() => setMl({ ok: false }))
  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  )
}


