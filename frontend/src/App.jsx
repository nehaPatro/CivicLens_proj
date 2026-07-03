import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

import Dashboard from './pages/dashboard/Dashboard'
import DetectIssues from './pages/dashboard/DetectIssues'
import SavedResults from './pages/dashboard/SavedResults'
import ReportIssue from './pages/dashboard/ReportIssue'
import Profile from './pages/dashboard/Profile'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="detect" element={<DetectIssues />} />
        <Route path="saved" element={<SavedResults />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
