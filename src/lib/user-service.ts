import { supabaseClient } from './supabase'
import type { Database } from './supabase'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

export interface UserProfile {
  username?: string
  bio?: string
  avatar?: string
  social_links?: {
    twitter?: string
    discord?: string
    website?: string
  }
  preferences?: {
    theme?: 'light' | 'dark' | 'auto'
    notifications?: boolean
    public_profile?: boolean
  }
}

export class UserService {
  /**
   * Tạo hoặc cập nhật user khi kết nối ví
   */
  static async createOrUpdateUser(
    walletAddress: string,
    walletType: string = 'phantom',
    profileData: UserProfile = {}
  ): Promise<User | null> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, cannot create/update user')
        return null
      }

      console.log('🔄 Creating/updating user:', { walletAddress, walletType })

      // Validate inputs
      if (!walletAddress || walletAddress.trim() === '') {
        throw new Error('Wallet address is required')
      }

      // Kiểm tra user đã tồn tại chưa
      console.log('🔍 Checking if user exists...')
      const { data: existingUser, error: fetchError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching user:', fetchError)
        throw new Error(`Failed to fetch user: ${fetchError.message}`)
      }

      if (existingUser) {
        console.log('👤 User exists, updating...')
        // User đã tồn tại, cập nhật last_active_at và profile_data
        const updateData = {
          last_active_at: new Date().toISOString(),
          profile_data: {
            ...existingUser.profile_data,
            ...profileData
          },
          is_active: true,
          updated_at: new Date().toISOString()
        }

        const { data: updatedUser, error: updateError } = await supabaseClient
          .from('users')
          .update(updateData)
          .eq('wallet_address', walletAddress)
          .select()
          .single()

        if (updateError) {
          console.error('❌ Error updating user:', updateError)
          throw new Error(`Failed to update user: ${updateError.message}`)
        }

        console.log('✅ User updated successfully:', updatedUser.id)
        return updatedUser
      } else {
        console.log('🆕 User does not exist, creating new user...')
        // User chưa tồn tại, tạo mới
        const newUser: UserInsert = {
          wallet_address: walletAddress.trim(),
          wallet_type: walletType.toLowerCase(),
          first_connected_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
          is_active: true,
          profile_data: profileData
        }

        console.log('📝 Inserting new user:', {
          wallet_address: newUser.wallet_address,
          wallet_type: newUser.wallet_type,
          hasProfileData: !!newUser.profile_data
        })

        const { data: createdUser, error: createError } = await supabaseClient
          .from('users')
          .insert(newUser)
          .select()
          .single()

        if (createError) {
          console.error('❌ Error creating user:', createError)
          throw new Error(`Failed to create user: ${createError.message}`)
        }

        console.log('✅ User created successfully:', createdUser.id)
        return createdUser
      }
    } catch (error) {
      console.error('💥 Error in createOrUpdateUser:', {
        error: error instanceof Error ? error.message : error,
        walletAddress,
        walletType
      })
      return null
    }
  }

  /**
   * Lấy thông tin user theo wallet address
   */
  static async getUserByWallet(walletAddress: string): Promise<User | null> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, returning null for user fetch')
        return null
      }

      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()

      if (error) {
        console.error('Error fetching user:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getUserByWallet:', error)
      return null
    }
  }

  /**
   * Cập nhật profile của user
   */
  static async updateUserProfile(
    walletAddress: string,
    profileData: UserProfile
  ): Promise<User | null> {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .update({
          profile_data: profileData,
          last_active_at: new Date().toISOString()
        })
        .eq('wallet_address', walletAddress)
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateUserProfile:', error)
      return null
    }
  }

  /**
   * Lấy danh sách users (cho admin)
   */
  static async getAllUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .order('last_active_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching users:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getAllUsers:', error)
      return []
    }
  }

  /**
   * Lấy thống kê user
   */
  static async getUserStats(walletAddress: string) {
    try {
      // Gọi function get_user_stats từ database
      const { data, error } = await supabaseClient
        .rpc('get_user_stats', { user_wallet: walletAddress })

      if (error) {
        console.error('Error fetching user stats:', error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error('Error in getUserStats:', error)
      return null
    }
  }

  /**
   * Deactivate user (soft delete)
   */
  static async deactivateUser(walletAddress: string): Promise<boolean> {
    try {
      const { error } = await supabaseClient
        .from('users')
        .update({ is_active: false })
        .eq('wallet_address', walletAddress)

      if (error) {
        console.error('Error deactivating user:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deactivateUser:', error)
      return false
    }
  }

  /**
   * Kiểm tra user có tồn tại không
   */
  static async userExists(walletAddress: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single()

      return !error && !!data
    } catch (error) {
      return false
    }
  }
}

// Export default instance
export default UserService
