import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if environment variables are properly set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables not set. Please create a .env.local file with:')
  console.warn('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable automatic session refresh for wallet-based auth
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})

// Database types (matching our SQL schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          wallet_type: string
          first_connected_at: string
          last_active_at: string
          is_active: boolean
          profile_data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          wallet_type?: string
          first_connected_at?: string
          last_active_at?: string
          is_active?: boolean
          profile_data?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          wallet_type?: string
          first_connected_at?: string
          last_active_at?: string
          is_active?: boolean
          profile_data?: any
          created_at?: string
          updated_at?: string
        }
      }
      memes: {
        Row: {
          id: string
          title: string
          image_url: string | null
          image_base64: string | null
          likes: number
          shares: number
          downloads: number
          tags: string[]
          author_wallet_address: string
          description: string | null
          is_public: boolean
          is_featured: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          image_url?: string | null
          image_base64?: string | null
          likes?: number
          shares?: number
          downloads?: number
          tags?: string[]
          author_wallet_address: string
          description?: string | null
          is_public?: boolean
          is_featured?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          image_url?: string | null
          image_base64?: string | null
          likes?: number
          shares?: number
          downloads?: number
          tags?: string[]
          author_wallet_address?: string
          description?: string | null
          is_public?: boolean
          is_featured?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_interactions: {
        Row: {
          id: string
          user_wallet_address: string
          meme_id: string
          interaction_type: 'like' | 'share' | 'download' | 'view'
          created_at: string
        }
        Insert: {
          id?: string
          user_wallet_address: string
          meme_id: string
          interaction_type: 'like' | 'share' | 'download' | 'view'
          created_at?: string
        }
        Update: {
          id?: string
          user_wallet_address?: string
          meme_id?: string
          interaction_type?: 'like' | 'share' | 'download' | 'view'
          created_at?: string
        }
      }
    }
  }
}

// Typed Supabase client
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})




