"use client"

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { UserService, type UserProfile } from '@/lib/user-service'
import type { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']

export function useUser() {
  const { connected, publicKey, wallet } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user data when wallet connects
  useEffect(() => {
    const loadUser = async () => {
      if (!connected || !publicKey) {
        console.log('🔌 Wallet not connected, clearing user data')
        setUser(null)
        setLoading(false)
        return
      }

      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('⚠️ Supabase not configured, skipping user data loading')
        setUser(null)
        setLoading(false)
        return
      }

      console.log('🔄 Loading user data for wallet:', publicKey.toString().slice(0, 8) + '...')
      setLoading(true)
      setError(null)

      try {
        const walletAddress = publicKey.toString()
        console.log('🔍 Fetching user from Supabase...')
        
        const userData = await UserService.getUserByWallet(walletAddress)
        
        if (userData) {
          console.log('✅ User found in database:', userData.id)
          setUser(userData)
        } else {
          console.log('👤 User not found, creating new user...')
          // User not found, create new one
          const walletType = wallet?.adapter.name.toLowerCase() || 'phantom'
          const newUser = await UserService.createOrUpdateUser(
            walletAddress,
            walletType,
            {
              username: `user_${walletAddress.slice(0, 8)}`,
              bio: `Jack Liam user since ${new Date().toLocaleDateString()}`,
              preferences: {
                theme: 'dark',
                notifications: true,
                public_profile: true
              }
            }
          )
          
          if (newUser) {
            console.log('✅ New user created:', newUser.id)
            setUser(newUser)
          } else {
            console.error('❌ Failed to create new user')
            setError('Failed to create user')
          }
        }
      } catch (err) {
        console.error('💥 Error loading user:', err)
        // Don't set error for wallet disconnect as it's expected
        if (err instanceof Error && !err.message.includes('disconnect')) {
          setError('Failed to load user data')
        }
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [connected, publicKey, wallet])

  // Update user profile
  const updateProfile = async (profileData: UserProfile) => {
    if (!user || !publicKey) return false

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('⚠️ Supabase not configured, cannot update profile')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const updatedUser = await UserService.updateUserProfile(
        publicKey.toString(),
        profileData
      )

      if (updatedUser) {
        setUser(updatedUser)
        return true
      } else {
        setError('Failed to update profile')
        return false
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Get user stats
  const getUserStats = async () => {
    if (!publicKey) return null

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('⚠️ Supabase not configured, cannot get user stats')
      return null
    }

    try {
      return await UserService.getUserStats(publicKey.toString())
    } catch (err) {
      console.error('Error getting user stats:', err)
      return null
    }
  }

  // Check if user exists
  const checkUserExists = async () => {
    if (!publicKey) return false

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('⚠️ Supabase not configured, cannot check user existence')
      return false
    }

    try {
      return await UserService.userExists(publicKey.toString())
    } catch (err) {
      console.error('Error checking user existence:', err)
      return false
    }
  }

  return {
    user,
    loading,
    error,
    connected,
    publicKey,
    wallet,
    updateProfile,
    getUserStats,
    checkUserExists,
    // Helper properties
    isLoggedIn: connected && !!user,
    walletAddress: publicKey?.toString() || null,
    username: user?.profile_data?.username || null,
    bio: user?.profile_data?.bio || null,
    preferences: user?.profile_data?.preferences || null
  }
}
