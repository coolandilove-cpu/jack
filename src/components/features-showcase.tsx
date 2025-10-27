"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Zap, Heart, Users, Brain, Globe, Candy, Sparkles, Shuffle } from "lucide-react"

const features = [
  {
    icon: Candy,
    title: "🍭 Candy Studio",
    description: "Create unique Jack Candy with physics engine. Generate colorful candy with realistic physics simulation and save to your dashboard.",
    badge: "Core Feature"
  },
  {
    icon: Shuffle,
    title: "🎨 Creative Studio", 
    description: "Generate Jack expressions AND edit images with advanced color tools. All-in-one creative workspace.",
    badge: "Creative Tools"
  },
  {
    icon: Heart,
    title: "🖼️ Community Gallery",
    description: "Share your creations and discover amazing Jack Candy and edited images from the community. Like, share, and download.",
    badge: "Social"
  },
  {
    icon: Users,
    title: "📊 Personal Dashboard",
    description: "Connect with Phantom Wallet to save your creations and manage your personal dashboard with analytics.",
    badge: "Web3"
  },
  {
    icon: Globe,
    title: "👤 Jack Profile",
    description: "Meet Jack - the alien ambassador from Planet Meme. Interactive 3D profile card with cosmic effects.",
    badge: "Character"
  }
]

export default function FeaturesShowcase() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-accent border-accent">
            Why Choose Jack?
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Creative Features for Digital Art
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Jack brings cutting-edge creative technology to make candy generation and image editing simple, fun, and artistic for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-accent/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-accent transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span>🍭</span>
            <span>Trusted by creative artists worldwide</span>
            <span>🎨</span>
          </div>
        </div>
      </div>
    </section>
  )
}
