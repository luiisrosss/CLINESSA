import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Users, Calendar, FileText, Edit, Trash2, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { usePatients } from '@/hooks/usePatients'
import { useAuth } from '@/hooks/useAuth'
import { getInitials, calculateAge } from '@/lib/utils'
import type { Patient } from '@/types/database.types'
import { PatientForm } from '@/components/forms/PatientForm'
import { PatientDetailModal } from '@/components/patients/PatientDetailModal'
import toast from 'react-hot-toast'

interface PatientCardProps {
  patient: Patient
  onView: (patient: Patient) => void
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
}

function PatientCard({ patient, onView, onEdit, onDelete }: PatientCardProps) {
  const age = calculateAge(patient.birth_date)
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-medical-600 font-medium text-sm">
                {getInitials(`${patient.first_name} ${patient.last_name}`)}
              </span>
            </div>
            
            {/* Patient Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {patient.first_name} {patient.last_name}
                </h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {patient.patient_number}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Edad:</span> {age} años
                </div>
                <div>
                  <span className="font-medium">Género:</span> {
                    patient.gender === 'male' ? 'Masculino' : 
                    patient.gender === 'female' ? 'Femenino' : 'Otro'
                  }
                </div>
                <div>
                  <span className="font-medium">Teléfono:</span> {patient.phone || 'No registrado'}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {patient.email || 'No registrado'}
                </div>
              </div>
              
              {/* Medical Info */}
              <div className="mt-3 flex flex-wrap gap-2">
                {patient.blood_type && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    Tipo: {patient.blood_type}
                  </span>
                )}
                {patient.allergies && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Alergias
                  </span>
                )}
                {patient.insurance_provider && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {patient.insurance_provider}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onView(patient)
              }}
              className="p-2"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(patient)
              }}
              className="p-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(patient)
              }}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PatientsPage() {
  const { canManagePatients } = useAuth()
  const { patients, loading, error, createPatient, updatePatient, deletePatient } = usePatients()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Filter patients based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients)
      return
    }

    const filtered = patients.filter(patient => 
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.dni?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patient_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    setFilteredPatients(filtered)
  }, [patients, searchQuery])

  const handleDeletePatient = async (patient: Patient) => {
    if (!window.confirm(`¿Está seguro que desea eliminar el paciente ${patient.first_name} ${patient.last_name}?`)) {
      return
    }

    try {
      await deletePatient(patient.id)
      toast.success('Paciente eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar el paciente')
    }
  }

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowEditModal(true)
  }

  const handleCreatePatient = async (data: any) => {
    try {
      setFormLoading(true)
      await createPatient(data)
      toast.success('Paciente creado correctamente')
      setShowCreateModal(false)
    } catch (error) {
      toast.error('Error al crear el paciente')
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdatePatient = async (data: any) => {
    if (!selectedPatient) return
    
    try {
      setFormLoading(true)
      await updatePatient(selectedPatient.id, data)
      toast.success('Paciente actualizado correctamente')
      setShowEditModal(false)
      setSelectedPatient(null)
    } catch (error) {
      toast.error('Error al actualizar el paciente')
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  if (!canManagePatients) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Restringido</h2>
        <p className="text-gray-600">No tienes permisos para gestionar pacientes</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
          <p className="text-gray-600 mt-1">
            Administra la información de todos los pacientes de la clínica
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nuevo Paciente</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nuevos este mes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => {
                    const created = new Date(p.created_at)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Con historiales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.chronic_conditions || p.allergies).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar pacientes por nombre, DNI, número de paciente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Intenta con diferentes términos de búsqueda'
                  : 'Comienza agregando tu primer paciente al sistema'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Paciente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onView={handleViewPatient}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <PatientForm
          onSubmit={handleCreatePatient}
          onClose={() => setShowCreateModal(false)}
          loading={formLoading}
        />
      )}

      {showEditModal && selectedPatient && (
        <PatientForm
          patient={selectedPatient}
          onSubmit={handleUpdatePatient}
          onClose={() => {
            setShowEditModal(false)
            setSelectedPatient(null)
          }}
          loading={formLoading}
        />
      )}

      {showViewModal && selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => {
            setShowViewModal(false)
            setSelectedPatient(null)
          }}
          onEdit={() => {
            setShowViewModal(false)
            setShowEditModal(true)
          }}
        />
      )}
    </div>
  )
}