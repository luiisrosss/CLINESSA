-- CLINESA - Setup para usuario luis.ros.moreno2@gmail.com
-- Este script configura todo lo necesario para que puedas iniciar sesión

-- 1. Crear organización para tu usuario
INSERT INTO organizations (name, type, address, phone, email) VALUES 
(
    'Clínica San Rafael',
    'clinic',
    'Calle Principal 123, Ciudad',
    '+1234567890',
    'luis.ros.moreno2@gmail.com'
) ON CONFLICT DO NOTHING;

-- 2. Obtener el ID de la organización creada
DO $$
DECLARE
    org_id UUID;
    enterprise_plan_id UUID;
    subscription_id UUID;
BEGIN
    -- Obtener el ID de la organización
    SELECT id INTO org_id 
    FROM organizations 
    WHERE email = 'luis.ros.moreno2@gmail.com';
    
    -- Obtener el ID del plan enterprise
    SELECT id INTO enterprise_plan_id 
    FROM subscription_plans 
    WHERE type = 'enterprise' 
    LIMIT 1;
    
    -- Generar un nuevo ID para la suscripción
    subscription_id := gen_random_uuid();
    
    -- Crear suscripción enterprise para la organización
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
        NOW() + INTERVAL '100 years', -- 100 años = efectivamente de por vida
        NOW(),
        NOW() + INTERVAL '100 years'
    ) ON CONFLICT DO UPDATE SET
        plan_id = enterprise_plan_id,
        status = 'active',
        trial_end_date = NOW() + INTERVAL '100 years',
        current_period_end = NOW() + INTERVAL '100 years';
    
    -- Actualizar la organización con el subscription_id
    UPDATE organizations 
    SET subscription_id = subscription_id
    WHERE id = org_id;
    
    RAISE NOTICE 'Organización configurada correctamente para luis.ros.moreno2@gmail.com';
    RAISE NOTICE 'Organization ID: %', org_id;
    RAISE NOTICE 'Subscription ID: %', subscription_id;
END $$;

-- 3. Crear perfil de usuario en la tabla users (esto se hace automáticamente cuando inicies sesión)
-- Pero podemos crear uno manualmente si es necesario

-- 4. Verificar que todo esté configurado correctamente
SELECT 
    o.name as organization_name,
    o.email as organization_email,
    sp.name as plan_name,
    sp.type as plan_type,
    sp.max_users,
    sp.max_patients,
    sp.max_appointments_per_month,
    os.status as subscription_status,
    os.trial_end_date
FROM organizations o
LEFT JOIN organization_subscriptions os ON o.subscription_id = os.id
LEFT JOIN subscription_plans sp ON os.plan_id = sp.id
WHERE o.email = 'luis.ros.moreno2@gmail.com';

-- 5. Mostrar instrucciones
SELECT 'Configuración completada. Ahora puedes iniciar sesión con luis.ros.moreno2@gmail.com' as message;
