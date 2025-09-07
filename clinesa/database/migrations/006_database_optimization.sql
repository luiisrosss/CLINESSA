-- Database Optimization Migration
-- Performance improvements, additional indexes, and materialized views

-- Add missing indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_patients_dni ON patients(dni);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_birth_date ON patients(birth_date);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_visit_date ON medical_records(visit_date);
CREATE INDEX IF NOT EXISTS idx_medical_history_category ON medical_history(category);
CREATE INDEX IF NOT EXISTS idx_medical_history_severity ON medical_history(severity);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_appointments_org_date ON appointments(organization_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_org_status ON appointments(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_patients_org_active ON patients(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_users_org_role ON users(organization_id, role);
CREATE INDEX IF NOT EXISTS idx_medical_records_org_patient ON medical_records(organization_id, patient_id);

-- Partial indexes for better performance on filtered queries
CREATE INDEX IF NOT EXISTS idx_appointments_active ON appointments(organization_id, appointment_date) 
    WHERE status IN ('scheduled', 'confirmed');
CREATE INDEX IF NOT EXISTS idx_patients_active ON patients(organization_id, created_at) 
    WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_active ON users(organization_id, role) 
    WHERE is_active = true;

-- Add notifications table for real-time notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    action_url TEXT,
    action_label VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_org_id ON notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Add updated_at trigger for notifications
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create materialized view for appointment statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS appointment_stats AS
SELECT 
    organization_id,
    DATE(appointment_date) as appointment_date,
    status,
    COUNT(*) as count,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_count,
    COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_count,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
FROM appointments
GROUP BY organization_id, DATE(appointment_date), status;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_appointment_stats_org_date ON appointment_stats(organization_id, appointment_date);

-- Create materialized view for patient statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS patient_stats AS
SELECT 
    organization_id,
    DATE(created_at) as registration_date,
    gender,
    COUNT(*) as count,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_count,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_count
FROM patients
GROUP BY organization_id, DATE(created_at), gender;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_patient_stats_org_date ON patient_stats(organization_id, registration_date);

-- Create materialized view for user activity
CREATE MATERIALIZED VIEW IF NOT EXISTS user_activity_stats AS
SELECT 
    organization_id,
    role,
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_users
FROM users
GROUP BY organization_id, role;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_user_activity_stats_org ON user_activity_stats(organization_id);

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY appointment_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY patient_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_activity_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to get appointment statistics for a date range
CREATE OR REPLACE FUNCTION get_appointment_stats(
    org_id UUID,
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (
    total_appointments BIGINT,
    confirmed_appointments BIGINT,
    scheduled_appointments BIGINT,
    cancelled_appointments BIGINT,
    completed_appointments BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_appointments,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_appointments,
        COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_appointments,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_appointments,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_appointments
    FROM appointments
    WHERE organization_id = org_id
    AND DATE(appointment_date) BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Function to get patient statistics for a date range
CREATE OR REPLACE FUNCTION get_patient_stats(
    org_id UUID,
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (
    total_patients BIGINT,
    new_patients BIGINT,
    active_patients BIGINT,
    inactive_patients BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_patients,
        COUNT(CASE WHEN DATE(created_at) BETWEEN start_date AND end_date THEN 1 END) as new_patients,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_patients,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_patients
    FROM patients
    WHERE organization_id = org_id
    AND created_at <= end_date;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(org_id UUID)
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    doctors BIGINT,
    nurses BIGINT,
    receptionists BIGINT,
    admins BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN role = 'doctor' AND is_active = true THEN 1 END) as doctors,
        COUNT(CASE WHEN role = 'nurse' AND is_active = true THEN 1 END) as nurses,
        COUNT(CASE WHEN role = 'receptionist' AND is_active = true THEN 1 END) as receptionists,
        COUNT(CASE WHEN role = 'admin' AND is_active = true THEN 1 END) as admins
    FROM users
    WHERE organization_id = org_id;
END;
$$ LANGUAGE plpgsql;

-- Function to search patients with full-text search
CREATE OR REPLACE FUNCTION search_patients(
    org_id UUID,
    search_term TEXT,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    patient_number VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    dni VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    birth_date DATE,
    gender gender,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.patient_number,
        p.first_name,
        p.last_name,
        p.dni,
        p.email,
        p.phone,
        p.birth_date,
        p.gender,
        p.created_at
    FROM patients p
    WHERE p.organization_id = org_id
    AND p.is_active = true
    AND (
        p.first_name ILIKE '%' || search_term || '%'
        OR p.last_name ILIKE '%' || search_term || '%'
        OR p.patient_number ILIKE '%' || search_term || '%'
        OR p.dni ILIKE '%' || search_term || '%'
        OR p.email ILIKE '%' || search_term || '%'
        OR p.phone ILIKE '%' || search_term || '%'
    )
    ORDER BY p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get appointments for a specific date range with doctor and patient info
CREATE OR REPLACE FUNCTION get_appointments_with_details(
    org_id UUID,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    doctor_id UUID DEFAULT NULL,
    status_filter appointment_status DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    description TEXT,
    appointment_date TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    status appointment_status,
    patient_id UUID,
    patient_name TEXT,
    patient_phone VARCHAR,
    doctor_id UUID,
    doctor_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.description,
        a.appointment_date,
        a.duration,
        a.status,
        a.patient_id,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        p.phone as patient_phone,
        a.doctor_id,
        CONCAT(u.first_name, ' ', u.last_name) as doctor_name,
        a.created_at
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN users u ON a.doctor_id = u.id
    WHERE a.organization_id = org_id
    AND a.appointment_date BETWEEN start_date AND end_date
    AND (doctor_id IS NULL OR a.doctor_id = doctor_id)
    AND (status_filter IS NULL OR a.status = status_filter)
    ORDER BY a.appointment_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get medical records with patient and doctor info
CREATE OR REPLACE FUNCTION get_medical_records_with_details(
    org_id UUID,
    patient_id UUID DEFAULT NULL,
    doctor_id UUID DEFAULT NULL,
    limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    chief_complaint TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    visit_date TIMESTAMP WITH TIME ZONE,
    patient_id UUID,
    patient_name TEXT,
    doctor_id UUID,
    doctor_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mr.id,
        mr.chief_complaint,
        mr.symptoms,
        mr.diagnosis,
        mr.treatment_plan,
        mr.visit_date,
        mr.patient_id,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        mr.doctor_id,
        CONCAT(u.first_name, ' ', u.last_name) as doctor_name,
        mr.created_at
    FROM medical_records mr
    JOIN patients p ON mr.patient_id = p.id
    JOIN users u ON mr.doctor_id = u.id
    WHERE mr.organization_id = org_id
    AND (patient_id IS NULL OR mr.patient_id = patient_id)
    AND (doctor_id IS NULL OR mr.doctor_id = doctor_id)
    ORDER BY mr.visit_date DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats(org_id UUID)
RETURNS TABLE (
    total_patients BIGINT,
    total_appointments BIGINT,
    today_appointments BIGINT,
    pending_appointments BIGINT,
    confirmed_appointments BIGINT,
    total_medical_records BIGINT,
    active_users BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM patients WHERE organization_id = org_id AND is_active = true) as total_patients,
        (SELECT COUNT(*) FROM appointments WHERE organization_id = org_id) as total_appointments,
        (SELECT COUNT(*) FROM appointments WHERE organization_id = org_id AND DATE(appointment_date) = CURRENT_DATE) as today_appointments,
        (SELECT COUNT(*) FROM appointments WHERE organization_id = org_id AND status = 'scheduled') as pending_appointments,
        (SELECT COUNT(*) FROM appointments WHERE organization_id = org_id AND status = 'confirmed') as confirmed_appointments,
        (SELECT COUNT(*) FROM medical_records WHERE organization_id = org_id) as total_medical_records,
        (SELECT COUNT(*) FROM users WHERE organization_id = org_id AND is_active = true) as active_users;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to refresh materialized views (requires pg_cron extension)
-- This would be set up in production with a cron job or pg_cron
-- For now, we'll create a function that can be called manually

-- Add comments for documentation
COMMENT ON MATERIALIZED VIEW appointment_stats IS 'Statistics for appointments by organization, date, and status';
COMMENT ON MATERIALIZED VIEW patient_stats IS 'Statistics for patients by organization, registration date, and gender';
COMMENT ON MATERIALIZED VIEW user_activity_stats IS 'Statistics for user activity by organization and role';

COMMENT ON FUNCTION get_appointment_stats IS 'Get appointment statistics for a date range';
COMMENT ON FUNCTION get_patient_stats IS 'Get patient statistics for a date range';
COMMENT ON FUNCTION get_user_stats IS 'Get user statistics for an organization';
COMMENT ON FUNCTION search_patients IS 'Search patients with full-text search';
COMMENT ON FUNCTION get_appointments_with_details IS 'Get appointments with patient and doctor details';
COMMENT ON FUNCTION get_medical_records_with_details IS 'Get medical records with patient and doctor details';
COMMENT ON FUNCTION cleanup_old_notifications IS 'Clean up old notifications';
COMMENT ON FUNCTION get_dashboard_stats IS 'Get dashboard statistics for an organization';
COMMENT ON FUNCTION refresh_all_materialized_views IS 'Refresh all materialized views';

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_appointment_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_patient_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats TO authenticated;
GRANT EXECUTE ON FUNCTION search_patients TO authenticated;
GRANT EXECUTE ON FUNCTION get_appointments_with_details TO authenticated;
GRANT EXECUTE ON FUNCTION get_medical_records_with_details TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_all_materialized_views TO authenticated;
