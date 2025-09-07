import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { Calendar, Plus, ChevronLeft, ChevronRight, Search, Filter, Download, Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { useAppointments, type Appointment, type CreateAppointmentData } from '@/hooks/useAppointments';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type ViewMode = 'week' | 'day' | 'list';

export function AppointmentsPage() {
  const { appointments, loading, createAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus } = useAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'patient' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter appointments based on current view and filters
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = !searchTerm || 
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.patient_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    const matchesDoctor = !doctorFilter || appointment.doctor_id === doctorFilter;

    // Date filtering based on view mode
    if (viewMode === 'week') {
      const appointmentDate = new Date(appointment.appointment_date);
      return appointmentDate >= weekStart && appointmentDate <= weekEnd && matchesSearch && matchesStatus && matchesDoctor;
    } else if (viewMode === 'day') {
      return isSameDay(new Date(appointment.appointment_date), currentDate) && matchesSearch && matchesStatus && matchesDoctor;
    }
    
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  // Get unique doctors for filter
  const uniqueDoctors = Array.from(
    new Map(appointments.map(apt => [apt.doctor_id, apt.doctor])).values()
  ).filter(Boolean);

  const handleCreateAppointment = async (data: CreateAppointmentData) => {
    await createAppointment(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdateAppointment = async (data: Partial<CreateAppointmentData>) => {
    if (selectedAppointment) {
      await updateAppointment(selectedAppointment.id, data);
      setIsEditModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (confirm('¿Está seguro que desea eliminar esta cita?')) {
      try {
        await deleteAppointment(id);
        toast.success('Cita eliminada correctamente');
      } catch (error) {
        toast.error('Error al eliminar la cita');
      }
    }
  };

  // Export appointments to CSV
  const exportToCSV = () => {
    const headers = ['Fecha', 'Hora', 'Paciente', 'Doctor', 'Estado', 'Tipo', 'Notas'];
    const csvContent = [
      headers.join(','),
      ...filteredAppointments.map(appointment => [
        format(new Date(appointment.appointment_date), 'dd/MM/yyyy'),
        format(new Date(appointment.appointment_date), 'HH:mm'),
        `${appointment.patient?.first_name} ${appointment.patient?.last_name}`,
        `${appointment.doctor?.first_name} ${appointment.doctor?.last_name}`,
        appointment.status,
        appointment.appointment_type || '',
        appointment.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `citas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Lista de citas exportada correctamente');
  };

  // Get appointment statistics
  const getAppointmentStats = () => {
    const today = new Date();
    const todayAppointments = appointments.filter(apt => 
      isSameDay(new Date(apt.appointment_date), today)
    );
    
    const thisWeekAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate >= weekStart && aptDate <= weekEnd;
    });

    const statusCounts = appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      today: todayAppointments.length,
      thisWeek: thisWeekAppointments.length,
      total: appointments.length,
      confirmed: statusCounts.confirmed || 0,
      pending: statusCounts.scheduled || 0,
      completed: statusCounts.completed || 0,
      cancelled: statusCounts.cancelled || 0
    };
  };

  const stats = getAppointmentStats();

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'next' ? addDays(prev, 1) : subDays(prev, 1));
  };

  const getAppointmentsForDay = (day: Date) => {
    return filteredAppointments.filter(appointment => 
      isSameDay(new Date(appointment.appointment_date), day)
    ).sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'no_show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner className="w-8 h-8" />
        <span className="ml-2">Loading appointments...</span>
      </div>
    );
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
          <h1 className="text-xl font-normal text-primary-1000 dark:text-primary-0">Gestión de Citas</h1>
          <p className="text-primary-600 dark:text-primary-400">Gestiona y programa citas de pacientes</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
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
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Hoy</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{stats.today}</p>
            </div>
          </div>
        </div>

        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Confirmadas</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{stats.confirmed}</p>
            </div>
          </div>
        </div>

        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Pendientes</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="notion-card p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded">
              <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Total</p>
              <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{stats.total}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="notion-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-primary-100 dark:bg-primary-900 rounded-lg p-1">
              {(['week', 'day', 'list'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors',
                    viewMode === mode
                      ? 'bg-white dark:bg-primary-1000 text-primary-1000 dark:text-primary-0 shadow-sm'
                      : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
                  )}
                >
                  {mode === 'week' ? 'Semana' : mode === 'day' ? 'Día' : 'Lista'}
                </button>
              ))}
            </div>

            {/* Navigation */}
            {viewMode !== 'list' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateDay('prev')}
                  className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium min-w-[200px] text-center text-primary-1000 dark:text-primary-0">
                  {viewMode === 'week' 
                    ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
                    : format(currentDate, 'MMMM d, yyyy')
                  }
                </span>
                <button
                  onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateDay('next')}
                  className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
                >
                  Hoy
                </button>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar citas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="notion-input pl-10 w-64"
              />
            </div>
            
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
                  Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="notion-input"
                >
                  <option value="">Todos los estados</option>
                  <option value="scheduled">Programada</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="no_show">No se presentó</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Doctor
                </label>
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="notion-input"
                >
                  <option value="">Todos los doctores</option>
                  {uniqueDoctors.map((doctor) => (
                    <option key={doctor?.id} value={doctor?.id}>
                      Dr. {doctor?.first_name} {doctor?.last_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('')
                    setDoctorFilter('')
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

      {/* Content */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-7 gap-0">
            {weekDays.map((day) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div key={day.toISOString()} className="min-h-[400px] border-r border-gray-200 last:border-r-0">
                  <div className={cn(
                    'p-3 border-b border-gray-200 text-center',
                    isToday ? 'bg-blue-50' : 'bg-gray-50'
                  )}>
                    <div className="font-medium text-sm text-gray-600">
                      {format(day, 'EEE')}
                    </div>
                    <div className={cn(
                      'text-lg font-semibold',
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    )}>
                      {format(day, 'd')}
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-blue-50 border border-blue-200 rounded p-2 cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <div className="text-xs font-medium text-blue-800">
                          {format(new Date(appointment.appointment_date), 'HH:mm')}
                        </div>
                        <div className="text-xs text-blue-700 truncate">
                          {appointment.patient?.first_name} {appointment.patient?.last_name}
                        </div>
                        <div className={cn(
                          'text-xs px-1 rounded mt-1 inline-block',
                          getStatusBadgeColor(appointment.status)
                        )}>
                          {appointment.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'day' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            <div className="space-y-3">
              {getAppointmentsForDay(currentDate).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onEdit={() => {
                    setSelectedAppointment(appointment);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => handleDeleteAppointment(appointment.id)}
                  onStatusChange={(status) => updateAppointmentStatus(appointment.id, status)}
                />
              ))}
              {getAppointmentsForDay(currentDate).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled for this day</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onEdit={() => {
                    setSelectedAppointment(appointment);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => handleDeleteAppointment(appointment.id)}
                  onStatusChange={(status) => updateAppointmentStatus(appointment.id, status)}
                />
              ))}
              {filteredAppointments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments found</p>
                  {(searchTerm || statusFilter || doctorFilter) && (
                    <p className="text-sm">Try adjusting your filters</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Appointment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="New Appointment"
        size="lg"
      >
        <AppointmentForm
          onSubmit={handleCreateAppointment}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAppointment(null);
        }}
        title="Edit Appointment"
        size="lg"
      >
        {selectedAppointment && (
          <AppointmentForm
            appointment={selectedAppointment}
            onSubmit={handleUpdateAppointment}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedAppointment(null);
            }}
            loading={loading}
          />
        )}
      </Modal>
    </div>
  );
}