"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Image as ImageIcon, Tag, User, Calendar } from "lucide-react"
import { MemeService } from "@/lib/meme-service"
import { useWallet } from "@solana/wallet-adapter-react"
import { toast } from "sonner"

interface MemeUploadProps {
  onUpload?: (meme: any) => void
  onClose?: () => void
}

export default function MemeUpload({ onUpload, onClose }: MemeUploadProps) {
  const { connected, publicKey } = useWallet()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast.error('Missing Information', {
        description: 'Please select a file and enter a title.',
        duration: 4000
      })
      return
    }

    if (!connected || !publicKey) {
      toast.error('Wallet Required', {
        description: 'Please connect your wallet to upload memes.',
        duration: 4000
      })
      return
    }

    setIsUploading(true)
    
    try {
      console.log('📤 Starting meme upload to Supabase...')
      
      const meme = await MemeService.createMemeFromUpload(
        selectedFile,
        title.trim(),
        tags,
        publicKey.toString(),
        description.trim()
      )
      
      if (meme) {
        console.log('✅ Meme uploaded successfully:', meme.id)
        
        // Convert Supabase meme to gallery format
        const galleryMeme = {
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
        }
        
        onUpload?.(galleryMeme)
        
        toast.success('Meme Uploaded! 🎉', {
          description: 'Your meme has been uploaded successfully!',
          duration: 4000
        })
        
        // Reset form
        setSelectedFile(null)
        setPreview(null)
        setTitle("")
        setDescription("")
        setTags([])
        setNewTag("")
        
        onClose?.()
      } else {
        throw new Error('Failed to upload meme to Supabase')
      }
    } catch (error) {
      console.error('💥 Error uploading meme:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      toast.error('Upload Failed', {
        description: `Failed to upload meme: ${errorMessage}`,
        duration: 5000
      })
    } finally {
      setIsUploading(false)
    }
  }

  const suggestedTags = ["candy", "generated", "custom", "jack", "solid", "stripe", "funny", "creative", "art", "meme"]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-accent" />
                Upload Your Candy
              </CardTitle>
              <CardDescription>
                Share your amazing Jack Candy creation with the community
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>Meme Image</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="space-y-4">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click to change image
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Drop your meme here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse files
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Give your meme a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your meme (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggested Tags */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Suggested tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      if (!tags.includes(tag)) {
                        setTags([...tags, tag])
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !title.trim() || isUploading}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Meme
                </>
              )}
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




