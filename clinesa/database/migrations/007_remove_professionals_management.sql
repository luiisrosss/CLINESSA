-- Migration: Remove professionals management functionality
-- This migration removes team management features and focuses on individual psychologists

-- Remove team management features from existing plans
UPDATE subscription_plans 
SET features = features - 'Gestión de equipos médicos'::text
WHERE features ? 'Gestión de equipos médicos';

UPDATE subscription_plans 
SET features = features - 'Gestión de usuarios'::text
WHERE features ? 'Gestión de usuarios';

-- Update role descriptions to focus on individual practice
UPDATE subscription_plans 
SET description = 'Plan para psicólogos individuales que gestionan su propia consulta'
WHERE type = 'basic';

UPDATE subscription_plans 
SET description = 'Plan avanzado para psicólogos con necesidades de análisis y reportes'
WHERE type = 'professional';

UPDATE subscription_plans 
SET description = 'Plan completo para psicólogos con múltiples especialidades'
WHERE type = 'enterprise';

-- Remove additional team-related features from plan features
UPDATE subscription_plans 
SET features = features - 'Administración de múltiples profesionales'::text
WHERE features ? 'Administración de múltiples profesionales';

UPDATE subscription_plans 
SET features = features - 'Roles personalizados'::text
WHERE features ? 'Roles personalizados';

UPDATE subscription_plans 
SET features = features - 'Múltiples sucursales'::text
WHERE features ? 'Múltiples sucursales';

-- Add psychology-focused features
UPDATE subscription_plans 
SET features = features || '["Gestión individual de consulta psicológica"]'::jsonb
WHERE type = 'basic';

UPDATE subscription_plans 
SET features = features || '["Herramientas especializadas para terapia"]'::jsonb
WHERE type = 'professional';

UPDATE subscription_plans 
SET features = features || '["Múltiples especialidades psicológicas"]'::jsonb
WHERE type = 'enterprise';

-- Update organization types to focus on individual practices
UPDATE organizations 
SET type = 'private_practice'
WHERE type = 'clinic' OR type = 'hospital';

-- Update role enum to focus on psychology
-- First, remove any default value from the role column
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

-- Rename the old enum type
ALTER TYPE user_role RENAME TO user_role_old;

-- Create new enum type
CREATE TYPE user_role AS ENUM ('psychologist', 'admin');

-- Update users table to use new role enum
ALTER TABLE users ALTER COLUMN role TYPE user_role USING 
  CASE 
    WHEN role::text IN ('admin') THEN 'admin'::user_role
    WHEN role::text IN ('doctor', 'nurse', 'receptionist') THEN 'psychologist'::user_role
    ELSE 'psychologist'::user_role
  END;

-- Set new default value
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'psychologist';

-- Drop old enum
DROP TYPE user_role_old;

-- Update RLS policies to focus on individual practice
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create new policies for individual psychologists
CREATE POLICY "Psychologists can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Psychologists can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Psychologists can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Update organization policies to focus on individual practice
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
DROP POLICY IF EXISTS "Users can update their organization" ON organizations;

CREATE POLICY "Psychologists can view their organization" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.organization_id = organizations.id 
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Psychologists can update their organization" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.organization_id = organizations.id 
      AND users.id = auth.uid()
    )
  );

-- Update patient policies to focus on individual psychologist
DROP POLICY IF EXISTS "Users can view patients in their organization" ON patients;
DROP POLICY IF EXISTS "Users can manage patients in their organization" ON patients;

CREATE POLICY "Psychologists can view their patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = patients.psychologist_id 
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Psychologists can manage their patients" ON patients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = patients.psychologist_id 
      AND users.id = auth.uid()
    )
  );

-- Update appointments policies
DROP POLICY IF EXISTS "Users can view appointments in their organization" ON appointments;
DROP POLICY IF EXISTS "Users can manage appointments in their organization" ON appointments;

CREATE POLICY "Psychologists can view their appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = appointments.psychologist_id 
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Psychologists can manage their appointments" ON appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = appointments.psychologist_id 
      AND users.id = auth.uid()
    )
  );

-- Update medical records policies
DROP POLICY IF EXISTS "Users can view medical records in their organization" ON medical_records;
DROP POLICY IF EXISTS "Users can manage medical records in their organization" ON medical_records;

CREATE POLICY "Psychologists can view their medical records" ON medical_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = medical_records.psychologist_id 
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Psychologists can manage their medical records" ON medical_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = medical_records.psychologist_id 
      AND users.id = auth.uid()
    )
  );

-- Add psychologist_id to patients table if it doesn't exist
ALTER TABLE patients ADD COLUMN IF NOT EXISTS psychologist_id UUID REFERENCES users(id);

-- Add psychologist_id to appointments table if it doesn't exist
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS psychologist_id UUID REFERENCES users(id);

