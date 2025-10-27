"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, Coins, Zap } from "lucide-react"

export default function WalletInfo() {
  const { publicKey, connected } = useWallet()

  // Always return null to hide wallet info completely
  return null

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Wallet className="h-5 w-5 text-green-400" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Address:</span>
          <Badge variant="outline" className="text-xs">
            {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Network:</span>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            Solana Devnet
          </Badge>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>Ready to generate memes on Solana!</span>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          size="sm"
        >
          <Coins className="h-4 w-4 mr-2" />
          Generate with SOL
        </Button>
      </CardContent>
    </Card>
  )
}


