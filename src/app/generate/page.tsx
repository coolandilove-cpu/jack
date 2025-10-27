"use client"

import React, { useState, useRef, useCallback } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import JackExpressions from "@/components/jack-expressions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Palette, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Image as ImageIcon,
  Wand2,
  Zap,
  Upload,
  RotateCcw,
  Settings
} from "lucide-react"

const colorAdjustments = [
  { name: "Brightness", key: "brightness", min: -100, max: 100, default: 0 },
  { name: "Contrast", key: "contrast", min: -100, max: 100, default: 0 },
  { name: "Saturation", key: "saturation", min: -100, max: 100, default: 0 },
  { name: "Hue", key: "hue", min: -180, max: 180, default: 0 },
  { name: "Sepia", key: "sepia", min: 0, max: 100, default: 0 },
  { name: "Blur", key: "blur", min: 0, max: 10, default: 0 },
  { name: "Vibrance", key: "vibrance", min: -100, max: 100, default: 0 },
  { name: "Temperature", key: "temperature", min: -100, max: 100, default: 0 }
]

const presetFilters = [
  { name: "Original", values: { brightness: 0, contrast: 0, saturation: 0, hue: 0, sepia: 0, blur: 0, vibrance: 0, temperature: 0 } },
  { name: "Galaxy", values: { brightness: -15, contrast: 30, saturation: 40, hue: -60, sepia: 0, blur: 0, vibrance: 25, temperature: -20 } },
  { name: "Nebula", values: { brightness: -10, contrast: 25, saturation: 50, hue: 120, sepia: 0, blur: 0, vibrance: 30, temperature: -15 } },
  { name: "Cosmic", values: { brightness: -20, contrast: 35, saturation: 35, hue: -120, sepia: 0, blur: 0, vibrance: 20, temperature: -25 } },
  { name: "Vintage", values: { brightness: -10, contrast: 20, saturation: -30, hue: 30, sepia: 50, blur: 0, vibrance: 0, temperature: 0 } },
  { name: "Cool", values: { brightness: 10, contrast: 10, saturation: -20, hue: -30, sepia: 0, blur: 0, vibrance: 0, temperature: 0 } },
  { name: "Warm", values: { brightness: 15, contrast: 15, saturation: 20, hue: 20, sepia: 20, blur: 0, vibrance: 0, temperature: 0 } },
  { name: "Dramatic", values: { brightness: -20, contrast: 40, saturation: 30, hue: 0, sepia: 0, blur: 0, vibrance: 0, temperature: 0 } },
  { name: "Soft", values: { brightness: 20, contrast: -20, saturation: -40, hue: 0, sepia: 0, blur: 1, vibrance: 0, temperature: 0 } }
]

export default function GeneratePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    sepia: 0,
    blur: 0,
    vibrance: 0,
    temperature: 0
  })
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setOriginalImage(result)
        setUploadedImage(result)
        // Reset adjustments when new image is uploaded
        setAdjustments({
          brightness: 0,
          contrast: 0,
          saturation: 0,
          hue: 0,
          sepia: 0,
          blur: 0,
          vibrance: 0,
          temperature: 0
        })
        setSelectedPreset(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const applyFilters = useCallback(() => {
    if (!originalImage) return

    setIsProcessing(true)
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Apply CSS filters with galaxy effects
      const filterString = `
        brightness(${100 + adjustments.brightness}%)
        contrast(${100 + adjustments.contrast}%)
        saturate(${100 + adjustments.saturation}%)
        hue-rotate(${adjustments.hue}deg)
        sepia(${adjustments.sepia}%)
        blur(${adjustments.blur}px)
        saturate(${100 + adjustments.vibrance}%)
        hue-rotate(${adjustments.temperature * 0.5}deg)
      `
      
      ctx.filter = filterString
      ctx.drawImage(img, 0, 0)
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png')
      setUploadedImage(dataUrl)
      setIsProcessing(false)
    }
    
    img.src = originalImage
  }, [originalImage, adjustments])

  const handleAdjustmentChange = (key: string, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const applyPreset = (preset: typeof presetFilters[0]) => {
    // If clicking the same preset, deselect it and reset to original
    if (selectedPreset === preset.name) {
      setSelectedPreset(null)
      setAdjustments({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        hue: 0,
        sepia: 0,
        blur: 0,
        vibrance: 0,
        temperature: 0
      })
    } else {
      // Select new preset and apply its values
      setSelectedPreset(preset.name)
      setAdjustments(preset.values)
    }
  }

  const resetImage = () => {
    if (originalImage) {
      setUploadedImage(originalImage)
      setAdjustments({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        hue: 0,
        sepia: 0,
        blur: 0,
        vibrance: 0,
        temperature: 0
      })
      setSelectedPreset(null)
    }
  }

  const downloadImage = () => {
    if (uploadedImage) {
      const link = document.createElement('a')
      link.download = `edited-image-${Date.now()}.png`
      link.href = uploadedImage
      link.click()
    }
  }

  // Apply filters whenever adjustments change
  React.useEffect(() => {
    if (originalImage) {
      applyFilters()
    }
  }, [originalImage, adjustments, applyFilters])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Palette className="h-4 w-4" />
              Creative Studio
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              🎨 Jack's Creative
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Studio</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Generate unique Jack expressions and edit images with advanced color tools. Create amazing digital art with Jack's creative studio.
            </p>
          </div>

          {/* Jack Gene Generator Section */}
          <div className="mb-12">
            <JackExpressions />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Editor Controls */}
            <div className="space-y-6">
              {/* Upload Section */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Image
                    </Button>
                    {originalImage && (
                      <Button
                        onClick={resetImage}
                        variant="outline"
                        className="w-full border-border/50 text-foreground hover:bg-accent/10"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Original
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preset Filters */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Preset Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {presetFilters.map((preset) => (
                      <Button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        variant="outline"
                        className={`text-xs ${
                          selectedPreset === preset.name
                            ? 'border-green-400 bg-green-400/20 text-green-400 hover:bg-green-400/30'
                            : 'border-border/50 text-foreground hover:bg-accent/10'
                        }`}
                        disabled={!originalImage}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Color Adjustments */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Color Adjustments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {colorAdjustments.map((adjustment) => (
                    <div key={adjustment.key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground text-sm font-medium">{adjustment.name}</span>
                        <span className="text-muted-foreground text-sm">{adjustments[adjustment.key as keyof typeof adjustments]}</span>
                      </div>
                      <input
                        type="range"
                        min={adjustment.min}
                        max={adjustment.max}
                        value={adjustments[adjustment.key as keyof typeof adjustments]}
                        onChange={(e) => handleAdjustmentChange(adjustment.key, parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider accent-green-500"
                        disabled={!originalImage}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Image Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    {uploadedImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={uploadedImage}
                          alt="Edited"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        {isProcessing && (
                          <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                            <RefreshCw className="h-8 w-8 text-foreground animate-spin" />
                          </div>
                        )}
                        <Button
                          onClick={downloadImage}
                          className="absolute top-4 right-4 bg-background/80 hover:bg-background/90 text-foreground"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Upload an image to start editing</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Adjustments Display */}
              {originalImage && (
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Current Adjustments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(adjustments).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground capitalize">{key}</span>
                        <span className="text-foreground font-medium">{value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Custom CSS for green slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-webkit-slider-track {
          background: hsl(var(--muted));
          height: 8px;
          border-radius: 4px;
        }
        
        .slider::-moz-range-track {
          background: hsl(var(--muted));
          height: 8px;
          border-radius: 4px;
          border: none;
        }
      `}</style>
    </div>
  )
}
