-- Database Optimization Migration
-- This migration adds indexes, materialized views, and optimized functions

-- =============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =============================================

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_org_date ON appointments(organization_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

-- Patients indexes
CREATE INDEX IF NOT EXISTS idx_patients_org ON patients(organization_id);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);

-- Medical records indexes
CREATE INDEX IF NOT EXISTS idx_medical_records_org ON medical_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor ON medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_visit_date ON medical_records(visit_date);
CREATE INDEX IF NOT EXISTS idx_medical_records_created_at ON medical_records(created_at);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_org ON notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- =============================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- =============================================

-- Daily appointment statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_appointment_stats AS
SELECT 
    organization_id,
    DATE(appointment_date) as date,
    COUNT(*) as total_appointments,
    COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
    COUNT(*) FILTER (WHERE status = 'no_show') as no_show
FROM appointments
GROUP BY organization_id, DATE(appointment_date);

-- Patient statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS patient_stats AS
SELECT 
    organization_id,
    COUNT(*) as total_patients,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_patients_30d,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_patients_7d
FROM patients
GROUP BY organization_id;

-- Doctor workload statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS doctor_workload_stats AS
SELECT 
    organization_id,
    doctor_id,
    COUNT(*) as total_appointments,
    COUNT(*) FILTER (WHERE appointment_date >= CURRENT_DATE) as upcoming_appointments,
    COUNT(*) FILTER (WHERE appointment_date >= CURRENT_DATE - INTERVAL '30 days') as appointments_30d
FROM appointments
GROUP BY organization_id, doctor_id;

-- =============================================
-- OPTIMIZED FUNCTIONS
-- =============================================

