-- CLINESA - Quick Admin Setup (Ejecutar esto para tener plan Enterprise gratis)
-- Copia y pega esto en el SQL Editor de Supabase

-- 1. Dar plan Enterprise a TODAS las organizaciones existentes
UPDATE organization_subscriptions 
SET 
    status = 'active',
    trial_end_date = NOW() + INTERVAL '100 years',
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '100 years'
WHERE plan_id = (
    SELECT id FROM subscription_plans WHERE type = 'enterprise' LIMIT 1
);

-- 2. Si no hay suscripciones, crear una para cada organización
INSERT INTO organization_subscriptions (
    organization_id,
    plan_id,
    status,
    trial_start_date,
    trial_end_date,
    current_period_start,
    current_period_end
)
SELECT 
    o.id,
    sp.id,
    'active',
    NOW(),
    NOW() + INTERVAL '100 years',
    NOW(),
    NOW() + INTERVAL '100 years'
FROM organizations o
CROSS JOIN subscription_plans sp
WHERE sp.type = 'enterprise'
AND NOT EXISTS (
    SELECT 1 FROM organization_subscriptions os 
    WHERE os.organization_id = o.id
);

-- 3. Actualizar organizaciones con sus subscription_id
UPDATE organizations 
SET subscription_id = os.id
FROM organization_subscriptions os
WHERE organizations.id = os.organization_id
AND os.plan_id = (SELECT id FROM subscription_plans WHERE type = 'enterprise' LIMIT 1);

-- 4. Verificar que todo esté correcto
SELECT 
    o.name as "Organización",
    sp.name as "Plan",
    sp.type as "Tipo",
    sp.max_users as "Max Usuarios",
    sp.max_patients as "Max Pacientes",
    os.status as "Estado",
    CASE 
        WHEN os.trial_end_date > NOW() + INTERVAL '50 years' THEN '✅ LIFETIME'
        WHEN os.trial_end_date > NOW() THEN '✅ Trial Activo'
        ELSE '❌ Expirado'
    END as "Estado del Plan"
FROM organizations o
LEFT JOIN organization_subscriptions os ON o.subscription_id = os.id
LEFT JOIN subscription_plans sp ON os.plan_id = sp.id
ORDER BY o.created_at DESC;

-- ¡Listo! Ahora todas tus organizaciones tienen plan Enterprise gratis por 100 años
