import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export interface Appointment {
  id: string;
  organization_id: string;
  patient_id: string;
  doctor_id: string;
  title: string;
  description?: string;
  appointment_date: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  reason_for_visit?: string;
  notes?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    patient_number: string;
    phone?: string;
    email?: string;
  };
  doctor?: {
    id: string;
    first_name: string;
    last_name: string;
    specialization?: string;
  };
}

export interface CreateAppointmentData {
  patient_id: string;
  doctor_id: string;
  title: string;
  description?: string;
  appointment_date: string;
  duration?: number;
  reason_for_visit?: string;
  notes?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
}

export function useAppointments() {
  const { user, organization } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (filters?: {
    date?: string;
    doctor_id?: string;
    patient_id?: string;
    status?: string;
  }) => {
    if (!organization) {
      setError('No organization found');
      return;
    }

    if (!supabase) {
      setError('Configuración de Supabase no válida');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(id, first_name, last_name, patient_number, phone, email),
          doctor:users!appointments_doctor_id_fkey(id, first_name, last_name, specialization)
        `)
        .eq('organization_id', organization.id)
        .order('appointment_date', { ascending: true });

      if (filters?.date) {
        const startOfDay = new Date(filters.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filters.date);
        endOfDay.setHours(23, 59, 59, 999);
        
        query = query
          .gte('appointment_date', startOfDay.toISOString())
          .lte('appointment_date', endOfDay.toISOString());
      }

      if (filters?.doctor_id) {
        query = query.eq('doctor_id', filters.doctor_id);
      }

      if (filters?.patient_id) {
        query = query.eq('patient_id', filters.patient_id);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Error loading appointments');
      toast.error('Error loading appointments');
    } finally {
      setLoading(false);
    }
  }, [organization]);

  const createAppointment = async (appointmentData: CreateAppointmentData) => {
    if (!organization || !user) {
      throw new Error('No organization or user found');
    }
    
    if (!supabase) {
      throw new Error('Configuración de Supabase no válida');
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          ...appointmentData,
          organization_id: organization.id,
          created_by: user.id,
          status: 'scheduled' as const,
          duration: appointmentData.duration || 30,
          follow_up_required: appointmentData.follow_up_required || false,
        } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .select(`
          *,
          patient:patients(id, first_name, last_name, patient_number, phone, email),
          doctor:users!appointments_doctor_id_fkey(id, first_name, last_name, specialization)
        `)
        .single();

      if (error) throw error;

      setAppointments(prev => [...prev, data]);
      toast.success('Appointment created successfully');
      return data;
    } catch (err) {
      console.error('Error creating appointment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error creating appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: string, updates: Partial<CreateAppointmentData>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          patient:patients(id, first_name, last_name, patient_number, phone, email),
          doctor:users!appointments_doctor_id_fkey(id, first_name, last_name, specialization)
        `)
        .single();

      if (error) throw error;

      setAppointments(prev =>
        prev.map(appointment => (appointment.id === id ? data : appointment))
      );
      toast.success('Appointment updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating appointment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error updating appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!supabase) {
      throw new Error('Configuración de Supabase no válida');
    }
    
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      toast.success('Appointment deleted successfully');
    } catch (err) {
      console.error('Error deleting appointment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error deleting appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select(`
          *,
          patient:patients(id, first_name, last_name, patient_number, phone, email),
          doctor:users!appointments_doctor_id_fkey(id, first_name, last_name, specialization)
        `)
        .single();

      if (error) throw error;

      setAppointments(prev =>
        prev.map(appointment => (appointment.id === id ? data : appointment))
      );
      toast.success(`Appointment ${status}`);
      return data;
    } catch (err) {
      console.error('Error updating appointment status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error updating appointment status';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments on mount
  useEffect(() => {
    if (organization) {
      fetchAppointments();
    }
  }, [organization, fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
  };
}