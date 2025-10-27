"use client"

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

export default function WalletConnectionWrapper() {
  const [isLoading, setIsLoading] = useState(true)
  const { connected, connecting, disconnecting } = useWallet()

  useEffect(() => {
    // Wait for wallet adapter to initialize
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-12 w-full bg-accent text-accent-foreground rounded-lg font-medium">
        Loading wallet...
      </div>
    )
  }

  if (connecting) {
    return (
      <div className="flex items-center justify-center h-12 w-full bg-accent text-accent-foreground rounded-lg font-medium">
        Connecting...
      </div>
    )
  }

  if (disconnecting) {
    return (
      <div className="flex items-center justify-center h-12 w-full bg-accent text-accent-foreground rounded-lg font-medium">
        Disconnecting...
      </div>
    )
  }

  return (
    <WalletMultiButton 
      className="!w-full !h-12 !bg-accent hover:!bg-accent/90 !text-accent-foreground !rounded-lg !font-medium !transition-all !duration-300 hover:!scale-105 hover:!shadow-[0_0_20px_hsl(var(--accent)/0.5)]"
    />
  )
}