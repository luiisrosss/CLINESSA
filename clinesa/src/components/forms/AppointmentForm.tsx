import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { usePatients } from '@/hooks/usePatients';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { Appointment, CreateAppointmentData } from '@/hooks/useAppointments';

const appointmentSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  appointment_date: z.string().min(1, 'Appointment date is required'),
  appointment_time: z.string().min(1, 'Appointment time is required'),
  duration: z.number().min(15).max(240),
  reason_for_visit: z.string().optional(),
  notes: z.string().optional(),
  follow_up_required: z.boolean(),
  follow_up_date: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  appointment?: Appointment;
  onSubmit: (data: CreateAppointmentData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function AppointmentForm({ appointment, onSubmit, onCancel, loading }: AppointmentFormProps) {
  const { patients, fetchPatients } = usePatients();
  const { organization } = useAuth();
  const [doctors, setDoctors] = useState<Array<{ id: string; first_name: string; last_name: string; specialization?: string }>>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      duration: 30,
      follow_up_required: false,
    },
  });

  // Watch follow_up_required to conditionally show follow_up_date
  const followUpRequired = watch('follow_up_required');

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!organization) return;

      if (!supabase) {
        console.error('Configuración de Supabase no válida');
        return;
      }

      try {
        setLoadingDoctors(true);
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, specialization')
          .eq('organization_id', organization.id)
          .in('role', ['doctor', 'admin'])
          .eq('is_active', true)
          .order('first_name');

        if (error) throw error;
        setDoctors(data || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [organization]);

  // Fetch patients
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Populate form when editing
  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.appointment_date);
      const dateStr = format(appointmentDate, 'yyyy-MM-dd');
      const timeStr = format(appointmentDate, 'HH:mm');

      reset({
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        title: appointment.title,
        description: appointment.description || '',
        appointment_date: dateStr,
        appointment_time: timeStr,
        duration: appointment.duration,
        reason_for_visit: appointment.reason_for_visit || '',
        notes: appointment.notes || '',
        follow_up_required: appointment.follow_up_required,
        follow_up_date: appointment.follow_up_date || '',
      });
    }
  }, [appointment, reset]);

  const handleFormSubmit = async (data: AppointmentFormData) => {
    try {
      // Combine date and time into a single datetime string
      const appointmentDateTime = new Date(`${data.appointment_date}T${data.appointment_time}`);
      
      const submitData: CreateAppointmentData = {
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        title: data.title,
        description: data.description,
        appointment_date: appointmentDateTime.toISOString(),
        duration: data.duration,
        reason_for_visit: data.reason_for_visit,
        notes: data.notes,
        follow_up_required: data.follow_up_required,
        follow_up_date: data.follow_up_date && data.follow_up_required ? data.follow_up_date : undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Patient Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Patient *
        </label>
        <Select
          {...register('patient_id')}
          error={errors.patient_id?.message}
        >
          <option value="">Select a patient</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>
              {patient.patient_number} - {patient.first_name} {patient.last_name}
            </option>
          ))}
        </Select>
      </div>

      {/* Doctor Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Doctor *
        </label>
        <Select
          {...register('doctor_id')}
          error={errors.doctor_id?.message}
          disabled={loadingDoctors}
        >
          <option value="">Select a doctor</option>
          {doctors.map(doctor => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.first_name} {doctor.last_name}
              {doctor.specialization && ` - ${doctor.specialization}`}
            </option>
          ))}
        </Select>
        {loadingDoctors && <LoadingSpinner className="mt-1" />}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Appointment Title *
        </label>
        <Input
          {...register('title')}
          placeholder="e.g., Regular Checkup - John Doe"
          error={errors.title?.message}
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <Input
            {...register('appointment_date')}
            type="date"
            min={format(new Date(), 'yyyy-MM-dd')}
            error={errors.appointment_date?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time *
          </label>
          <Input
            {...register('appointment_time')}
            type="time"
            error={errors.appointment_time?.message}
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duration (minutes)
        </label>
        <Select
          {...register('duration', { valueAsNumber: true })}
          error={errors.duration?.message}
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </Select>
      </div>

      {/* Reason for Visit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Visit
        </label>
        <Input
          {...register('reason_for_visit')}
          placeholder="e.g., Annual checkup, Follow-up visit"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          {...register('description')}
          placeholder="Additional details about the appointment..."
          rows={3}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Internal Notes
        </label>
        <Textarea
          {...register('notes')}
          placeholder="Internal notes (not visible to patient)..."
          rows={2}
        />
      </div>

      {/* Follow-up Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            {...register('follow_up_required')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Follow-up required
          </label>
        </div>

        {followUpRequired && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Date
            </label>
            <Input
              {...register('follow_up_date')}
              type="date"
              min={format(new Date(), 'yyyy-MM-dd')}
              error={errors.follow_up_date?.message}
            />
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading && <LoadingSpinner className="mr-2" />}
          {appointment ? 'Update Appointment' : 'Create Appointment'}
        </Button>
      </div>
    </form>
  );
}