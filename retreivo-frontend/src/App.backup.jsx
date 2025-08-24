import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { getBackendHealth, getMlHealth } from './services/api'
import Header from './components/common/Header'
import LandingPage from './pages/LandingPage.jsx'
import UserAuth from './pages/auth/UserAuth.jsx'
import HubAuth from './pages/auth/HubAuth.jsx'
import Signup from './pages/auth/Signup'
import OTPVerification from './pages/auth/OTPVerification'
import UserDashboard from './pages/user/UserDashboard'
import ReportLostItem from './pages/user/ReportLostItem.jsx'
import ReportFound from './pages/user/ReportFound'
import SearchItems from './pages/user/SearchItems.jsx'
import Rewards from './pages/user/Rewards'
import MyReports from './pages/user/MyReports.jsx'
import MyClaims from './pages/user/MyClaims.jsx'
import RewardsWallet from './pages/user/RewardsWallet.jsx'
import HubDashboard from './pages/hub/HubDashboard'
import ClaimsManagement from './pages/hub/ClaimsManagement'
import Analytics from './pages/hub/Analytics'

export default function App() {
  const [backend, setBackend] = useState(null)
  const [ml, setMl] = useState(null)

  useEffect(() => {
    getBackendHealth().then(setBackend).catch(() => setBackend({ ok: false }))
    getMlHealth().then(setMl).catch(() => setMl({ ok: false }))
  }, [])

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login-user" element={<UserAuth />} />
        <Route path="/login-hub" element={<HubAuth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/report-lost" element={<ReportLostItem />} />
        <Route path="/user/report-found" element={<ReportFound />} />
        <Route path="/user/search" element={<SearchItems />} />
        <Route path="/user/rewards" element={<Rewards />} />
        <Route path="/user/my-reports" element={<MyReports />} />
        <Route path="/user/my-claims" element={<MyClaims />} />
        <Route path="/user/wallet" element={<RewardsWallet />} />
        <Route path="/hub" element={<HubDashboard />} />
        <Route path="/hub/claims" element={<ClaimsManagement />} />
        <Route path="/hub/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  )
}





