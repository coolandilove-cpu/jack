"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Meme Creator",
    company: "ViralContent Co",
    avatar: "/placeholder-user.jpg",
    content: "Jack has revolutionized how I create memes! The AI-powered generator has helped me create viral content that got 1M+ views. Absolutely hilarious!",
    rating: 5,
    badge: "Viral Creator"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Content Creator",
    company: "ComedyCentral",
    avatar: "/placeholder-user.jpg",
    content: "The meme collaboration features are incredible. My team can now work together to create the perfect punchline. Jack makes comedy so easy!",
    rating: 5,
    badge: "Team Player"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Social Media Manager",
    company: "FunnyBrands Inc",
    avatar: "/placeholder-user.jpg",
    content: "Jack's meme database is a goldmine! I can find trending formats instantly and create content that actually makes people laugh. Game changer!",
    rating: 5,
    badge: "Social Media Pro"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Meme Artist",
    company: "Freelancer",
    avatar: "/placeholder-user.jpg",
    content: "As a solo creator, Jack's simplicity and humor are perfect. I can focus on being funny instead of figuring out complex tools. Pure comedy gold!",
    rating: 5,
    badge: "Solo Creator"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Comedy Writer",
    company: "LaughTrack Studio",
    avatar: "/placeholder-user.jpg",
    content: "The AI comedy assistant is brilliant! It helps me craft perfect punchlines and suggests trending formats. Jack's humor is always on point!",
    rating: 5,
    badge: "Comedy Writer"
  }
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-accent border-accent">
            What Our Users Say
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Loved by Meme Creators Everywhere
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real creators have to say about their hilarious experience with Jack.
          </p>
        </div>

        <div className="relative">
          <Card className="max-w-4xl mx-auto border-border/50 hover:border-accent/50 transition-all duration-300">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < currentTestimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed text-foreground">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* User Info */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentTestimonial.avatar} alt={currentTestimonial.name} />
                    <AvatarFallback className="text-lg">
                      {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                    <div className="font-semibold text-lg">{currentTestimonial.name}</div>
                    <div className="text-muted-foreground">{currentTestimonial.role}</div>
                    <div className="text-sm text-muted-foreground">{currentTestimonial.company}</div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {currentTestimonial.badge}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-border/50 hover:border-accent/50"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-border/50 hover:border-accent/50"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-accent scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => goToTestimonial(index)}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/50'}`}></div>
            <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
