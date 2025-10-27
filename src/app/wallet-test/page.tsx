"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import WalletConnectionTest from "@/components/wallet-connection-test"

export default function WalletTestPage() {
  return (
    <div className="w-full min-h-screen py-0 bg-background">
      <Header />
      
      <div className="pt-24 pb-8">
        <WalletConnectionTest />
      </div>

      <Footer />
    </div>
  )
}






