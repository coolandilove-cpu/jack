"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function WalletConnectButton() {
  const { wallet, publicKey, connected } = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!connected) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-2">
          <Wallet className="h-3 w-3" />
          {wallet?.adapter.name}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyAddress}
          className="h-8 px-2"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        {publicKey && formatAddress(publicKey.toString())}
      </div>
      <WalletDisconnectButton className="!bg-destructive hover:!bg-destructive/90 !text-destructive-foreground !rounded-full !px-4 !py-2 !text-sm !font-medium" />
    </div>
  )
}


