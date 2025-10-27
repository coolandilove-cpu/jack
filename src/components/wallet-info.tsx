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
}


