import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { hasValidSupabaseConfig } from '@/lib/supabase'

// Layout Components
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

// Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { PlanSelectionPage } from '@/pages/auth/PlanSelectionPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PatientsPage } from '@/pages/patients/PatientsPage'
import { AppointmentsPage } from '@/pages/appointments/AppointmentsPage'
import { SetupPage } from '@/pages/SetupPage'

const MedicalRecordsPage = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Historiales Médicos</h2>
    <p className="text-gray-600">Módulo en desarrollo - Próximamente disponible</p>
  </div>
)

const UsersPage = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Gestión de Usuarios</h2>
    <p className="text-gray-600">Módulo en desarrollo - Próximamente disponible</p>
  </div>
)

const SettingsPage = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Configuración</h2>
    <p className="text-gray-600">Módulo en desarrollo - Próximamente disponible</p>
  </div>
)

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
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/plans" element={<PlanSelectionPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
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
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
