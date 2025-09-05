export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          type: string
          address: string | null
          phone: string | null
          email: string | null
          logo_url: string | null
          settings: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          organization_id: string
          email: string
          first_name: string
          last_name: string
          role: 'admin' | 'doctor' | 'nurse' | 'receptionist'
          phone: string | null
          avatar_url: string | null
          license_number: string | null
          specialization: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          first_name: string
          last_name: string
          role?: 'admin' | 'doctor' | 'nurse' | 'receptionist'
          phone?: string | null
          avatar_url?: string | null
          license_number?: string | null
          specialization?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'admin' | 'doctor' | 'nurse' | 'receptionist'
          phone?: string | null
          avatar_url?: string | null
          license_number?: string | null
          specialization?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          organization_id: string
          patient_number: string
          first_name: string
          last_name: string
          dni: string | null
          email: string | null
          phone: string | null
          birth_date: string
          gender: 'male' | 'female' | 'other'
          address: string | null
          city: string | null
          postal_code: string | null
          insurance_provider: string | null
          insurance_number: string | null
          insurance_expiry: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          blood_type: string | null
          allergies: string | null
          chronic_conditions: string | null
          medications: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          patient_number: string
          first_name: string
          last_name: string
          dni?: string | null
          email?: string | null
          phone?: string | null
          birth_date: string
          gender: 'male' | 'female' | 'other'
          address?: string | null
          city?: string | null
          postal_code?: string | null
          insurance_provider?: string | null
          insurance_number?: string | null
          insurance_expiry?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          blood_type?: string | null
          allergies?: string | null
          chronic_conditions?: string | null
          medications?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          patient_number?: string
          first_name?: string
          last_name?: string
          dni?: string | null
          email?: string | null
          phone?: string | null
          birth_date?: string
          gender?: 'male' | 'female' | 'other'
          address?: string | null
          city?: string | null
          postal_code?: string | null
          insurance_provider?: string | null
          insurance_number?: string | null
          insurance_expiry?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          blood_type?: string | null
          allergies?: string | null
          chronic_conditions?: string | null
          medications?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          organization_id: string
          patient_id: string
          doctor_id: string
          title: string
          description: string | null
          appointment_date: string
          duration: number
          status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          reason_for_visit: string | null
          notes: string | null
          follow_up_required: boolean
          follow_up_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          patient_id: string
          doctor_id: string
          title: string
          description?: string | null
          appointment_date: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          reason_for_visit?: string | null
          notes?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          patient_id?: string
          doctor_id?: string
          title?: string
          description?: string | null
          appointment_date?: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          reason_for_visit?: string | null
          notes?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          organization_id: string
          patient_id: string
          doctor_id: string
          appointment_id: string | null
          chief_complaint: string | null
          symptoms: string | null
          diagnosis: string
          treatment_plan: string | null
          prescription: Json | null
          vital_signs: Json | null
          follow_up_instructions: string | null
          next_visit_date: string | null
          attachments: Json
          visit_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          patient_id: string
          doctor_id: string
          appointment_id?: string | null
          chief_complaint?: string | null
          symptoms?: string | null
          diagnosis: string
          treatment_plan?: string | null
          prescription?: Json | null
          vital_signs?: Json | null
          follow_up_instructions?: string | null
          next_visit_date?: string | null
          attachments?: Json
          visit_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          patient_id?: string
          doctor_id?: string
          appointment_id?: string | null
          chief_complaint?: string | null
          symptoms?: string | null
          diagnosis?: string
          treatment_plan?: string | null
          prescription?: Json | null
          vital_signs?: Json | null
          follow_up_instructions?: string | null
          next_visit_date?: string | null
          attachments?: Json
          visit_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      medical_history: {
        Row: {
          id: string
          organization_id: string
          patient_id: string
          category: string
          title: string
          description: string | null
          severity: string | null
          onset_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          patient_id: string
          category: string
          title: string
          description?: string | null
          severity?: string | null
          onset_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          patient_id?: string
          category?: string
          title?: string
          description?: string | null
          severity?: string | null
          onset_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: 'admin' | 'doctor' | 'nurse' | 'receptionist'
      appointment_status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
      gender: 'male' | 'female' | 'other'
    }
  }
}

export type UserRole = Database['public']['Enums']['user_role']
export type AppointmentStatus = Database['public']['Enums']['appointment_status']
export type Gender = Database['public']['Enums']['gender']

export type Organization = Database['public']['Tables']['organizations']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type MedicalRecord = Database['public']['Tables']['medical_records']['Row']
export type MedicalHistory = Database['public']['Tables']['medical_history']['Row']

// Helper types for form data
export type PatientInsert = Database['public']['Tables']['patients']['Insert']
export type PatientUpdate = Database['public']['Tables']['patients']['Update']
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']
export type MedicalRecordInsert = Database['public']['Tables']['medical_records']['Insert']
export type MedicalRecordUpdate = Database['public']['Tables']['medical_records']['Update']

// Extended types with relations
export type PatientWithHistory = Patient & {
  medical_history: MedicalHistory[]
  appointments: Appointment[]
}

export type AppointmentWithPatient = Appointment & {
  patients: Patient
  doctor: User
}

export type MedicalRecordWithPatient = MedicalRecord & {
  patients: Patient
  doctor: User
}

// Vital signs structure
export interface VitalSigns {
  blood_pressure?: string
  temperature?: string
  heart_rate?: string
  respiratory_rate?: string
  weight?: string
  height?: string
  bmi?: string
  oxygen_saturation?: string
}

// Prescription structure
export interface Prescription {
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}