"use client"

import { useMemo } from "react"
import {
  ConnectionProvider,
  WalletProvider,
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
        onConnect={async (wallet) => {
          console.log('🔗 Wallet connected:', wallet.adapter.name)
          
          // Lưu user vào Supabase khi kết nối ví
          try {
            const publicKey = wallet.adapter.publicKey
            if (!publicKey) {
              console.error('❌ No public key available')
              toast.error('Connection Error', {
                description: 'No public key available from wallet',
                duration: 4000
              })
              return
            }

            const walletAddress = publicKey.toString()
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
              console.error('❌ Failed to save user to Supabase - no user returned')
              toast.error('Connection Issue', {
                description: 'Wallet connected but failed to save user data to database.',
                duration: 4000
              })
            }
          } catch (error) {
            console.error('💥 Error saving user to Supabase:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            
            toast.error('Connection Error', {
              description: `Failed to save user data: ${errorMessage}`,
              duration: 5000
            })
          }
        }}
        onDisconnect={() => {
          console.log('🔌 Wallet disconnected')
          // Clear any cached user data or state if needed
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}


