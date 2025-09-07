import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type User = Database['public']['Tables']['users']['Row']

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single()

      if (error) throw error

      setUsers(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating user:', err)
      throw err
    }
  }

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setUsers(prev => prev.map(user => user.id === id ? data : user))
      return data
    } catch (err) {
      console.error('Error updating user:', err)
      throw err
    }
  }

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (err) {
      console.error('Error deleting user:', err)
      throw err
    }
  }

  const toggleUserStatus = async (id: string) => {
    try {
      const user = users.find(u => u.id === id)
      if (!user) throw new Error('Usuario no encontrado')

      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      
      const { data, error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setUsers(prev => prev.map(user => user.id === id ? data : user))
      return data
    } catch (err) {
      console.error('Error toggling user status:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus
  }
}
