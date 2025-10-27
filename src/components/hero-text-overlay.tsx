import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export default function HeroTextOverlay() {
  return (
    <div className="absolute top-30 md:top-48 left-8 z-10">
      <h1
        className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider mb-3.5 opacity-100"
        style={{
          fontFamily: "var(--font-montserrat)",
          color: "rgb(0, 0, 0)", // Changed from transparent to background color to hide text structure
          WebkitTextStroke: "5px white",
          paintOrder: "stroke fill",
        }}
      >
        JACK
      </h1>
      <p className="text-foreground font-mono text-sm md:text-base max-w-xs tracking-widest lg:text-base mb-8">
        Your Creative
        <br />
        Candy & Image Studio
      </p>
      
      {/* Enhanced CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/generate">
          <Button 
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--accent)/0.5)]"
          >
            Start Creating
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/gallery">
          <Button 
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg border-foreground/20 hover:border-accent/50"
          >
            <Play className="mr-2 h-4 w-4" />
            Browse Gallery
          </Button>
        </Link>
      </div>
      
      {/* Trust Indicators */}
      <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>32 Jack Expressions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Physics Candy Engine</span>
        </div>
      </div>
    </div>
  )
}

