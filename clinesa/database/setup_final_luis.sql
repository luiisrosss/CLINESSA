-- CLINESA - Setup Final para usuario luis.ros.moreno2@gmail.com
-- Este script funciona con las tablas existentes y configura todo correctamente

-- 1. Primero, verificar que existan las tablas necesarias
DO $$
BEGIN
    -- Verificar que exista la tabla organizations
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations') THEN
        RAISE EXCEPTION 'La tabla organizations no existe. Ejecuta primero las migraciones 001 y 002.';
    END IF;
    
    -- Verificar que exista la tabla subscription_plans
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_plans') THEN
        RAISE EXCEPTION 'La tabla subscription_plans no existe. Ejecuta primero la migración 004.';
    END IF;
    
    RAISE NOTICE 'Todas las tablas necesarias existen. Continuando con la configuración...';
END $$;

-- 2. Crear organización para tu usuario
INSERT INTO organizations (name, type, address, phone, email) 
VALUES ('Clínica San Rafael', 'clinic', 'Calle Principal 123, Ciudad', '+1234567890', 'luis.ros.moreno2@gmail.com');

-- 3. Obtener el ID de la organización creada
DO $$
DECLARE
    org_id UUID;
    enterprise_plan_id UUID;
    new_subscription_id UUID;
BEGIN
    -- Obtener el ID de la organización
    SELECT id INTO org_id 
    FROM organizations 
    WHERE email = 'luis.ros.moreno2@gmail.com';
    
    IF org_id IS NULL THEN
        RAISE EXCEPTION 'No se pudo crear la organización. Verifica que la tabla organizations esté configurada correctamente.';
    END IF;
    
    -- Obtener el ID del plan enterprise
    SELECT id INTO enterprise_plan_id 
    FROM subscription_plans 
    WHERE type = 'enterprise' 
    LIMIT 1;
    
    IF enterprise_plan_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el plan enterprise. Verifica que la tabla subscription_plans esté configurada correctamente.';
    END IF;
    
    -- Generar un nuevo ID para la suscripción
    new_subscription_id := gen_random_uuid();
    
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
        new_subscription_id,
        org_id,
        enterprise_plan_id,
        'active',
        NOW(),
        NOW() + INTERVAL '100 years',
        NOW(),
        NOW() + INTERVAL '100 years'
    );
    
    -- Actualizar la organización con el subscription_id
    UPDATE organizations 
    SET subscription_id = new_subscription_id
    WHERE organizations.id = org_id;
    
    RAISE NOTICE '✅ Organización configurada correctamente para luis.ros.moreno2@gmail.com';
    RAISE NOTICE 'Organization ID: %', org_id;
    RAISE NOTICE 'Subscription ID: %', new_subscription_id;
    RAISE NOTICE 'Plan: Enterprise (100 años)';
END $$;

-- 4. Verificar la configuración final
SELECT 
    'CONFIGURACIÓN COMPLETADA' as status,
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

-- 5. Mostrar instrucciones finales
SELECT '🎉 ¡Configuración completada! Ahora puedes iniciar sesión con luis.ros.moreno2@gmail.com' as message;
