-- CLINESA - Deshabilitar RLS para desarrollo
-- Ejecuta este script para que funcione el dashboard

-- Deshabilitar RLS en todas las tablas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS esté deshabilitado
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'users', 'organizations', 'patients', 'appointments', 
    'medical_records', 'medical_history', 'organization_subscriptions', 'subscription_plans'
)
ORDER BY tablename;

-- Mostrar mensaje de confirmación
SELECT '✅ RLS deshabilitado correctamente. El dashboard debería funcionar ahora.' as message;
