-- Row Level Security (RLS) for multi-tenancy
-- This ensures data isolation between different organizations

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's organization_id
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT organization_id 
        FROM users 
        WHERE id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organizations policies
CREATE POLICY "Users can view their own organization" ON organizations
    FOR SELECT USING (id = get_user_organization_id());

CREATE POLICY "Admins can update their organization" ON organizations
    FOR UPDATE USING (
        id = get_user_organization_id() 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Users policies
CREATE POLICY "Users can view users in their organization" ON users
    FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Admins can insert users in their organization" ON users
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update users in their organization" ON users
    FOR UPDATE USING (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Patients policies
CREATE POLICY "Users can view patients in their organization" ON patients
    FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Staff can insert patients in their organization" ON patients
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'doctor', 'nurse', 'receptionist')
        )
    );

CREATE POLICY "Staff can update patients in their organization" ON patients
    FOR UPDATE USING (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'doctor', 'nurse', 'receptionist')
        )
    );

-- Appointments policies
CREATE POLICY "Users can view appointments in their organization" ON appointments
    FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Staff can insert appointments in their organization" ON appointments
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'doctor', 'nurse', 'receptionist')
        )
    );

CREATE POLICY "Staff can update appointments in their organization" ON appointments
    FOR UPDATE USING (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'doctor', 'nurse', 'receptionist')
        )
    );

-- Medical records policies (more restrictive)
CREATE POLICY "Medical staff can view medical records in their organization" ON medical_records
    FOR SELECT USING (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'doctor', 'nurse')
        )
    );

CREATE POLICY "Doctors can insert medical records in their organization" ON medical_records
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'doctor')
        )
    );

CREATE POLICY "Doctors can update their own medical records" ON medical_records
    FOR UPDATE USING (
        organization_id = get_user_organization_id()
        AND (
            doctor_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM users 
                WHERE id = auth.uid() 
                AND role = 'admin'
            )
        )
    );

-- Medical history policies
CREATE POLICY "Medical staff can view medical history in their organization" ON medical_history
    FOR SELECT USING (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'doctor', 'nurse')
        )
    );

CREATE POLICY "Medical staff can insert medical history in their organization" ON medical_history
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'doctor', 'nurse')
        )
    );

CREATE POLICY "Medical staff can update medical history in their organization" ON medical_history
    FOR UPDATE USING (
        organization_id = get_user_organization_id()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'doctor', 'nurse')
        )
    );