"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: "Tools", href: "#tools" },
    { name: "Features", href: "#features" },
    { name: "Candy Studio", href: "/gene" },
    { name: "Creative Tools", href: "/generate" },
    { name: "Gallery", href: "/gallery" }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo_xoanennn.png" alt="Jack Logo" width={65} height={24} className="h-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium"
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    e.preventDefault()
                    // If on homepage, scroll to section
                    if (window.location.pathname === '/') {
                      const element = document.querySelector(item.href)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    } else {
                      // If not on homepage, navigate to homepage with hash
                      window.location.href = `/${item.href}`
                    }
                  }
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:block">
              <Button
                variant="outline"
                className="rounded-full px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/gene">
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--accent)/0.5)]"
              >
                Create Candy <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <nav className="flex flex-col gap-4 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium py-2"
                  onClick={(e) => {
                    setIsMenuOpen(false)
                    if (item.href.startsWith('#')) {
                      e.preventDefault()
                      // If on homepage, scroll to section
                      if (window.location.pathname === '/') {
                        const element = document.querySelector(item.href)
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' })
                        }
                      } else {
                        // If not on homepage, navigate to homepage with hash
                        window.location.href = `/${item.href}`
                      }
                    }
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border/50">
                <Link href="/gene" className="block">
                  <Button
                    variant="outline"
                    className="w-full rounded-full mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Candy
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

