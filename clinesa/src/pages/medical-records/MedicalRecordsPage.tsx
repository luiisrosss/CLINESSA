import { useState, useEffect } from 'react'
import { Plus, Search, Filter, FileText, Calendar, User, Eye, Edit, Trash2, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MedicalRecordForm } from '@/components/forms/MedicalRecordForm'
import { useAuth } from '@/hooks/useAuth'
import { useMedicalRecords, type MedicalRecord } from '@/hooks/useMedicalRecords'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'


interface MedicalRecordCardProps {
  record: MedicalRecord
  onView: (record: MedicalRecord) => void
  onEdit: (record: MedicalRecord) => void
  onDelete: (record: MedicalRecord) => void
}

function MedicalRecordCard({ record, onView, onEdit, onDelete }: MedicalRecordCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            {/* Icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            
            {/* Record Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {record.title}
                </h3>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full w-fit">
                  {record.record_type}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="truncate">
                    {record.patient?.first_name} {record.patient?.last_name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(record.created_at), 'dd/MM/yyyy', { locale: es })}
                  </span>
                </div>
                {record.doctor && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="truncate">
                      Dr. {record.doctor.first_name} {record.doctor.last_name}
                    </span>
                  </div>
                )}
                {record.diagnosis && (
                  <div className="truncate">
                    <span className="font-medium">Diagnóstico:</span> {record.diagnosis}
                  </div>
                )}
              </div>
              
              {record.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {record.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-end sm:justify-start space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onView(record)
              }}
              className="p-2"
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(record)
              }}
              className="p-2"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(record)
              }}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MedicalRecordsPage() {
  const { canViewMedicalRecords } = useAuth()
  const { records, loading, error, createRecord, updateRecord, deleteRecord } = useMedicalRecords()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Filter records based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecords(records)
      return
    }

    const filtered = records.filter(record => 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patient?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patient?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patient?.patient_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.record_type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    setFilteredRecords(filtered)
  }, [records, searchQuery])

  const handleDeleteRecord = async (record: MedicalRecord) => {
    if (!window.confirm(`¿Está seguro que desea eliminar el historial "${record.title}"?`)) {
      return
    }

    try {
      await deleteRecord(record.id)
    } catch (error) {
      console.error('Error deleting record:', error)
    }
  }

  const handleCreateRecord = async (data: any) => {
    try {
      setFormLoading(true)
      await createRecord(data)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating record:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateRecord = async (data: any) => {
    if (!selectedRecord) return

    try {
      setFormLoading(true)
      await updateRecord(selectedRecord.id, data)
      setShowEditModal(false)
      setSelectedRecord(null)
    } catch (error) {
      console.error('Error updating record:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  if (!canViewMedicalRecords) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Acceso Restringido</h2>
        <p className="text-gray-600 dark:text-gray-400">No tienes permisos para ver historiales médicos</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Historiales Médicos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los historiales médicos de los pacientes
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Nuevo Historial</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Historiales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{records.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Esta Semana</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {records.filter(r => {
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return new Date(r.created_at) >= weekAgo
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pacientes Únicos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(records.map(r => r.patient_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipos Diferentes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(records.map(r => r.record_type)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar historiales por título, paciente, diagnóstico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" className="mr-4" />
            <span className="text-gray-600 dark:text-gray-400">Cargando historiales...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No se encontraron historiales' : 'No hay historiales médicos'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza creando el primer historial médico'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Historial
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.map((record) => (
              <MedicalRecordCard
                key={record.id}
                record={record}
                onView={(record) => {
                  setSelectedRecord(record)
                  setShowViewModal(true)
                }}
                onEdit={(record) => {
                  setSelectedRecord(record)
                  setShowEditModal(true)
                }}
                onDelete={handleDeleteRecord}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <MedicalRecordForm
          onSubmit={handleCreateRecord}
          onClose={() => setShowCreateModal(false)}
          loading={formLoading}
        />
      )}

      {showEditModal && selectedRecord && (
        <MedicalRecordForm
          record={selectedRecord}
          onSubmit={handleUpdateRecord}
          onClose={() => {
            setShowEditModal(false)
            setSelectedRecord(null)
          }}
          loading={formLoading}
        />
      )}
    </div>
  )
}
