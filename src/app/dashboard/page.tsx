"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
// Watermark removed
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wallet, 
  Image, 
  Download, 
  Share2, 
  Trash2, 
  Plus,
  TrendingUp,
  Heart,
  Eye,
  Calendar,
  Filter,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
// AdminControlPanel removed - not needed for regular users
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"
import WalletConnectionWrapper from "@/components/wallet-connection-wrapper"
import { MemeData } from "@/lib/meme-storage"
import { useUser } from "@/hooks/use-user"
import UserProfileCard from "@/components/user-profile-card"
import { MemeService } from "@/lib/meme-service"

export default function Dashboard() {
  const { connected, publicKey } = useWallet()
  const { user, loading: userLoading, username, bio } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [userMemes, setUserMemes] = useState<MemeData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load user's memes from Supabase
  useEffect(() => {
    const loadUserMemes = async () => {
      if (connected && publicKey) {
        setIsLoading(true)
        try {
          console.log('Loading user memes from Supabase...')
          const walletAddress = publicKey.toString()
          const supabaseMemes = await MemeService.getUserMemes(walletAddress)
          
          // Convert Supabase memes to dashboard format
          const convertedMemes: MemeData[] = supabaseMemes.map(meme => ({
            id: parseInt(meme.id.replace(/-/g, '').slice(0, 10), 16), // Convert UUID to number
            title: meme.title,
            image: meme.image_base64 || '',
            likes: meme.likes,
            shares: meme.shares,
            downloads: meme.downloads,
            tags: meme.tags,
            author: meme.author_wallet_address,
            createdAt: meme.created_at,
            isLiked: false,
            description: meme.description || undefined
          }))
          
          console.log('Loaded memes from Supabase:', convertedMemes.length)
          setUserMemes(convertedMemes)
        } catch (error) {
          console.error('Error loading memes from Supabase:', error)
          setUserMemes([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setUserMemes([])
        setIsLoading(false)
      }
    }

    loadUserMemes()
  }, [connected, publicKey])

  const filteredMemes = userMemes.filter(meme => {
    const matchesSearch = meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = selectedFilter === "all" || meme.tags.includes(selectedFilter)
    return matchesSearch && matchesFilter
  })

  if (!connected) {
    return (
      <div className="w-full min-h-screen py-0 bg-background">
        <Header />
        
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
          <div className="text-center">
            <div className="mb-8">
              <Wallet className="h-16 w-16 text-accent mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
                Connect Your Wallet
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Connect your wallet to access your personal dashboard and view all the memes you've created with Jack.
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Wallet Connection</CardTitle>
                <CardDescription className="text-center">
                  Connect your Phantom wallet to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <WalletConnectionWrapper />
              </CardContent>
            </Card>

            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <Image className="h-8 w-8 text-accent mx-auto mb-2" />
                  <CardTitle className="text-lg">Your Memes</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    View and manage all the memes you've created
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
                  <CardTitle className="text-lg">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Track views, likes, and downloads of your memes
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Share2 className="h-8 w-8 text-accent mx-auto mb-2" />
                  <CardTitle className="text-lg">Share & Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Share your memes and export them in high quality
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen py-0 bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-montserrat)" }}>
                My Dashboard
              </h1>
              <p className="text-muted-foreground">
                {userLoading ? (
                  "Loading your profile..."
                ) : user ? (
                  `Welcome back, ${username || 'User'}! Here are your created memes.`
                ) : (
                  "Welcome back! Here are your created memes."
                )}
              </p>
              {user && bio && (
                <p className="text-sm text-muted-foreground mt-1">
                  {bio}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Wallet className="h-3 w-3" />
                {publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}` : "Not connected"}
              </Badge>
              <WalletDisconnectButton className="!bg-transparent !border !border-input !text-foreground hover:!bg-accent hover:!text-accent-foreground !rounded-md !px-3 !py-2 !text-sm !font-medium !transition-colors" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Memes</p>
                  <p className="text-2xl font-bold text-foreground">{userMemes.length}</p>
                </div>
                <Image className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userMemes.reduce((sum, meme) => sum + (meme.shares || 0), 0).toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userMemes.reduce((sum, meme) => sum + meme.likes, 0)}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userMemes.reduce((sum, meme) => sum + meme.downloads, 0)}
                  </p>
                </div>
                <Download className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Main Content */}
        <Tabs defaultValue="memes" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="memes">My Memes</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search memes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button asChild>
                <a href="/generate">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </a>
              </Button>
            </div>
          </div>

          <TabsContent value="memes" className="space-y-6">
            {/* Filter Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Filter:</span>
              {["all", "viral", "trending", "classic", "crypto", "funny"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Memes Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading your memes...</div>
              </div>
            ) : filteredMemes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Image className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No memes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first meme using the candy generator!
                </p>
                <Button asChild>
                  <a href="/gene">
                    <Plus className="h-4 w-4 mr-2" />
                    Go to Candy Generator
                  </a>
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMemes.map((meme) => (
                <Card key={meme.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={meme.image}
                        alt={meme.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <Button size="sm" variant="secondary">
                            <Share2 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{meme.title}</h3>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {meme.shares || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {meme.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {meme.downloads}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3" />
                        {new Date(meme.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {meme.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>
                  Detailed insights about your meme performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analytics dashboard coming soon! Track detailed performance metrics for your memes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <UserProfileCard />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
