"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, Zap, Database, Users } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubscribed(true)
      setEmail("")
    }, 2000)
  }

  const benefits = [
    {
      icon: Zap,
      title: "Weekly Meme Tips",
      description: "Get the latest viral meme creation techniques"
    },
    {
      icon: Database,
      title: "Trending Updates",
      description: "Be the first to know about new meme formats"
    },
    {
      icon: Users,
      title: "Community Access",
      description: "Join our exclusive meme creator community"
    }
  ]

  if (isSubscribed) {
    return (
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="p-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/50">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">
                Welcome to the Jack Meme Community!
              </h2>
              <p className="text-lg text-green-700 dark:text-green-300 mb-6">
                Thank you for subscribing! You'll receive your first hilarious newsletter within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/50"
                  onClick={() => setIsSubscribed(false)}
                >
                  Subscribe Another Email
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Create Memes Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <Badge variant="outline" className="mb-4 text-accent border-accent">
                Stay Updated
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Never Miss a Viral Meme
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join our newsletter and get exclusive access to meme tips, trending formats, 
                and comedy insights delivered straight to your inbox.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-accent/10 flex-shrink-0">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Newsletter Form */}
          <Card className="border-border/50 hover:border-accent/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent" />
                Subscribe to Our Meme Newsletter
              </CardTitle>
              <CardDescription>
                Get weekly comedy insights and viral updates from the Jack team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </form>

              {/* Social Proof */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>10,000+ meme creators</span>
                  </div>
                  <div className="w-px h-4 bg-border"></div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No spam, only laughs</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
