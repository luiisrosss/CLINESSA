import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { hasValidSupabaseConfig } from '@/lib/supabase'

// Layout Components
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

// Pages
import LandingPage from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { PlanSelectionPage } from '@/pages/auth/PlanSelectionPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PatientsPage } from '@/pages/patients/PatientsPage'
import { AppointmentsPage } from '@/pages/appointments/AppointmentsPage'
import { MedicalRecordsPage } from '@/pages/medical-records/MedicalRecordsPage'
import { UsersPage } from '@/pages/users/UsersPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { BillingPage } from '@/pages/billing/BillingPage'
import { PlansPage } from '@/pages/billing/PlansPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import SupportPage from '@/pages/support/SupportPage'
import AccountPage from '@/pages/account/AccountPage'
import { SetupPage } from '@/pages/SetupPage'
import BlogPage from '@/pages/blog/BlogPage'
import ArticlePage from '@/pages/blog/ArticlePage'
import PlatformPage from '@/pages/platform/PlatformPage'
import ResourcesPage from '@/pages/resources/ResourcesPage'

function App() {
  // Si no hay configuración válida de Supabase, mostrar página de setup
  if (!hasValidSupabaseConfig) {
    return <SetupPage />;
  }

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/plans" element={<PlanSelectionPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="/platform" element={<PlatformPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route 
              path="patients" 
              element={
                <ProtectedRoute requiredPermissions={['canManagePatients']}>
                  <PatientsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="appointments" 
              element={
                <ProtectedRoute requiredPermissions={['canManageAppointments']}>
                  <AppointmentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="medical-records" 
              element={
                <ProtectedRoute requiredPermissions={['canViewMedicalRecords']}>
                  <MedicalRecordsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="users" 
              element={
                <ProtectedRoute requiredPermissions={['canManageUsers']}>
                  <UsersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="reports" 
              element={
                <ProtectedRoute requiredPermissions={['canViewReports']}>
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />
            <Route path="billing" element={<BillingPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
          
          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
