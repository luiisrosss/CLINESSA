import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Users, UserPlus, Shield, Eye, Edit, Trash2, Mail, Phone, Download, SortAsc, SortDesc } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { UserForm } from '@/components/forms/UserForm'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: string
  specialization?: string
  license_number?: string
  is_active: boolean
  created_at: string
  updated_at: string
  organization_id: string
}

interface UserCardProps {
  user: User
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onToggleStatus: (user: User) => void
}

function UserCard({ user, onView, onEdit, onDelete, onToggleStatus }: UserCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      case 'doctor':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
      case 'nurse':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      case 'receptionist':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'doctor':
        return 'Médico'
      case 'nurse':
        return 'Enfermero/a'
      case 'receptionist':
        return 'Recepcionista'
      default:
        return role
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="notion-card hover:shadow-notion-md transition-all duration-200 cursor-pointer group">
        <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-medical-100 dark:bg-medical-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-medical-600 dark:text-medical-400 font-medium text-sm">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {user.first_name} {user.last_name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full w-fit ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                  user.is_active 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span className="truncate">{user.phone}</span>
                  </div>
                )}
                {user.specialization && (
                  <div className="truncate">
                    <span className="font-medium">Especialización:</span> {user.specialization}
                  </div>
                )}
                {user.license_number && (
                  <div className="truncate">
                    <span className="font-medium">Licencia:</span> {user.license_number}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Registrado: {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: es })}
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
                onView(user)
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
                onEdit(user)
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
                onToggleStatus(user)
              }}
              className={`p-2 ${
                user.is_active 
                  ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900'
                  : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900'
              }`}
              title={user.is_active ? 'Desactivar' : 'Activar'}
            >
              <Shield className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(user)
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

export function UsersPage() {
  const { organization, canManageUsers } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  
  // Advanced features
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch users
  useEffect(() => {
    if (organization && canManageUsers) {
      fetchUsers()
    }
  }, [organization, canManageUsers])

  const fetchUsers = async () => {
    if (!supabase || !organization) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(user => 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.license_number?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter) {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(user => user.is_active === isActive)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
          break
        case 'role':
          comparison = a.role.localeCompare(b.role)
          break
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    setFilteredUsers(filtered)
  }, [users, searchQuery, roleFilter, statusFilter, sortBy, sortOrder])

  // Export users to CSV
  const exportToCSV = () => {
    const headers = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Rol', 'Especialización', 'Licencia', 'Estado', 'Fecha de Registro']
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.first_name,
        user.last_name,
        user.email,
        user.phone || '',
        user.role,
        user.specialization || '',
        user.license_number || '',
        user.is_active ? 'Activo' : 'Inactivo',
        format(new Date(user.created_at), 'dd/MM/yyyy')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `profesionales_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Lista de profesionales exportada correctamente')
  }

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`¿Está seguro que desea eliminar al usuario ${user.first_name} ${user.last_name}?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id)

      if (error) throw error

      setUsers(prev => prev.filter(u => u.id !== user.id))
      toast.success('Usuario eliminado correctamente')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error al eliminar el usuario')
    }
  }

  const handleToggleStatus = async (user: User) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !user.is_active })
        .eq('id', user.id)

      if (error) throw error

      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, is_active: !u.is_active } : u
      ))
      toast.success(`Usuario ${!user.is_active ? 'activado' : 'desactivado'} correctamente`)
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error('Error al cambiar el estado del usuario')
    }
  }

  const handleCreateUser = async (data: any) => {
    try {
      setFormLoading(true)
      
      const { data: userData, error } = await supabase
        .from('users')
        .insert([{
          ...data,
          organization_id: organization?.id
        }])
        .select()
        .single()

      if (error) throw error

      setUsers(prev => [userData, ...prev])
      setShowCreateModal(false)
      toast.success('Usuario creado correctamente')
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Error al crear el usuario')
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateUser = async (data: any) => {
    if (!selectedUser) return

    try {
      setFormLoading(true)
      
      const { data: userData, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', selectedUser.id)
        .select()
        .single()

      if (error) throw error

      setUsers(prev => prev.map(u => u.id === selectedUser.id ? userData : u))
      setShowEditModal(false)
      setSelectedUser(null)
      toast.success('Usuario actualizado correctamente')
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Error al actualizar el usuario')
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  if (!canManageUsers) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Acceso Restringido</h2>
        <p className="text-gray-600 dark:text-gray-400">No tienes permisos para gestionar usuarios</p>
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
          <h1 className="text-xl font-normal text-primary-1000 dark:text-primary-0">Gestión de Profesionales</h1>
          <p className="text-primary-600 dark:text-primary-400 mt-1">
            Administra los profesionales y usuarios del sistema
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Nuevo Profesional</span>
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
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Total Usuarios</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Activos</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">
                {users.filter(u => u.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded">
              <UserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Médicos</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">
                {users.filter(u => u.role === 'doctor').length}
              </p>
            </div>
          </div>
        </div>

        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded">
              <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Enfermeros</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">
                {users.filter(u => u.role === 'nurse').length}
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
                placeholder="Buscar profesionales por nombre, email, especialización..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="notion-input pl-10 w-80"
              />
            </div>
            
            {/* Sort */}
            <div className="flex items-center space-x-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'role' | 'date')}
                className="notion-input text-sm"
              >
                <option value="date">Fecha</option>
                <option value="name">Nombre</option>
                <option value="role">Rol</option>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Rol
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="notion-input"
                >
                  <option value="">Todos los roles</option>
                  <option value="admin">Administrador</option>
                  <option value="doctor">Médico</option>
                  <option value="nurse">Enfermero/a</option>
                  <option value="receptionist">Recepcionista</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="notion-input"
                >
                  <option value="">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setRoleFilter('')
                    setStatusFilter('')
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

      {/* Users List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" className="mr-4" />
            <span className="text-gray-600 dark:text-gray-400">Cargando profesionales...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No se encontraron profesionales' : 'No hay profesionales registrados'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza agregando el primer profesional'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Profesional
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
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <UserCard
                  user={user}
                  onView={(user) => {
                    setSelectedUser(user)
                    setShowViewModal(true)
                  }}
                  onEdit={(user) => {
                    setSelectedUser(user)
                    setShowEditModal(true)
                  }}
                  onDelete={handleDeleteUser}
                  onToggleStatus={handleToggleStatus}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <UserForm
          onSubmit={handleCreateUser}
          onClose={() => setShowCreateModal(false)}
          loading={formLoading}
        />
      )}

      {showEditModal && selectedUser && (
        <UserForm
          user={selectedUser}
          onSubmit={handleUpdateUser}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          loading={formLoading}
        />
      )}
    </div>
  )
}
