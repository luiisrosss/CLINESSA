-- CLINESA - Subscription Plans Schema
-- This file creates the subscription plans system

-- Create subscription plan types
CREATE TYPE subscription_plan_type AS ENUM ('basic', 'professional', 'enterprise');

-- Create subscription status
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'expired', 'trial');

-- Subscription plans table
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type subscription_plan_type NOT NULL UNIQUE,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2) NOT NULL,
    max_users INTEGER NOT NULL DEFAULT 1,
    max_patients INTEGER NOT NULL DEFAULT 100,
    max_appointments_per_month INTEGER NOT NULL DEFAULT 100,
    features JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization subscriptions table
CREATE TABLE organization_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status subscription_status DEFAULT 'trial',
    trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add subscription_id to organizations table
ALTER TABLE organizations ADD COLUMN subscription_id UUID REFERENCES organization_subscriptions(id);

-- Create indexes
CREATE INDEX idx_subscription_plans_type ON subscription_plans(type);
CREATE INDEX idx_organization_subscriptions_org_id ON organization_subscriptions(organization_id);
CREATE INDEX idx_organization_subscriptions_status ON organization_subscriptions(status);

-- Create triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_subscriptions_updated_at BEFORE UPDATE ON organization_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default subscription plans
INSERT INTO subscription_plans (name, type, description, price_monthly, price_yearly, max_users, max_patients, max_appointments_per_month, features) VALUES
(
    'Básico',
    'basic',
    'Perfecto para consultorios pequeños y médicos independientes',
    29.99,
    299.99,
    2,
    500,
    200,
    '["Gestión de pacientes", "Calendario de citas", "Historiales médicos básicos", "Soporte por email"]'
),
(
    'Profesional',
    'professional',
    'Ideal para clínicas medianas con múltiples profesionales',
    79.99,
    799.99,
    10,
    2000,
    1000,
    '["Todo lo del plan Básico", "Gestión de usuarios", "Reportes avanzados", "Integración con laboratorios", "Soporte prioritario", "Backup automático"]'
),
(
    'Empresarial',
    'enterprise',
    'Para hospitales y grandes organizaciones médicas',
    199.99,
    1999.99,
    100,
    10000,
    5000,
    '["Todo lo del plan Profesional", "API personalizada", "Integraciones avanzadas", "Soporte 24/7", "SLA garantizado", "Capacitación personalizada"]'
);

-- Function to get organization's current plan
CREATE OR REPLACE FUNCTION get_organization_plan(org_id UUID)
RETURNS TABLE (
    plan_name VARCHAR,
    plan_type subscription_plan_type,
    max_users INTEGER,
    max_patients INTEGER,
    max_appointments INTEGER,
    status subscription_status,
    trial_end_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.name,
        sp.type,
        sp.max_users,
        sp.max_patients,
        sp.max_appointments_per_month,
        os.status,
        os.trial_end_date
    FROM organization_subscriptions os
    JOIN subscription_plans sp ON os.plan_id = sp.id
    WHERE os.organization_id = org_id
    AND os.status IN ('active', 'trial')
    ORDER BY os.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to check if organization can add more users
CREATE OR REPLACE FUNCTION can_add_user(org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_users INTEGER;
    max_users INTEGER;
    plan_status subscription_status;
BEGIN
    -- Get current user count
    SELECT COUNT(*) INTO current_users
    FROM users
    WHERE organization_id = org_id AND is_active = true;
    
    -- Get plan limits
    SELECT sp.max_users, os.status INTO max_users, plan_status
    FROM organization_subscriptions os
    JOIN subscription_plans sp ON os.plan_id = sp.id
    WHERE os.organization_id = org_id
    AND os.status IN ('active', 'trial')
    ORDER BY os.created_at DESC
    LIMIT 1;
    
    -- Check if trial is still valid
    IF plan_status = 'trial' THEN
        SELECT EXISTS(
            SELECT 1 FROM organization_subscriptions
            WHERE organization_id = org_id
            AND status = 'trial'
            AND trial_end_date > NOW()
        ) INTO plan_status;
        
        IF NOT plan_status THEN
            RETURN false;
        END IF;
    END IF;
    
    RETURN current_users < max_users;
END;
$$ LANGUAGE plpgsql;

-- Function to check if organization can add more patients
CREATE OR REPLACE FUNCTION can_add_patient(org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_patients INTEGER;
    max_patients INTEGER;
    plan_status subscription_status;
BEGIN
    -- Get current patient count
    SELECT COUNT(*) INTO current_patients
    FROM patients
    WHERE organization_id = org_id AND is_active = true;
    
    -- Get plan limits
    SELECT sp.max_patients, os.status INTO max_patients, plan_status
    FROM organization_subscriptions os
    JOIN subscription_plans sp ON os.plan_id = sp.id
    WHERE os.organization_id = org_id
    AND os.status IN ('active', 'trial')
    ORDER BY os.created_at DESC
    LIMIT 1;
    
    -- Check if trial is still valid
    IF plan_status = 'trial' THEN
        SELECT EXISTS(
            SELECT 1 FROM organization_subscriptions
            WHERE organization_id = org_id
            AND status = 'trial'
            AND trial_end_date > NOW()
        ) INTO plan_status;
        
        IF NOT plan_status THEN
            RETURN false;
        END IF;
    END IF;
    
    RETURN current_patients < max_patients;
END;
$$ LANGUAGE plpgsql;
