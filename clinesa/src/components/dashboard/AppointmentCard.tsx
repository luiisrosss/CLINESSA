import { format } from 'date-fns';
import { Clock, User, Phone, Mail, Edit, Trash2, Check, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/hooks/useAppointments';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: Appointment['status']) => void;
  showActions?: boolean;
}

export function AppointmentCard({ 
  appointment, 
  onEdit, 
  onDelete, 
  onStatusChange,
  showActions = true 
}: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'no_show': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusActions = (currentStatus: string) => {
    const actions = [];
    
    switch (currentStatus) {
      case 'scheduled':
        actions.push(
          { label: 'Confirm', status: 'confirmed', icon: Check, color: 'text-green-600' },
          { label: 'Cancel', status: 'cancelled', icon: X, color: 'text-red-600' }
        );
        break;
      case 'confirmed':
        actions.push(
          { label: 'Complete', status: 'completed', icon: Check, color: 'text-gray-600' },
          { label: 'No Show', status: 'no_show', icon: X, color: 'text-orange-600' },
          { label: 'Cancel', status: 'cancelled', icon: X, color: 'text-red-600' }
        );
        break;
      case 'completed':
      case 'cancelled':
      case 'no_show':
        // No status change actions for final states
        break;
    }
    
    return actions;
  };

  const appointmentDate = new Date(appointment.appointment_date);
  const statusActions = onStatusChange ? getStatusActions(appointment.status) : [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {appointment.title}
              </h3>
              <div className={cn(
                'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border capitalize',
                getStatusColor(appointment.status)
              )}>
                {appointment.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium">
                {appointment.patient?.first_name} {appointment.patient?.last_name}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                ({appointment.patient?.patient_number})
              </span>
            </div>
            {appointment.patient?.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1 text-gray-400" />
                <span>{appointment.patient.phone}</span>
              </div>
            )}
            {appointment.patient?.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1 text-gray-400" />
                <span>{appointment.patient.email}</span>
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>{format(appointmentDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {format(appointmentDate, 'HH:mm')} ({appointment.duration} min)
              </span>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Doctor:</span> Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
            {appointment.doctor?.specialization && (
              <span className="ml-2 text-gray-500">({appointment.doctor.specialization})</span>
            )}
          </div>

          {/* Reason for Visit */}
          {appointment.reason_for_visit && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Reason:</span> {appointment.reason_for_visit}
            </div>
          )}

          {/* Description */}
          {appointment.description && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Notes:</span> {appointment.description}
            </div>
          )}

          {/* Follow-up */}
          {appointment.follow_up_required && (
            <div className="flex items-center text-sm text-orange-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Follow-up required</span>
              {appointment.follow_up_date && (
                <span className="ml-2">
                  ({format(new Date(appointment.follow_up_date), 'MMM d, yyyy')})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center space-x-2 ml-4">
            {/* Status Change Actions */}
            {statusActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.status}
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange?.(action.status as Appointment['status'])}
                  className={cn('p-2', action.color)}
                  title={action.label}
                >
                  <IconComponent className="w-4 h-4" />
                </Button>
              );
            })}

            {/* Edit Button */}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="p-2 text-gray-600 hover:text-blue-600"
                title="Edit appointment"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}

            {/* Delete Button */}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="p-2 text-gray-600 hover:text-red-600"
                title="Delete appointment"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}