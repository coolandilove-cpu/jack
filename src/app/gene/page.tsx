import CandyGenerator from "@/components/candy-generator"
import SolanaWalletProvider from "@/components/solana-wallet-provider"

export default function GenePage() {
  return (
    <SolanaWalletProvider>
      <CandyGenerator />
    </SolanaWalletProvider>
  )
}



