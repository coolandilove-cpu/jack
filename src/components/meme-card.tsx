"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, Download } from "lucide-react"

interface MemeCardProps {
  meme: {
    id: number
    title: string
    image: string
    likes: number
    shares: number
    downloads: number
    tags: string[]
    author: string
    createdAt: string
    isLiked: boolean
  }
  onLike: (id: number) => void
  onShare: (meme: any) => void
  onDownload: (meme: any) => void
}

export default function MemeCard({ meme, onLike, onShare, onDownload }: MemeCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-accent/50 h-full">
      <CardHeader className="pb-3">
        <div className="aspect-[4/3] bg-muted rounded-lg mb-4 overflow-hidden">
          <img 
            src={meme.image} 
            alt={meme.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardTitle className="text-xl line-clamp-2 group-hover:text-accent transition-colors mb-2">
          {meme.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
          <span className="truncate">by {meme.author.slice(0, 8)}...{meme.author.slice(-8)}</span>
          <span>•</span>
          <span>{new Date(meme.createdAt).toLocaleDateString()}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {meme.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm px-2 py-1">
              {tag}
            </Badge>
          ))}
          {meme.tags.length > 4 && (
            <Badge variant="secondary" className="text-sm px-2 py-1">
              +{meme.tags.length - 4}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {meme.likes}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              {meme.shares}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {meme.downloads}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            size="default"
            variant={meme.isLiked ? "default" : "outline"}
            onClick={() => onLike(meme.id)}
            className="flex-1 h-10"
          >
            <Heart className={`h-4 w-4 mr-2 ${meme.isLiked ? 'fill-current' : ''}`} />
            {meme.isLiked ? 'Liked' : 'Like'}
          </Button>
          <Button
            size="default"
            variant="outline"
            onClick={() => onShare(meme)}
            className="h-10 w-10 p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="default"
            variant="outline"
            onClick={() => onDownload(meme)}
            className="h-10 w-10 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}




