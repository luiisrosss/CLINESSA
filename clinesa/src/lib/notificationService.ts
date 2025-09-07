import { supabase } from './supabase'
import { Notification } from '@/hooks/useNotifications'

export class NotificationService {
  // Send notification to specific user
  static async sendToUser(
    userId: string, 
    notification: Omit<Notification, 'id' | 'created_at' | 'read' | 'user_id'>
  ) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          user_id: userId,
          read: false
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending notification to user:', error)
      throw error
    }
  }

  // Send notification to all users in organization
  static async sendToOrganization(
    organizationId: string,
    notification: Omit<Notification, 'id' | 'created_at' | 'read' | 'user_id'>
  ) {
    try {
      // Get all users in the organization
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('status', 'active')

      if (usersError) throw usersError

      if (!users || users.length === 0) return

      // Create notifications for all users
      const notifications = users.map(user => ({
        ...notification,
        user_id: user.id,
        read: false
      }))

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending notification to organization:', error)
      throw error
    }
  }

  // Send notification to users with specific role
  static async sendToRole(
    organizationId: string,
    role: string,
    notification: Omit<Notification, 'id' | 'created_at' | 'read' | 'user_id'>
  ) {
    try {
      // Get users with specific role
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('role', role)
        .eq('status', 'active')

      if (usersError) throw usersError

      if (!users || users.length === 0) return

      // Create notifications for users with role
      const notifications = users.map(user => ({
        ...notification,
        user_id: user.id,
        read: false
      }))

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending notification to role:', error)
      throw error
    }
  }

  // Appointment notifications
  static async notifyAppointmentCreated(appointment: any, patient: any) {
    const notification = {
      type: 'info' as const,
      title: 'Nueva Cita Programada',
      message: `Se ha programado una cita para ${patient.first_name} ${patient.last_name} el ${new Date(appointment.appointment_date).toLocaleDateString()}`,
      action_url: `/app/appointments`,
      action_label: 'Ver Cita'
    }

    // Notify doctors and receptionists
    await this.sendToRole(appointment.organization_id, 'doctor', notification)
    await this.sendToRole(appointment.organization_id, 'receptionist', notification)
  }

  static async notifyAppointmentUpdated(appointment: any, patient: any) {
    const notification = {
      type: 'warning' as const,
      title: 'Cita Actualizada',
      message: `La cita de ${patient.first_name} ${patient.last_name} ha sido actualizada`,
      action_url: `/app/appointments`,
      action_label: 'Ver Cita'
    }

    await this.sendToRole(appointment.organization_id, 'doctor', notification)
    await this.sendToRole(appointment.organization_id, 'receptionist', notification)
  }

  static async notifyAppointmentCancelled(appointment: any, patient: any) {
    const notification = {
      type: 'error' as const,
      title: 'Cita Cancelada',
      message: `La cita de ${patient.first_name} ${patient.last_name} ha sido cancelada`,
      action_url: `/app/appointments`,
      action_label: 'Ver Citas'
    }

    await this.sendToRole(appointment.organization_id, 'doctor', notification)
    await this.sendToRole(appointment.organization_id, 'receptionist', notification)
  }

  // Patient notifications
  static async notifyPatientCreated(patient: any, organizationId: string) {
    const notification = {
      type: 'success' as const,
      title: 'Nuevo Paciente Registrado',
      message: `Se ha registrado un nuevo paciente: ${patient.first_name} ${patient.last_name}`,
      action_url: `/app/patients`,
      action_label: 'Ver Paciente'
    }

    await this.sendToRole(organizationId, 'doctor', notification)
    await this.sendToRole(organizationId, 'receptionist', notification)
  }

  // Medical record notifications
  static async notifyMedicalRecordCreated(record: any, patient: any) {
    const notification = {
      type: 'info' as const,
      title: 'Nuevo Historial Médico',
      message: `Se ha creado un nuevo historial médico para ${patient.first_name} ${patient.last_name}`,
      action_url: `/app/medical-records`,
      action_label: 'Ver Historial'
    }

    await this.sendToRole(record.organization_id, 'doctor', notification)
  }

  // System notifications
  static async notifySystemMaintenance(organizationId: string, message: string) {
    const notification = {
      type: 'warning' as const,
      title: 'Mantenimiento del Sistema',
      message,
      action_url: `/app/settings`,
      action_label: 'Ver Configuración'
    }

    await this.sendToOrganization(organizationId, notification)
  }

  static async notifySystemError(organizationId: string, error: string) {
    const notification = {
      type: 'error' as const,
      title: 'Error del Sistema',
      message: `Se ha detectado un error: ${error}`,
      action_url: `/app/settings`,
      action_label: 'Ver Configuración'
    }

    await this.sendToRole(organizationId, 'admin', notification)
  }

  // Appointment reminders
  static async sendAppointmentReminder(appointment: any, patient: any, minutesBefore: number) {
    const appointmentTime = new Date(appointment.appointment_date)
    const reminderTime = new Date(appointmentTime.getTime() - minutesBefore * 60000)
    
    // Schedule reminder (in a real app, you'd use a job queue)
    setTimeout(async () => {
      const notification = {
        type: 'info' as const,
        title: 'Recordatorio de Cita',
        message: `Tienes una cita con ${patient.first_name} ${patient.last_name} en ${minutesBefore} minutos`,
        action_url: `/app/appointments`,
        action_label: 'Ver Cita'
      }

      await this.sendToUser(appointment.doctor_id, notification)
    }, reminderTime.getTime() - Date.now())
  }

  // Clean up old notifications
  static async cleanupOldNotifications(daysOld: number = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', cutoffDate.toISOString())

      if (error) throw error
    } catch (error) {
      console.error('Error cleaning up old notifications:', error)
      throw error
    }
  }
}
