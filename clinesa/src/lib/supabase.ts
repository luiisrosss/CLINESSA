import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: Log environment variables in development
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')
}

// Check if we have valid credentials
export const hasValidSupabaseConfig = !!(supabaseUrl && supabaseAnonKey)

// Only create client if we have valid credentials
export const supabase = hasValidSupabaseConfig 
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

export type SupabaseClient = typeof supabase