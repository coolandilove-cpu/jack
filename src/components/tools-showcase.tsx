"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Candy, Palette, Image, Users, Zap } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    icon: Candy,
    title: "🍭 Candy Studio",
    href: "/gene",
    description: "Create unique Jack Candy with physics engine",
    features: ["Physics-based generation", "Custom colors & sizes", "Save to dashboard", "Wallet integration"],
    color: "from-pink-500 to-rose-500",
    badge: "Core Feature"
  },
  {
    icon: Palette,
    title: "🎨 Creative Studio", 
    href: "/generate",
    description: "Generate Jack expressions + Edit images with advanced tools",
    features: ["32 Jack expressions", "Random generation", "8 color adjustments", "9 preset filters"],
    color: "from-green-500 to-emerald-500",
    badge: "All-in-One"
  },
  {
    icon: Image,
    title: "🖼️ Gallery",
    href: "/gallery", 
    description: "Discover and share community creations",
    features: ["Browse all creations", "Like & share", "Search & filter", "Upload your art"],
    color: "from-blue-500 to-cyan-500",
    badge: "Community"
  },
  {
    icon: Users,
    title: "📊 Dashboard",
    href: "/dashboard",
    description: "Your personal space for saved creations",
    features: ["View your creations", "Analytics & stats", "Profile management", "Wallet required"],
    color: "from-purple-500 to-violet-500",
    badge: "Personal"
  }
]

export default function ToolsShowcase() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Creative
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Jack Liam offers multiple creative tools. Each tool serves a different purpose - choose what fits your creative needs!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground mb-2">
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-3">
                  {tool.description}
                </CardDescription>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {tool.badge}
                </Badge>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-muted-foreground flex items-center">
                      <Zap className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href={tool.href} className="block">
                  <Button 
                    className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 text-white transition-all duration-300 group-hover:shadow-lg`}
                  >
                    Try Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                🚀 Quick Start Guide
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">For Candy Creation:</h4>
                  <p className="text-sm text-muted-foreground">
                    Start with <strong>Candy Studio</strong> to create physics-based Jack Candy. Connect your wallet to save creations.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">For Image Editing:</h4>
                  <p className="text-sm text-muted-foreground">
                    Use <strong>Creative Studio</strong> to generate Jack expressions and edit images with advanced filters.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
