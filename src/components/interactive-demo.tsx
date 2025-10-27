"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Code, Image, Zap, CheckCircle } from "lucide-react"

const demoFeatures = [
  {
    id: "generator",
    title: "Meme Generator",
    description: "Create hilarious memes with our AI-powered generator",
    icon: Image,
    code: `// Generate a viral meme
const meme = await jack.generateMeme({
  template: "distracted-boyfriend",
  topText: "My productivity",
  bottomText: "Creating memes with Jack",
  style: "viral"
});

console.log("Meme created:", meme.url);`,
    result: "Meme generated in 0.5s - Ready to go viral! 🚀"
  },
  {
    id: "trending",
    title: "Trending Analysis",
    description: "Get instant insights on what's trending in meme world",
    icon: Zap,
    code: `// Analyze trending memes
const trends = await jack.getTrendingMemes({
  timeframe: "24h",
  category: "comedy",
  platform: "all"
});

console.log("Top trending:", trends.topFormats);`,
    result: "Trends updated - 'Distracted Boyfriend' is trending! 📈"
  },
  {
    id: "comedy",
    title: "Comedy Assistant",
    description: "AI-powered comedy suggestions and punchline generator",
    icon: CheckCircle,
    code: `// Get comedy suggestions
const suggestions = await jack.getComedySuggestions({
  topic: "programming",
  mood: "sarcastic",
  length: "short"
});

console.log("Punchlines:", suggestions.punchlines);`,
    result: "Comedy scan complete - 5 hilarious punchlines generated! 😂"
  }
]

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState("generator")
  const [isExecuting, setIsExecuting] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const handleExecute = () => {
    setIsExecuting(true)
    setShowResult(false)
    
    setTimeout(() => {
      setIsExecuting(false)
      setShowResult(true)
    }, 2000)
  }

  const currentDemo = demoFeatures.find(f => f.id === activeTab) || demoFeatures[0]
  const Icon = currentDemo.icon

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-accent border-accent">
            Try It Live
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience Jack's Comedy Power
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Jack transforms boring content into hilarious, viral memes that make everyone laugh.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo Controls */}
          <div className="space-y-6">
            <Card className="border-border/50 hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  {currentDemo.title}
                </CardTitle>
                <CardDescription>
                  {currentDemo.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="generator" className="text-xs">Generator</TabsTrigger>
                    <TabsTrigger value="trending" className="text-xs">Trending</TabsTrigger>
                    <TabsTrigger value="comedy" className="text-xs">Comedy</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={handleExecute}
                      disabled={isExecuting}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {isExecuting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Generate Meme
                        </>
                      )}
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            {/* Features List */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">What You'll Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Lightning-fast meme generation",
                  "Real-time trending analysis", 
                  "AI-powered comedy suggestions",
                  "Intuitive visual meme builder",
                  "Advanced viral potential analytics"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Code Display */}
          <div className="space-y-4">
            <Card className="border-border/50 hover:border-accent/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Preview
                  </CardTitle>
                  <Badge variant="secondary">JavaScript</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap text-foreground">
                    {currentDemo.code}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Result Display */}
            <Card className={`border-border/50 transition-all duration-500 ${
              showResult ? 'border-green-500/50 bg-green-50/5' : 'hover:border-accent/50'
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Generation Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`rounded-lg p-4 font-mono text-sm transition-all duration-500 ${
                  showResult 
                    ? 'bg-green-50/10 border border-green-500/20 text-green-700 dark:text-green-400' 
                    : 'bg-muted/50 text-muted-foreground'
                }`}>
                  {showResult ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{currentDemo.result}</span>
                    </div>
                  ) : (
                    <span>Click "Generate Meme" to see results...</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Ready to create hilarious memes?</h3>
            <p className="text-muted-foreground">Join thousands of creators who've already gone viral with Jack</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Start Creating Memes
              </Button>
              <Button size="lg" variant="outline">
                Browse Templates
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
