import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Users, UserPlus, Shield, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react'
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
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardContent className="p-4 sm:p-6">
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

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
      return
    }

    const filtered = users.filter(user => 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.license_number?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    setFilteredUsers(filtered)
  }, [users, searchQuery])

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Gestión de Profesionales</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los profesionales y usuarios del sistema
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Nuevo Profesional</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <UserPlus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Médicos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'doctor').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enfermeros</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'nurse').length}
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
                placeholder="Buscar profesionales por nombre, email, especialización..."
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
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
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
            ))}
          </div>
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
