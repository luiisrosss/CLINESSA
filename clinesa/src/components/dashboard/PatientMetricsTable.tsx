import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  User,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface PatientMetric {
  id: string
  name: string
  avatar?: string
  lastVisit: Date
  totalVisits: number
  nextAppointment?: Date
  status: 'active' | 'inactive' | 'at_risk'
  priority: 'low' | 'medium' | 'high'
  healthScore: number
  age: number
  gender: 'male' | 'female' | 'other'
  conditions: string[]
  lastDiagnosis?: string
  treatmentProgress: number
  riskFactors: string[]
}

interface PatientMetricsTableProps {
  patients: PatientMetric[]
  loading?: boolean
  onPatientClick?: (patient: PatientMetric) => void
  onViewDetails?: (patient: PatientMetric) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return '#10b981' // green
    case 'inactive':
      return '#6b7280' // gray
    case 'at_risk':
      return '#f59e0b' // yellow
    default:
      return '#6b7280'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return '#ef4444' // red
    case 'medium':
      return '#f59e0b' // yellow
    case 'low':
      return '#10b981' // green
    default:
      return '#6b7280'
  }
}

const getHealthScoreColor = (score: number) => {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function PatientMetricsTable({ 
  patients, 
  loading = false, 
  onPatientClick,
  onViewDetails 
}: PatientMetricsTableProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (loading) {
    return (
      <motion.div {...fadeInUp}>
        <Paper className="p-6">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Box textAlign="center">
              <LinearProgress sx={{ width: 200, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Cargando métricas de pacientes...
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    )
  }

  return (
    <motion.div {...fadeInUp}>
      <Paper className="overflow-hidden">
        <Box p={3} borderBottom="1px solid" borderColor="divider">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Métricas de Pacientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resumen de salud y actividad de {patients.length} pacientes
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Tooltip title="Exportar datos">
                <IconButton size="small">
                  <Activity className="w-4 h-4" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Paciente</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Prioridad</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Puntuación de Salud</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Última Visita</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Próxima Cita</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Progreso</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient, index) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => onPatientClick?.(patient)}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={patient.avatar}
                        sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: getHealthScoreColor(patient.healthScore),
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {patient.avatar ? null : getInitials(patient.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {patient.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.age} años • {patient.gender === 'male' ? 'Hombre' : patient.gender === 'female' ? 'Mujer' : 'Otro'}
                        </Typography>
                        {patient.conditions.length > 0 && (
                          <Box display="flex" gap={0.5} mt={0.5}>
                            {patient.conditions.slice(0, 2).map((condition, idx) => (
                              <Chip
                                key={idx}
                                label={condition}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  fontSize: '0.65rem',
                                  height: 20,
                                  '& .MuiChip-label': { px: 1 }
                                }}
                              />
                            ))}
                            {patient.conditions.length > 2 && (
                              <Chip
                                label={`+${patient.conditions.length - 2}`}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  fontSize: '0.65rem',
                                  height: 20,
                                  '& .MuiChip-label': { px: 1 }
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={patient.status === 'active' ? 'Activo' : patient.status === 'inactive' ? 'Inactivo' : 'En Riesgo'}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(patient.status),
                        color: 'white',
                        fontWeight: 500,
                        '& .MuiChip-label': { px: 1.5 }
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      {patient.priority === 'high' ? (
                        <AlertCircle className="w-4 h-4" style={{ color: getPriorityColor(patient.priority) }} />
                      ) : patient.priority === 'medium' ? (
                        <Clock className="w-4 h-4" style={{ color: getPriorityColor(patient.priority) }} />
                      ) : (
                        <CheckCircle className="w-4 h-4" style={{ color: getPriorityColor(patient.priority) }} />
                      )}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: getPriorityColor(patient.priority),
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        {patient.priority === 'high' ? 'Alta' : patient.priority === 'medium' ? 'Media' : 'Baja'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: getHealthScoreColor(patient.healthScore),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        {patient.healthScore}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          /100
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          {patient.healthScore >= 80 ? (
                            <TrendingUp className="w-3 h-3" style={{ color: '#10b981' }} />
                          ) : patient.healthScore >= 60 ? (
                            <TrendingUp className="w-3 h-3" style={{ color: '#f59e0b' }} />
                          ) : (
                            <TrendingDown className="w-3 h-3" style={{ color: '#ef4444' }} />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="500">
                      {format(patient.lastVisit, 'dd/MM/yyyy', { locale: es })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {patient.totalVisits} visitas
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {patient.nextAppointment ? (
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {format(patient.nextAppointment, 'dd/MM/yyyy', { locale: es })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(patient.nextAppointment, 'HH:mm', { locale: es })}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin cita
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ width: 80 }}>
                      <LinearProgress
                        variant="determinate"
                        value={patient.treatmentProgress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getHealthScoreColor(patient.treatmentProgress),
                            borderRadius: 3
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {patient.treatmentProgress}%
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box display="flex" gap={0.5}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            onViewDetails?.(patient)
                          }}
                        >
                          <User className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver historial">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Navigate to patient history
                          }}
                        >
                          <Calendar className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {patients.length === 0 && (
          <Box p={6} textAlign="center">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay pacientes registrados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los pacientes aparecerán aquí una vez que se registren en el sistema
            </Typography>
          </Box>
        )}
      </Paper>
    </motion.div>
  )
}

// Datos de ejemplo para desarrollo
export const mockPatientMetrics: PatientMetric[] = [
  {
    id: '1',
    name: 'María González',
    lastVisit: new Date('2024-01-15'),
    totalVisits: 12,
    nextAppointment: new Date('2024-01-25'),
    status: 'active',
    priority: 'medium',
    healthScore: 85,
    age: 45,
    gender: 'female',
    conditions: ['Hipertensión', 'Diabetes'],
    lastDiagnosis: 'Control rutinario',
    treatmentProgress: 75,
    riskFactors: ['Obesidad', 'Familiar diabético']
  },
  {
    id: '2',
    name: 'Juan Pérez',
    lastVisit: new Date('2024-01-10'),
    totalVisits: 8,
    nextAppointment: new Date('2024-01-20'),
    status: 'at_risk',
    priority: 'high',
    healthScore: 45,
    age: 62,
    gender: 'male',
    conditions: ['Cardiopatía', 'Hipertensión'],
    lastDiagnosis: 'Seguimiento cardiológico',
    treatmentProgress: 30,
    riskFactors: ['Fumador', 'Sedentario']
  },
  {
    id: '3',
    name: 'Ana Martínez',
    lastVisit: new Date('2024-01-12'),
    totalVisits: 5,
    nextAppointment: undefined,
    status: 'active',
    priority: 'low',
    healthScore: 92,
    age: 28,
    gender: 'female',
    conditions: [],
    lastDiagnosis: 'Revisión anual',
    treatmentProgress: 95,
    riskFactors: []
  },
  {
    id: '4',
    name: 'Carlos Rodríguez',
    lastVisit: new Date('2023-12-20'),
    totalVisits: 15,
    nextAppointment: new Date('2024-01-30'),
    status: 'inactive',
    priority: 'medium',
    healthScore: 68,
    age: 55,
    gender: 'male',
    conditions: ['Artritis'],
    lastDiagnosis: 'Control de dolor',
    treatmentProgress: 60,
    riskFactors: ['Sobrepeso']
  },
  {
    id: '5',
    name: 'Laura Sánchez',
    lastVisit: new Date('2024-01-08'),
    totalVisits: 3,
    nextAppointment: new Date('2024-01-22'),
    status: 'active',
    priority: 'low',
    healthScore: 88,
    age: 35,
    gender: 'female',
    conditions: ['Migrañas'],
    lastDiagnosis: 'Seguimiento neurológico',
    treatmentProgress: 80,
    riskFactors: ['Estrés laboral']
  }
]
