-- CLINESA - Development Admin Plan
-- This file gives you the most professional plan for free (for development/testing)

-- First, let's create a special development organization if it doesn't exist
INSERT INTO organizations (id, name, type, address, phone, email) VALUES 
(
    '00000000-0000-0000-0000-000000000999',
    'CLINESA Development',
    'clinic',
    'Development Environment',
    '+1 555-0123',
    'dev@clinesa.com'
) ON CONFLICT (id) DO NOTHING;

-- Create a development admin user if it doesn't exist
INSERT INTO users (id, organization_id, email, first_name, last_name, role, phone, license_number, specialization) VALUES
(
    '00000000-0000-0000-0000-000000000998',
    '00000000-0000-0000-0000-000000000999',
    'admin@clinesa.dev',
    'Admin',
    'Developer',
    'admin',
    '+1 555-0123',
    'DEV-001',
    'System Administrator'
) ON CONFLICT (id) DO NOTHING;

-- Get the Enterprise plan ID
DO $$
DECLARE
    enterprise_plan_id UUID;
    dev_org_id UUID := '00000000-0000-0000-0000-000000000999';
BEGIN
    -- Get the enterprise plan ID
    SELECT id INTO enterprise_plan_id 
    FROM subscription_plans 
    WHERE type = 'enterprise' 
    LIMIT 1;
    
    -- Create a lifetime subscription for the development organization
    INSERT INTO organization_subscriptions (
        id,
        organization_id, 
        plan_id, 
        status, 
        trial_start_date, 
        trial_end_date,
        current_period_start,
        current_period_end
    ) VALUES (
        '00000000-0000-0000-0000-000000000997',
        dev_org_id,
        enterprise_plan_id,
        'active',
        NOW(),
        NOW() + INTERVAL '100 years', -- 100 years = effectively lifetime
        NOW(),
        NOW() + INTERVAL '100 years'
    ) ON CONFLICT (id) DO UPDATE SET
        status = 'active',
        trial_end_date = NOW() + INTERVAL '100 years',
        current_period_end = NOW() + INTERVAL '100 years';
    
    -- Update the organization with the subscription
    UPDATE organizations 
    SET subscription_id = '00000000-0000-0000-0000-000000000997'
    WHERE id = dev_org_id;
    
    RAISE NOTICE 'Development admin plan activated successfully!';
END $$;

-- Create a function to give any organization the enterprise plan for free
CREATE OR REPLACE FUNCTION give_enterprise_plan_free(org_id UUID)
RETURNS VOID AS $$
DECLARE
    enterprise_plan_id UUID;
    subscription_id UUID;
BEGIN
    -- Get the enterprise plan ID
    SELECT id INTO enterprise_plan_id 
    FROM subscription_plans 
    WHERE type = 'enterprise' 
    LIMIT 1;
    
    -- Generate a new subscription ID
    subscription_id := uuid_generate_v4();
    
    -- Create the subscription
    INSERT INTO organization_subscriptions (
        id,
        organization_id, 
        plan_id, 
        status, 
        trial_start_date, 
        trial_end_date,
        current_period_start,
        current_period_end
    ) VALUES (
        subscription_id,
        org_id,
        enterprise_plan_id,
        'active',
        NOW(),
        NOW() + INTERVAL '100 years', -- 100 years = effectively lifetime
        NOW(),
        NOW() + INTERVAL '100 years'
    );
    
    -- Update the organization with the subscription
    UPDATE organizations 
    SET subscription_id = subscription_id
    WHERE id = org_id;
    
    RAISE NOTICE 'Enterprise plan given to organization %', org_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to reset any organization to enterprise plan
CREATE OR REPLACE FUNCTION reset_to_enterprise_plan(org_id UUID)
RETURNS VOID AS $$
DECLARE
    enterprise_plan_id UUID;
    subscription_id UUID;
BEGIN
    -- Get the enterprise plan ID
    SELECT id INTO enterprise_plan_id 
    FROM subscription_plans 
    WHERE type = 'enterprise' 
    LIMIT 1;
    
    -- Generate a new subscription ID
    subscription_id := uuid_generate_v4();
    
    -- Delete existing subscriptions for this organization
    DELETE FROM organization_subscriptions WHERE organization_id = org_id;
    
    -- Create the new enterprise subscription
    INSERT INTO organization_subscriptions (
        id,
        organization_id, 
        plan_id, 
        status, 
        trial_start_date, 
        trial_end_date,
        current_period_start,
        current_period_end
    ) VALUES (
        subscription_id,
        org_id,
        enterprise_plan_id,
        'active',
        NOW(),
        NOW() + INTERVAL '100 years', -- 100 years = effectively lifetime
        NOW(),
        NOW() + INTERVAL '100 years'
    );
    
    -- Update the organization with the subscription
    UPDATE organizations 
    SET subscription_id = subscription_id
    WHERE id = org_id;
    
    RAISE NOTICE 'Organization % reset to enterprise plan', org_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to give enterprise plan to ALL organizations
CREATE OR REPLACE FUNCTION give_enterprise_to_all_organizations()
RETURNS VOID AS $$
DECLARE
    org_record RECORD;
    enterprise_plan_id UUID;
BEGIN
    -- Get the enterprise plan ID
    SELECT id INTO enterprise_plan_id 
    FROM subscription_plans 
    WHERE type = 'enterprise' 
    LIMIT 1;
    
    -- Loop through all organizations
    FOR org_record IN SELECT id FROM organizations LOOP
        -- Give enterprise plan to this organization
        PERFORM give_enterprise_plan_free(org_record.id);
    END LOOP;
    
    RAISE NOTICE 'Enterprise plan given to ALL organizations!';
END;
$$ LANGUAGE plpgsql;

-- Create a view to see all organizations with their plans
CREATE OR REPLACE VIEW organization_plan_status AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    o.email as organization_email,
    sp.name as plan_name,
    sp.type as plan_type,
    sp.max_users,
    sp.max_patients,
    sp.max_appointments_per_month,
    os.status as subscription_status,
    os.trial_end_date,
    CASE 
        WHEN os.trial_end_date > NOW() THEN 'Trial Active'
        WHEN os.status = 'active' THEN 'Active'
        ELSE 'Expired'
    END as plan_status
FROM organizations o
LEFT JOIN organization_subscriptions os ON o.subscription_id = os.id
LEFT JOIN subscription_plans sp ON os.plan_id = sp.id
ORDER BY o.created_at DESC;

-- Instructions for use:
-- 1. To give enterprise plan to a specific organization:
--    SELECT give_enterprise_plan_free('organization-uuid-here');
--
-- 2. To reset an organization to enterprise plan:
--    SELECT reset_to_enterprise_plan('organization-uuid-here');
--
-- 3. To give enterprise plan to ALL organizations:
--    SELECT give_enterprise_to_all_organizations();
--
-- 4. To see all organizations and their plans:
--    SELECT * FROM organization_plan_status;