-- Get appointments with details (optimized)
CREATE OR REPLACE FUNCTION get_appointments_with_details(
    org_id UUID,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    doctor_filter_id UUID DEFAULT NULL,
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
    patient_name VARCHAR,
    doctor_id UUID,
    doctor_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
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
        a.doctor_id,
        CONCAT(u.first_name, ' ', u.last_name) as doctor_name,
        a.created_at
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN users u ON a.doctor_id = u.id
    WHERE a.organization_id = org_id
    AND a.appointment_date BETWEEN start_date AND end_date
    AND (doctor_filter_id IS NULL OR a.doctor_id = doctor_filter_id)
    AND (status_filter IS NULL OR a.status = status_filter)
    ORDER BY a.appointment_date ASC;
END;
$$;

-- Get medical records with details (optimized)
CREATE OR REPLACE FUNCTION get_medical_records_with_details(
    org_id UUID,
    patient_filter_id UUID DEFAULT NULL,
    doctor_filter_id UUID DEFAULT NULL,
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
    patient_name VARCHAR,
    doctor_id UUID,
    doctor_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
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
    AND (patient_filter_id IS NULL OR mr.patient_id = patient_filter_id)
    AND (doctor_filter_id IS NULL OR mr.doctor_id = doctor_filter_id)
    ORDER BY mr.visit_date DESC
    LIMIT limit_count;
END;
$$;

-- Get dashboard statistics (optimized)
CREATE OR REPLACE FUNCTION get_dashboard_stats(org_id UUID)
RETURNS TABLE (
    total_patients BIGINT,
    total_appointments BIGINT,
    total_medical_records BIGINT,
    total_users BIGINT,
    appointments_today BIGINT,
    appointments_this_week BIGINT,
    appointments_this_month BIGINT,
    new_patients_this_month BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM patients WHERE organization_id = org_id) as total_patients,
        (SELECT COUNT(*) FROM appointments WHERE organization_id = org_id) as total_appointments,
        (SELECT COUNT(*) FROM medical_records WHERE organization_id = org_id) as total_medical_records,
        (SELECT COUNT(*) FROM users WHERE organization_id = org_id) as total_users,
        (SELECT COUNT(*) FROM appointments WHERE organization_id = org_id AND DATE(appointment_date) = CURRENT_DATE) as appointments_today,
        (SELECT COUNT(*) FROM appointments WHERE organization_id = org_id AND appointment_date >= CURRENT_DATE - INTERVAL '7 days') as appointments_this_week,
        (SELECT COUNT(*) FROM appointments WHERE organization_id = org_id AND appointment_date >= CURRENT_DATE - INTERVAL '30 days') as appointments_this_month,
        (SELECT COUNT(*) FROM patients WHERE organization_id = org_id AND created_at >= CURRENT_DATE - INTERVAL '30 days') as new_patients_this_month;
END;
$$;

-- Get appointment statistics by period (optimized)
CREATE OR REPLACE FUNCTION get_appointment_stats_by_period(
    org_id UUID,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    total_appointments BIGINT,
    scheduled_appointments BIGINT,
    completed_appointments BIGINT,
    cancelled_appointments BIGINT,
    no_show_appointments BIGINT,
    completion_rate NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    total_count BIGINT;
    completed_count BIGINT;
BEGIN
    SELECT COUNT(*) INTO total_count
    FROM appointments
    WHERE organization_id = org_id
    AND appointment_date BETWEEN start_date AND end_date;
    
    SELECT COUNT(*) INTO completed_count
    FROM appointments
    WHERE organization_id = org_id
    AND appointment_date BETWEEN start_date AND end_date
    AND status = 'completed';
    
    RETURN QUERY
    SELECT
        total_count,
        COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled_appointments,
        completed_count,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_appointments,
        COUNT(*) FILTER (WHERE status = 'no_show') as no_show_appointments,
        CASE 
            WHEN total_count > 0 THEN ROUND((completed_count::NUMERIC / total_count::NUMERIC) * 100, 2)
            ELSE 0
        END as completion_rate
    FROM appointments
    WHERE organization_id = org_id
    AND appointment_date BETWEEN start_date AND end_date;
END;
$$;

-- =============================================
-- REFRESH FUNCTIONS FOR MATERIALIZED VIEWS
-- =============================================

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW daily_appointment_stats;
    REFRESH MATERIALIZED VIEW patient_stats;
    REFRESH MATERIALIZED VIEW doctor_workload_stats;
END;
$$;

-- =============================================
-- TRIGGERS FOR AUTO-REFRESH
-- =============================================

-- Trigger function to refresh materialized views on data changes
CREATE OR REPLACE FUNCTION trigger_refresh_materialized_views()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Refresh materialized views asynchronously
    PERFORM pg_notify('refresh_materialized_views', '');
    RETURN NULL;
END;
$$;

-- Create triggers for appointments
CREATE TRIGGER trigger_appointments_refresh
    AFTER INSERT OR UPDATE OR DELETE ON appointments
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_refresh_materialized_views();

-- Create triggers for patients
CREATE TRIGGER trigger_patients_refresh
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_refresh_materialized_views();

-- =============================================
-- PERFORMANCE MONITORING VIEWS
-- =============================================

-- View for monitoring slow queries
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
WHERE mean_time > 1000  -- Queries taking more than 1 second on average
ORDER BY mean_time DESC;

-- View for monitoring table sizes
CREATE OR REPLACE VIEW table_sizes AS
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =============================================
-- GRANTS AND PERMISSIONS
-- =============================================

-- Grant permissions for the new functions
GRANT EXECUTE ON FUNCTION get_appointments_with_details(UUID, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE, UUID, appointment_status) TO authenticated;
GRANT EXECUTE ON FUNCTION get_medical_records_with_details(UUID, UUID, UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_appointment_stats_by_period(UUID, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_all_materialized_views() TO authenticated;

-- Grant permissions for materialized views
GRANT SELECT ON daily_appointment_stats TO authenticated;
GRANT SELECT ON patient_stats TO authenticated;
GRANT SELECT ON doctor_workload_stats TO authenticated;

-- Grant permissions for monitoring views
GRANT SELECT ON slow_queries TO authenticated;
GRANT SELECT ON table_sizes TO authenticated;

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON FUNCTION get_appointments_with_details IS 'Optimized function to get appointments with patient and doctor details';
COMMENT ON FUNCTION get_medical_records_with_details IS 'Optimized function to get medical records with patient and doctor details';
COMMENT ON FUNCTION get_dashboard_stats IS 'Get comprehensive dashboard statistics for an organization';
COMMENT ON FUNCTION get_appointment_stats_by_period IS 'Get appointment statistics for a specific time period';
COMMENT ON FUNCTION refresh_all_materialized_views IS 'Refresh all materialized views for analytics';

COMMENT ON MATERIALIZED VIEW daily_appointment_stats IS 'Daily appointment statistics for analytics';
COMMENT ON MATERIALIZED VIEW patient_stats IS 'Patient statistics for analytics';
COMMENT ON MATERIALIZED VIEW doctor_workload_stats IS 'Doctor workload statistics for analytics';

-- =============================================
-- INITIAL DATA REFRESH
-- =============================================

-- Refresh materialized views with initial data
SELECT refresh_all_materialized_views();
