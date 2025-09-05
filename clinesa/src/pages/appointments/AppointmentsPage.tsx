import { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { Calendar, Plus, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { useAppointments, type Appointment, type CreateAppointmentData } from '@/hooks/useAppointments';
import { cn } from '@/lib/utils';

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
    if (confirm('Are you sure you want to delete this appointment?')) {
      await deleteAppointment(id);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage and schedule patient appointments</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'day', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors',
                  viewMode === mode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Navigation */}
          {viewMode !== 'list' && (
            <div className="flex items-center gap-2 ml-4">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[200px] text-center">
                {viewMode === 'week' 
                  ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
                  : format(currentDate, 'MMMM d, yyyy')
                }
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </Select>
          <Select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="w-48"
          >
            <option value="">All Doctors</option>
            {uniqueDoctors.map((doctor) => (
              <option key={doctor?.id} value={doctor?.id}>
                Dr. {doctor?.first_name} {doctor?.last_name}
              </option>
            ))}
          </Select>
        </div>
      </div>

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