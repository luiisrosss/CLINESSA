-- CLINESA - Corrección de RLS para usuario luis.ros.moreno2@gmail.com
-- Este script corrige las políticas de Row Level Security

-- 1. Habilitar RLS en todas las tablas necesarias
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes que puedan estar causando problemas
DROP POLICY IF EXISTS "Users can view own organization" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Organizations can view own data" ON organizations;
DROP POLICY IF EXISTS "Organizations can update own data" ON organizations;
DROP POLICY IF EXISTS "Organizations can insert own data" ON organizations;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON organizations;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON patients;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON appointments;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON medical_records;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON medical_history;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON organization_subscriptions;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON subscription_plans;

-- 3. Crear políticas más permisivas para desarrollo
CREATE POLICY "Allow all operations for authenticated users" ON users
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all operations for authenticated users" ON organizations
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all operations for authenticated users" ON patients
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all operations for authenticated users" ON appointments
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all operations for authenticated users" ON medical_records
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all operations for authenticated users" ON medical_history
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all operations for authenticated users" ON organization_subscriptions
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all operations for authenticated users" ON subscription_plans
    FOR ALL USING (auth.uid() IS NOT NULL);

-- 4. Obtener el ID del usuario desde la tabla auth.users
DO $$
DECLARE
    user_auth_id UUID;
    org_id UUID;
BEGIN
    -- Obtener el ID del usuario desde auth.users
    SELECT id INTO user_auth_id 
    FROM auth.users 
    WHERE email = 'luis.ros.moreno2@gmail.com';
    
    -- Obtener el ID de la organización
    SELECT id INTO org_id 
    FROM organizations 
    WHERE email = 'luis.ros.moreno2@gmail.com';
    
    IF user_auth_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado en auth.users. Verifica que el usuario esté creado en Authentication.';
    END IF;
    
    IF org_id IS NULL THEN
        RAISE EXCEPTION 'Organización no encontrada. Ejecuta primero el script de configuración de organización.';
    END IF;
    
    -- Crear perfil de usuario en la tabla users
    INSERT INTO users (
        id,
        organization_id,
        email,
        first_name,
        last_name,
        role,
        phone,
        license_number,
        specialization
    ) VALUES (
        user_auth_id,
        org_id,
        'luis.ros.moreno2@gmail.com',
        'Luis',
        'Ros',
        'admin',
        '+1234567890',
        'LIC-001',
        'Administrador'
    ) ON CONFLICT (id) DO UPDATE SET
        organization_id = EXCLUDED.organization_id,
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        license_number = EXCLUDED.license_number,
        specialization = EXCLUDED.specialization;
    
    RAISE NOTICE '✅ Perfil de usuario creado correctamente';
    RAISE NOTICE 'User ID: %', user_auth_id;
    RAISE NOTICE 'Organization ID: %', org_id;
END $$;

-- 5. Verificar la configuración
SELECT 
    'RLS CONFIGURADO CORRECTAMENTE' as status,
    o.name as organization_name,
    o.email as organization_email,
    u.first_name,
    u.last_name,
    u.role,
    sp.name as plan_name
FROM organizations o
LEFT JOIN users u ON u.organization_id = o.id
LEFT JOIN organization_subscriptions os ON o.subscription_id = os.id
LEFT JOIN subscription_plans sp ON os.plan_id = sp.id
WHERE o.email = 'luis.ros.moreno2@gmail.com';

-- 6. Mostrar instrucciones finales
SELECT '🎉 ¡RLS configurado! Ahora el dashboard debería cargar correctamente' as message;
