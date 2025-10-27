"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatItem {
  value: number
  label: string
  suffix: string
  prefix?: string
}

const stats: StatItem[] = [
  { value: 50000, label: "Memes Created", suffix: "+" },
  { value: 1000000, label: "Laughs Generated", suffix: "+" },
  { value: 150, label: "Countries", suffix: "+" },
  { value: 24, label: "Comedy", suffix: "/7" }
]

function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }: { 
  end: number, 
  duration?: number, 
  suffix?: string, 
  prefix?: string 
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`counter-${end}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [end])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span id={`counter-${end}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export default function StatsCounter() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Meme Creators Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of creators who trust Jack for their comedy needs
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-accent/50">
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix} 
                    prefix={stat.prefix}
                    duration={2500 + index * 200}
                  />
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All memes operational</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>24/7 comedy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
