// CLINESA - Demo Mode (Sin base de datos)
// Usa este archivo temporalmente si no tienes Supabase configurado

export const hasValidSupabaseConfig = false

export const supabase = null

export type SupabaseClient = null

// Función para mostrar mensaje de configuración
export const showConfigMessage = () => {
  console.log(`
🚨 CONFIGURACIÓN REQUERIDA

Para usar CLINESA necesitas configurar Supabase:

1. Crea un archivo .env.local en la raíz del proyecto
2. Agrega tus credenciales de Supabase:
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima

3. Ejecuta las migraciones SQL en Supabase
4. Reinicia la aplicación

Ver: database/QUICK_SETUP.md para instrucciones detalladas
  `)
}
