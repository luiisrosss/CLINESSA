import { X, AlertTriangle, Heart, Phone, Mail, MapPin, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDate, calculateAge, getInitials } from '@/lib/utils'
import type { Patient } from '@/types/database.types'

interface PatientDetailModalProps {
  patient: Patient
  onClose: () => void
  onEdit: () => void
}

export function PatientDetailModal({ patient, onClose, onEdit }: PatientDetailModalProps) {
  const age = calculateAge(patient.birth_date)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center">
                <span className="text-medical-600 font-medium text-lg">
                  {getInitials(`${patient.first_name} ${patient.last_name}`)}
                </span>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {patient.first_name} {patient.last_name}
                </CardTitle>
                <p className="text-gray-600">
                  {patient.patient_number} • {age} años • {
                    patient.gender === 'male' ? 'Masculino' : 
                    patient.gender === 'female' ? 'Femenino' : 'Otro'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={onEdit}>
                Editar Paciente
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">DNI</p>
                      <p className="text-gray-900">{patient.dni || 'No registrado'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
                      <p className="text-gray-900">{formatDate(patient.birth_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipo de Sangre</p>
                      <p className="text-gray-900">{patient.blood_type || 'No registrado'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Registrado</p>
                      <p className="text-gray-900">{formatDate(patient.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      <p className="text-gray-900">{patient.phone || 'No registrado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{patient.email || 'No registrado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dirección</p>
                      <p className="text-gray-900">
                        {patient.address ? (
                          <>
                            {patient.address}
                            {patient.city && <><br />{patient.city}</>}
                            {patient.postal_code && <> ({patient.postal_code})</>}
                          </>
                        ) : (
                          'No registrada'
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              {patient.insurance_provider && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Seguro Médico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Proveedor</p>
                        <p className="text-gray-900">{patient.insurance_provider}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Número</p>
                        <p className="text-gray-900">{patient.insurance_number || 'No registrado'}</p>
                      </div>
                      {patient.insurance_expiry && (
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-gray-500">Vencimiento</p>
                          <p className="text-gray-900">{formatDate(patient.insurance_expiry)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Emergency Contact */}
              {patient.emergency_contact_name && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Contacto de Emergencia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nombre</p>
                        <p className="text-gray-900">{patient.emergency_contact_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Teléfono</p>
                        <p className="text-gray-900">{patient.emergency_contact_phone || 'No registrado'}</p>
                      </div>
                      {patient.emergency_contact_relationship && (
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-gray-500">Relación</p>
                          <p className="text-gray-900">{patient.emergency_contact_relationship}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Medical Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Información Médica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {patient.allergies && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                          Alergias
                        </p>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-800 text-sm">{patient.allergies}</p>
                        </div>
                      </div>
                    )}

                    {patient.chronic_conditions && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Condiciones Crónicas</p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-yellow-800 text-sm">{patient.chronic_conditions}</p>
                        </div>
                      </div>
                    )}

                    {patient.medications && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Medicamentos Actuales</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-blue-800 text-sm">{patient.medications}</p>
                        </div>
                      </div>
                    )}

                    {patient.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Notas Adicionales</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-gray-800 text-sm">{patient.notes}</p>
                        </div>
                      </div>
                    )}

                    {!patient.allergies && !patient.chronic_conditions && !patient.medications && !patient.notes && (
                      <div className="md:col-span-2">
                        <p className="text-gray-500 text-center py-8">
                          No hay información médica adicional registrada
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}