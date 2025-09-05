import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import type { User as DatabaseUser, Organization } from '@/types/database.types'
import { supabase } from '@/lib/supabase'

interface UserWithOrganization extends DatabaseUser {
  organization_id: string
}

interface AuthState {
  user: User | null
  userProfile: DatabaseUser | null
  organization: Organization | null
  session: Session | null
  loading: boolean
  error: string | null
}

interface AuthActions {
  setAuth: (user: User | null, session: Session | null) => void
  setUserProfile: (profile: DatabaseUser | null) => void
  setOrganization: (org: Organization | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  clearAuth: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      userProfile: null,
      organization: null,
      session: null,
      loading: false,
      error: null,

      // Actions
      setAuth: (user, session) => set({ user, session }),
      
      setUserProfile: (userProfile) => set({ userProfile }),
      
      setOrganization: (organization) => set({ organization }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null })
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          if (data.user && data.session) {
            set({ user: data.user, session: data.session })
            
            // Fetch user profile
            const { data: profileData, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (profileError) {
              console.error('Error fetching user profile:', profileError)
            } else if (profileData) {
              const userWithOrg = profileData as UserWithOrganization
              // Fetch organization separately
              const { data: orgData, error: orgError } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', userWithOrg.organization_id)
                .single()

              set({ 
                userProfile: profileData,
                organization: orgError ? null : orgData
              })
            }
          }
        } catch (error) {
          console.error('Sign in error:', error)
          set({ error: error instanceof Error ? error.message : 'Error signing in' })
        } finally {
          set({ loading: false })
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null })
          
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          
          get().clearAuth()
        } catch (error) {
          console.error('Sign out error:', error)
          set({ error: error instanceof Error ? error.message : 'Error signing out' })
        } finally {
          set({ loading: false })
        }
      },

      initialize: async () => {
        try {
          set({ loading: true })
          
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            set({ user: session.user, session })
            
            // Fetch user profile
            const { data: profileData, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (!profileError && profileData) {
              const userWithOrg = profileData as UserWithOrganization
              // Fetch organization separately
              const { data: orgData, error: orgError } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', userWithOrg.organization_id)
                .single()

              set({ 
                userProfile: profileData,
                organization: orgError ? null : orgData
              })
            }
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              set({ user: session.user, session })
            } else if (event === 'SIGNED_OUT') {
              get().clearAuth()
            }
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ error: error instanceof Error ? error.message : 'Error initializing auth' })
        } finally {
          set({ loading: false })
        }
      },

      clearAuth: () => {
        set({
          user: null,
          userProfile: null,
          organization: null,
          session: null,
          error: null
        })
      }
    }),
    {
      name: 'clinesa-auth',
      partialize: (state) => ({
        user: state.user,
        userProfile: state.userProfile,
        organization: state.organization,
        session: state.session
      })
    }
  )
)