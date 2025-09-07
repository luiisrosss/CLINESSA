import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Users, Calendar, FileText, Edit, Trash2, Eye, Download, SortAsc, SortDesc } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
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
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="notion-card hover:shadow-notion-md transition-all duration-200 cursor-pointer group">
        <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 dark:text-primary-400 font-normal text-sm">
                {getInitials(`${patient.first_name} ${patient.last_name}`)}
              </span>
            </div>
            
            {/* Patient Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                <h3 className="text-base font-normal text-primary-1000 dark:text-primary-0 truncate">
                  {patient.first_name} {patient.last_name}
                </h3>
                <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-2 py-1 rounded w-fit">
                  {patient.patient_number}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-primary-600 dark:text-primary-400">
                <div>
                  <span className="font-normal">Edad:</span> {age} años
                </div>
                <div>
                  <span className="font-medium">Género:</span> {
                    patient.gender === 'male' ? 'Masculino' : 
                    patient.gender === 'female' ? 'Femenino' : 'Otro'
                  }
                </div>
                <div className="truncate">
                  <span className="font-medium">Teléfono:</span> {patient.phone || 'No registrado'}
                </div>
                <div className="truncate">
                  <span className="font-medium">Email:</span> {patient.email || 'No registrado'}
                </div>
              </div>
              
              {/* Medical Info */}
              <div className="mt-3 flex flex-wrap gap-2">
                {patient.blood_type && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    Tipo: {patient.blood_type}
                  </span>
                )}
                {patient.allergies && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                    Alergias
                  </span>
                )}
                {patient.insurance_provider && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {patient.insurance_provider}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-end sm:justify-start space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
    </motion.div>
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
  
  // New state for advanced features
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'created_at'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [ageFilter, setAgeFilter] = useState<{ min: number; max: number } | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort patients
  useEffect(() => {
    let filtered = [...patients]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(patient => 
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.dni?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply age filter
    if (ageFilter) {
      filtered = filtered.filter(patient => {
        const age = calculateAge(patient.birth_date)
        return age >= ageFilter.min && age <= ageFilter.max
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
          break
        case 'age':
          comparison = calculateAge(a.birth_date) - calculateAge(b.birth_date)
          break
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    setFilteredPatients(filtered)
  }, [patients, searchQuery, ageFilter, sortBy, sortOrder])

  // Export patients to CSV
  const exportToCSV = () => {
    const headers = ['Nombre', 'Apellido', 'DNI', 'Email', 'Teléfono', 'Edad', 'Número de Paciente', 'Fecha de Registro']
    const csvContent = [
      headers.join(','),
      ...filteredPatients.map(patient => [
        patient.first_name,
        patient.last_name,
        patient.dni || '',
        patient.email || '',
        patient.phone || '',
        calculateAge(patient.birth_date),
        patient.patient_number,
        new Date(patient.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `pacientes_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Lista de pacientes exportada correctamente')
  }

  const handleDeletePatient = async (patient: Patient) => {
    if (!window.confirm(`¿Está seguro que desea eliminar el paciente ${patient.first_name} ${patient.last_name}?`)) {
      return
    }

    try {
      await deletePatient(patient.id)
      toast.success('Paciente eliminado correctamente')
    } catch {
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

  const handleCreatePatient = async (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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

  const handleUpdatePatient = async (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
    <div className="section-spacing-large">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl font-normal text-primary-1000 dark:text-primary-0">Gestión de Pacientes</h1>
          <p className="text-primary-600 dark:text-primary-400 mt-1">
            Administra la información de todos los pacientes de la clínica
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Nuevo Paciente</span>
        </Button>
      </div>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Total Pacientes</p>
                <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Nuevos este mes</p>
                <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">
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
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-accent-100 dark:bg-accent-900 rounded">
                <FileText className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Con historiales</p>
                <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">
                  {patients.filter(p => p.chronic_conditions || p.allergies).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <motion.div 
        className="notion-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input
              type="text"
              placeholder="Buscar pacientes por nombre, DNI, número de paciente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="notion-input pl-10"
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Sort */}
            <div className="flex items-center space-x-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'age' | 'created_at')}
                className="notion-input text-sm"
              >
                <option value="created_at">Fecha</option>
                <option value="name">Nombre</option>
                <option value="age">Edad</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
                title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md transition-colors flex items-center space-x-1 ${
                showFilters 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100' 
                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtros</span>
            </button>
            
            {/* Export */}
            <button
              onClick={exportToCSV}
              className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
              title="Exportar a CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <motion.div 
            className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Rango de Edad
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={ageFilter?.min || ''}
                    onChange={(e) => setAgeFilter(prev => ({ 
                      min: parseInt(e.target.value) || 0, 
                      max: prev?.max || 100 
                    }))}
                    className="notion-input w-20"
                  />
                  <span className="text-primary-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={ageFilter?.max || ''}
                    onChange={(e) => setAgeFilter(prev => ({ 
                      min: prev?.min || 0, 
                      max: parseInt(e.target.value) || 100 
                    }))}
                    className="notion-input w-20"
                  />
                  <button
                    onClick={() => setAgeFilter(null)}
                    className="text-sm text-primary-500 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setAgeFilter(null)
                    setSortBy('created_at')
                    setSortOrder('desc')
                  }}
                  className="notion-button-outline text-sm"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

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
          <motion.div 
            className="grid gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <PatientCard
                  patient={patient}
                  onView={handleViewPatient}
                  onEdit={handleEditPatient}
                  onDelete={handleDeletePatient}
                />
              </motion.div>
            ))}
          </motion.div>
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