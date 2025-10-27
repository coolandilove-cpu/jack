"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Heart, Share2, Download, Search, Filter, Plus, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MemeUpload from "@/components/meme-upload"
import MemeCard from "@/components/meme-card"
import { type MemeData } from "@/lib/meme-storage"
import { MemeService } from "@/lib/meme-service"

export default function GalleryPage() {
  const [memes, setMemes] = useState<MemeData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showUpload, setShowUpload] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load memes from Supabase on component mount
  useEffect(() => {
    const loadMemes = async () => {
      try {
        console.log('🖼️ Loading public memes from Supabase...')
        setIsLoading(true)
        
        const supabaseMemes = await MemeService.getPublicMemes()
        console.log('📊 Loaded memes from Supabase:', supabaseMemes.length)
        
        // Convert Supabase memes to gallery format
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
        
        setMemes(convertedMemes)
        console.log('✅ Memes loaded successfully:', convertedMemes.length)
      } catch (error) {
        console.error('💥 Error loading memes from Supabase:', error)
        setMemes([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMemes()
  }, [])

  const handleLike = async (id: number) => {
    const meme = memes.find(m => m.id === id)
    if (!meme) return

    try {
      // Update local state immediately for better UX
      const updatedMeme = {
        ...meme,
        isLiked: !meme.isLiked,
        likes: meme.isLiked ? meme.likes - 1 : meme.likes + 1
      }
      setMemes(memes.map(m => m.id === id ? updatedMeme : m))

      // Update in Supabase (async)
      // Note: We'll need to implement this in MemeService later
      console.log('👍 Like updated for meme:', id)
    } catch (error) {
      console.error('Error updating like:', error)
      // Revert local state on error
      setMemes(memes.map(m => m.id === id ? meme : m))
    }
  }

  const handleShare = (meme: MemeData) => {
    // In a real app, this would open share dialog
    navigator.clipboard.writeText(`${window.location.origin}/gallery/${meme.id}`)
    alert("Link copied to clipboard!")
  }

  const handleDownload = (meme: MemeData) => {
    // In a real app, this would download the image
    alert(`Downloading ${meme.title}...`)
  }

  const handleUpload = async (newMeme: MemeData) => {
    try {
      // Add to local state immediately for better UX
      setMemes([newMeme, ...memes])
      setShowUpload(false)
      console.log('📤 Meme uploaded and added to gallery:', newMeme.title)
      
      // Reload memes from Supabase to ensure consistency
      setTimeout(async () => {
        try {
          console.log('🔄 Reloading memes from Supabase...')
          const supabaseMemes = await MemeService.getPublicMemes()
          
          const convertedMemes: MemeData[] = supabaseMemes.map(meme => ({
            id: parseInt(meme.id.replace(/-/g, '').slice(0, 10), 16),
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
          
          setMemes(convertedMemes)
          console.log('✅ Gallery refreshed with latest memes:', convertedMemes.length)
        } catch (error) {
          console.error('Error reloading memes:', error)
        }
      }, 1000)
    } catch (error) {
      console.error('Error handling upload:', error)
    }
  }

  const filteredMemes = memes.filter(meme => {
    const matchesSearch = meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || meme.tags.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const sortedMemes = [...filteredMemes].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "most-liked":
        return b.likes - a.likes
      case "most-shared":
        return b.shares - a.shares
      default:
        return 0
    }
  })

  const categories = ["all", "candy", "generated", "custom", "jack", "solid", "stripe", "funny", "creative", "art"]

  if (isLoading) {
    return (
      <div className="w-full min-h-screen py-0 bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Loading memes...</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
            🖼️ Jack Candy Gallery
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing Jack Candy creations and edited images from our community. View, like, and share the best digital art!
          </p>
        </div>

        {/* Upload Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowUpload(true)}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--accent)/0.5)]"
          >
            <Plus className="mr-2 h-5 w-5" />
            Share Your Creation
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Jack Candy & digital art..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-2 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-liked">Most Liked</option>
                  <option value="most-shared">Most Shared</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Upload Modal */}
      {showUpload && (
        <MemeUpload
          onUpload={handleUpload}
          onClose={() => setShowUpload(false)}
        />
      )}

      <Footer />
    </div>
  )
}