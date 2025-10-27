"use client"

import { useMemo, useEffect } from "react"
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { UserService } from "@/lib/user-service"
import { toast } from "sonner"

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css"

interface SolanaWalletProviderProps {
  children: React.ReactNode
}

// Inner component to handle wallet connection events
function WalletConnectionHandler() {
  const { wallet, connected, publicKey, disconnect } = useWallet()

  useEffect(() => {
    if (connected && wallet && publicKey) {
      handleWalletConnect(wallet, publicKey.toString())
    }
  }, [connected, wallet, publicKey])

  const handleWalletConnect = async (wallet: any, walletAddress: string) => {
    console.log('🔗 Wallet connected:', wallet.adapter.name)
    
    // Lưu user vào Supabase khi kết nối ví
    try {
      const walletType = wallet.adapter.name.toLowerCase()
      
      console.log('💾 Saving user to Supabase:', { 
        walletAddress: walletAddress.slice(0, 8) + '...' + walletAddress.slice(-8),
        walletType 
      })
      
      // Validate wallet address
      if (walletAddress.length < 32) {
        throw new Error('Invalid wallet address format')
      }
      
      const user = await UserService.createOrUpdateUser(
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
      
      if (user) {
        console.log('✅ User saved successfully to Supabase:', user.id)
        toast.success('Wallet Connected! 🔗', {
          description: `Welcome to Jack Liam, ${user.profile_data?.username || 'User'}!`,
          duration: 4000
        })
      } else {
        console.warn('⚠️ No user returned from createOrUpdateUser - this might be normal if Supabase is not configured')
        // Don't show error toast if Supabase is not configured
        const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (isSupabaseConfigured) {
          toast.error('Connection Issue', {
            description: 'Wallet connected but failed to save user data to database.',
            duration: 4000
          })
        }
      }
    } catch (error) {
      console.error('💥 Error saving user to Supabase:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Check if Supabase is configured before showing error
      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!isSupabaseConfigured) {
        console.warn('⚠️ Supabase not configured, skipping user save')
        return // Exit silently if Supabase is not configured
      }
      
      toast.error('Connection Error', {
        description: `Failed to save user data: ${errorMessage}`,
        duration: 5000
      })
    }
  }

  return null
}

export default function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({
        // Ensure Phantom wallet prompts for password and confirmation
        network: network,
      })
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={(error) => {
          console.error('Wallet connection error:', error)
          // Don't show toast for disconnect errors as they're expected
          if (error.name !== 'WalletDisconnectedError') {
          toast.error('Wallet Error', {
            description: `Connection failed: ${error.message}`,
            duration: 5000
          })
          }
        }}
        localStorageKey="wallet-adapter"
      >
        <WalletModalProvider>
          <WalletConnectionHandler />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}