-- Add psychologist_id to medical_records table if it doesn't exist
ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS psychologist_id UUID REFERENCES users(id);

-- Update existing records to assign them to the organization owner
UPDATE patients 
SET psychologist_id = (
  SELECT u.id 
  FROM users u 
  WHERE u.organization_id = patients.organization_id 
  LIMIT 1
)
WHERE psychologist_id IS NULL;

UPDATE appointments 
SET psychologist_id = (
  SELECT u.id 
  FROM users u 
  WHERE u.organization_id = appointments.organization_id 
  LIMIT 1
)
WHERE psychologist_id IS NULL;

UPDATE medical_records 
SET psychologist_id = (
  SELECT u.id 
  FROM users u 
  WHERE u.organization_id = medical_records.organization_id 
  LIMIT 1
)
WHERE psychologist_id IS NULL;

-- Make psychologist_id NOT NULL after populating
ALTER TABLE patients ALTER COLUMN psychologist_id SET NOT NULL;
ALTER TABLE appointments ALTER COLUMN psychologist_id SET NOT NULL;
ALTER TABLE medical_records ALTER COLUMN psychologist_id SET NOT NULL;

-- Update functions to focus on individual practice
CREATE OR REPLACE FUNCTION get_psychologist_stats(psychologist_uuid UUID)
RETURNS TABLE (
  total_patients BIGINT,
  total_appointments BIGINT,
  upcoming_appointments BIGINT,
  completed_appointments BIGINT,
  monthly_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM patients WHERE psychologist_id = psychologist_uuid) as total_patients,
    (SELECT COUNT(*) FROM appointments WHERE psychologist_id = psychologist_uuid) as total_appointments,
    (SELECT COUNT(*) FROM appointments WHERE psychologist_id = psychologist_uuid AND appointment_date >= CURRENT_DATE) as upcoming_appointments,
    (SELECT COUNT(*) FROM appointments WHERE psychologist_id = psychologist_uuid AND appointment_date < CURRENT_DATE) as completed_appointments,
    (SELECT COALESCE(SUM(amount), 0) FROM appointments WHERE psychologist_id = psychologist_uuid AND appointment_date >= DATE_TRUNC('month', CURRENT_DATE)) as monthly_revenue;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the main dashboard function
CREATE OR REPLACE FUNCTION get_dashboard_data(psychologist_uuid UUID)
RETURNS TABLE (
  recent_appointments JSON,
  upcoming_appointments JSON,
  patient_stats JSON,
  monthly_stats JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (
      SELECT json_agg(
        json_build_object(
          'id', a.id,
          'patient_name', p.first_name || ' ' || p.last_name,
          'appointment_date', a.appointment_date,
          'status', a.status,
          'notes', a.notes
        )
      )
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.psychologist_id = psychologist_uuid
      ORDER BY a.appointment_date DESC
      LIMIT 5
    ) as recent_appointments,
    
    (
      SELECT json_agg(
        json_build_object(
          'id', a.id,
          'patient_name', p.first_name || ' ' || p.last_name,
          'appointment_date', a.appointment_date,
          'status', a.status
        )
      )
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.psychologist_id = psychologist_uuid
      AND a.appointment_date >= CURRENT_DATE
      ORDER BY a.appointment_date ASC
      LIMIT 5
    ) as upcoming_appointments,
    
    (
      SELECT json_build_object(
        'total_patients', COUNT(*),
        'new_patients_this_month', COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)),
        'active_patients', COUNT(*) FILTER (WHERE status = 'active')
      )
      FROM patients
      WHERE psychologist_id = psychologist_uuid
    ) as patient_stats,
    
    (
      SELECT json_build_object(
        'total_appointments', COUNT(*),
        'completed_appointments', COUNT(*) FILTER (WHERE appointment_date < CURRENT_DATE),
        'upcoming_appointments', COUNT(*) FILTER (WHERE appointment_date >= CURRENT_DATE),
        'monthly_revenue', COALESCE(SUM(amount), 0)
      )
      FROM appointments
      WHERE psychologist_id = psychologist_uuid
      AND appointment_date >= DATE_TRUNC('month', CURRENT_DATE)
    ) as monthly_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_psychologist_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_data(UUID) TO authenticated;

-- Update organization types to be more psychology-focused
UPDATE organizations 
SET name = REPLACE(name, 'Clínica', 'Consultorio')
WHERE name LIKE '%Clínica%';

UPDATE organizations 
SET name = REPLACE(name, 'Hospital', 'Centro de Psicología')
WHERE name LIKE '%Hospital%';

-- Add comment explaining the changes
COMMENT ON TABLE users IS 'Individual psychologists managing their own practice';
COMMENT ON TABLE patients IS 'Patients assigned to individual psychologists';
COMMENT ON TABLE appointments IS 'Appointments for individual psychologists';
COMMENT ON TABLE medical_records IS 'Medical records for individual psychologists';
