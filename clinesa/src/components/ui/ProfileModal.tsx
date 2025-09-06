import React, { useState } from 'react'
import { X, User, Mail, Phone, Shield, Edit, Save, X as Cancel } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Input } from './Input'
import { Select } from './Select'
import { useAuth } from '@/hooks/useAuth'
import { useConfig } from '@/hooks/useConfig'
import { cn } from '@/lib/utils'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { userProfile, fullName, initials } = useAuth()
  const { config, updateConfig } = useConfig()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    firstName: config.firstName,
    lastName: config.lastName,
    email: config.email,
    phone: config.phone,
    specialization: config.specialization,
  })

  const handleSave = () => {
    // Update config
    Object.entries(editData).forEach(([key, value]) => {
      updateConfig(key as keyof typeof config, value)
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      firstName: config.firstName,
      lastName: config.lastName,
      email: config.email,
      phone: config.phone,
      specialization: config.specialization,
    })
    setIsEditing(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-medical-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Perfil de Usuario
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-96">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-16 h-16 bg-medical-100 dark:bg-medical-900 rounded-full">
              <span className="text-2xl font-medium text-medical-600 dark:text-medical-400">
                {initials}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {fullName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {userProfile?.role}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre
                </label>
                {isEditing ? (
                  <Input
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    className="w-full"
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-white py-2">
                    {config.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apellidos
                </label>
                {isEditing ? (
                  <Input
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    className="w-full"
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-white py-2">
                    {config.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-gray-900 dark:text-white py-2">
                  {config.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              {isEditing ? (
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-gray-900 dark:text-white py-2">
                  {config.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Especialización
              </label>
              {isEditing ? (
                <Input
                  value={editData.specialization}
                  onChange={(e) => setEditData({ ...editData, specialization: e.target.value })}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-gray-900 dark:text-white py-2">
                  {config.specialization}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rol
              </label>
              <div className="flex items-center space-x-2 py-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white capitalize">
                  {userProfile?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex-1"
              >
                <Cancel className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
