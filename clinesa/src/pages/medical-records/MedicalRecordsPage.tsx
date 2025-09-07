import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, FileText, Calendar, User, Eye, Edit, Trash2, Download, SortAsc, SortDesc } from 'lucide-react'
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
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="notion-card hover:shadow-notion-md transition-all duration-200 cursor-pointer group">
        <CardContent className="p-6">
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
    </motion.div>
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
  
  // Advanced features
  const [sortBy, setSortBy] = useState<'date' | 'patient' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [typeFilter, setTypeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort records
  useEffect(() => {
    let filtered = [...records]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(record => 
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patient?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patient?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patient?.patient_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.record_type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(record => record.record_type === typeFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'patient':
          comparison = `${a.patient?.first_name} ${a.patient?.last_name}`.localeCompare(`${b.patient?.first_name} ${b.patient?.last_name}`)
          break
        case 'type':
          comparison = a.record_type.localeCompare(b.record_type)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    setFilteredRecords(filtered)
  }, [records, searchQuery, typeFilter, sortBy, sortOrder])

  // Export records to CSV
  const exportToCSV = () => {
    const headers = ['Título', 'Paciente', 'Tipo', 'Diagnóstico', 'Doctor', 'Fecha', 'Descripción']
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => [
        record.title,
        `${record.patient?.first_name} ${record.patient?.last_name}`,
        record.record_type,
        record.diagnosis || '',
        record.doctor ? `Dr. ${record.doctor.first_name} ${record.doctor.last_name}` : '',
        format(new Date(record.created_at), 'dd/MM/yyyy'),
        record.description || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `historiales_medicos_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Historiales médicos exportados correctamente')
  }

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
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-xl font-normal text-primary-1000 dark:text-primary-0">Historiales Médicos</h1>
          <p className="text-primary-600 dark:text-primary-400 mt-1">
            Gestiona los historiales médicos de los pacientes
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Nuevo Historial</span>
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Total Historiales</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{records.length}</p>
            </div>
          </div>
        </div>

        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Esta Semana</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">
                {records.filter(r => {
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return new Date(r.created_at) >= weekAgo
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Pacientes Únicos</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">
                {new Set(records.map(r => r.patient_id)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded">
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Tipos Diferentes</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">
                {new Set(records.map(r => r.record_type)).size}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="notion-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar historiales por título, paciente, diagnóstico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="notion-input pl-10 w-80"
              />
            </div>
            
            {/* Sort */}
            <div className="flex items-center space-x-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'patient' | 'type')}
                className="notion-input text-sm"
              >
                <option value="date">Fecha</option>
                <option value="patient">Paciente</option>
                <option value="type">Tipo</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
                title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
                  Tipo de Historial
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="notion-input"
                >
                  <option value="">Todos los tipos</option>
                  <option value="consulta">Consulta</option>
                  <option value="diagnostico">Diagnóstico</option>
                  <option value="tratamiento">Tratamiento</option>
                  <option value="seguimiento">Seguimiento</option>
                  <option value="emergencia">Emergencia</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setTypeFilter('')
                    setSortBy('date')
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
          <motion.div 
            className="grid grid-cols-1 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MedicalRecordCard
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
              </motion.div>
            ))}
          </motion.div>
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
