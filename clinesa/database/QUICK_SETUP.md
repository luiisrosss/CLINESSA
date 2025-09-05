# CLINESA - Setup Rápido de Base de Datos

## Instrucciones para Supabase

### 1. Abrir SQL Editor en Supabase
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Abre el **SQL Editor** desde el menú lateral
3. Crea una nueva consulta

### 2. Ejecutar Migraciones (EN ORDEN)

#### Paso 1: Ejecutar Schema de Base de Datos
```sql
-- Para PRODUCCIÓN: Usa 001_initial_schema_production.sql (sin datos de muestra)
-- Para DESARROLLO: Usa 001_initial_schema.sql (con datos de muestra)
-- Copia y pega TODO el contenido del archivo elegido
-- Luego presiona "Run" (Ejecutar)
```
✅ **Resultado esperado**: Tablas creadas, triggers configurados

#### Paso 2: Ejecutar `002_row_level_security.sql`  
```sql
-- Copia y pega TODO el contenido del archivo 002_row_level_security.sql
-- Luego presiona "Run" (Ejecutar)
```
✅ **Resultado esperado**: RLS habilitado, políticas creadas

#### Paso 3: Ejecutar `004_subscription_plans.sql`
```sql
-- Copia y pega TODO el contenido del archivo 004_subscription_plans.sql
-- Luego presiona "Run" (Ejecutar)
```
✅ **Resultado esperado**: Planes de suscripción creados

#### Paso 4: Ejecutar `003_sample_data.sql` (OPCIONAL)
```sql
-- Copia y pega TODO el contenido del archivo 003_sample_data.sql
-- Luego presiona "Run" (Ejecutar)
```
✅ **Resultado esperado**: Datos de ejemplo insertados

### 3. Verificar Instalación

Ejecuta esta consulta para verificar que todo esté correcto:

```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Verificar datos de ejemplo (si los instalaste)
SELECT name FROM organizations;
SELECT email, role FROM users;
SELECT first_name, last_name FROM patients;
```

### 4. Configurar Variables de Entorno

Copia estas variables a tu archivo `.env.local`:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 5. Credenciales de Prueba

Con los datos de ejemplo, puedes usar:
- **Email**: `admin@clinicasanrafael.com`
- **Contraseña**: *(La que configures en Supabase Auth)*

### Solución de Problemas

**❌ Error: "cannot use subquery in check constraint"**
- Este error fue corregido en la versión actual del schema
- El constraint problemático fue reemplazado por un trigger

**❌ Error: "RLS is enabled but no policies"**
- Asegúrate de ejecutar `002_row_level_security.sql` después del schema inicial

**❌ Error: "function auth.uid() does not exist"**
- Esto es normal en desarrollo local, las políticas RLS funcionan en Supabase

### Usuarios de Ejemplo Incluidos

| Email | Rol | Contraseña |
|-------|-----|------------|
| admin@clinicasanrafael.com | admin | *(Configurar en Auth)* |
| dr.martinez@clinicasanrafael.com | doctor | *(Configurar en Auth)* |
| dr.lopez@clinicasanrafael.com | doctor | *(Configurar en Auth)* |
| enfermera.silva@clinicasanrafael.com | nurse | *(Configurar en Auth)* |
| recepcion@clinicasanrafael.com | receptionist | *(Configurar en Auth)* |

### ¡Listo! 🎉

Tu base de datos CLINESA está configurada y lista para usar.