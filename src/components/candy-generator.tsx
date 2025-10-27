"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, Download, Menu, X, Home, User, Save } from "lucide-react"
import Matter from "matter-js"
import CandyPreviewIcon from "./candy-preview-icon"
import Link from "next/link"
import WalletConnectButton from "@/components/wallet-connect-button"
import WalletInfo from "@/components/wallet-info"
import { useWallet } from "@solana/wallet-adapter-react"
import { saveCandyToMeme, saveCandyToSupabase, generateCandyTitle, generateCandyTags } from "@/lib/candy-to-meme"
import { toast } from "sonner"
import { runAllTests } from "@/lib/supabase-test"

// Extend Matter.js Body type to include our custom candyData property
declare module "matter-js" {
  interface Body {
    candyData?: {
      iconType: string
      primaryColor: string
      secondaryColor?: string
      baseColor: string
      outlineType: "solid" | "oneColorStripe" | "biColorStripe"
    }
  }
}

interface CandyType {
  id: string
  name: string
  outlineType: "solid" | "oneColorStripe" | "biColorStripe"
  primaryColor: string
  secondaryColor?: string
  baseColor: string
  design: string
  count: number
}

const colorOptions = [
  { name: "Red", value: "#FF4949", flavor: "Apple" },
  { name: "Blue", value: "#6277EF", flavor: "Lime" },
  { name: "Yellow", value: "#F3FF51", flavor: "Pineapple" },
  { name: "Green", value: "#1DED83", flavor: "Kiwi" },
  { name: "Orange", value: "#FFA947", flavor: "Orange" },
  { name: "Purple", value: "#9D2D99", flavor: "Grape" },
  { name: "Pink", value: "#F5789A", flavor: "Peach" },
  { name: "Cyan", value: "#6AE3F8", flavor: "Mint" },
  { name: "Dark Gray", value: "#2D363A", flavor: "Raspberry" },
  { name: "White", value: "#FFFFFF", flavor: "Milk" },
]

const outlineTypeOptions = [
  { name: "Single Color", value: "solid" as const },
  { name: "Single Stripe", value: "oneColorStripe" as const },
  { name: "Two-Tone Stripe", value: "biColorStripe" as const },
]

const designOptions = [
  { name: "Liam Logo", icon: null, value: "liam-logo", imagePath: "/icons/liam-logo.png" },
  { name: "Jack", icon: null, value: "jack", imagePath: "/icons/jack.png" },
  { name: "Liam Text", icon: null, value: "liam-logotype", imagePath: "/icons/liam-logotype.png" },
  { name: "Star", icon: null, value: "star", imagePath: "/icons/star.png" },
  { name: "Planet", icon: null, value: "planet", imagePath: "/icons/planet.png" },
  { name: "Sunny", icon: null, value: "sunny", imagePath: "/icons/sunny.jpg" },
  { name: "thuoc", icon: null, value: "thuoc", imagePath: "/icons/thuoc.png" },
  { name: "thuoc2", icon: null, value: "thuoc2", imagePath: "/icons/thuoc2.png" },
  { name: "Jack Sunny", icon: null, value: "jack-sunny", imagePath: "/icons/jack-sunny.png" },
  { name: "thuoc3", icon: null, value: "thuoc3", imagePath: "/icons/thuoc3.png" },
  { name: "thuoc4", icon: null, value: "thuoc4", imagePath: "/icons/thuoc4.png" },
  { name: "thuoc5", icon: null, value: "thuoc5", imagePath: "/icons/thuoc5.png" },
  { name: "thuoc6", icon: null, value: "thuoc6", imagePath: "/icons/thuoc6.png" },
  { name: "trustmebro", icon: null, value: "trustmebro", imagePath: "/icons/trustmebro.png" },
  { name: "trustmebro2", icon: null, value: "trustmebro2", imagePath: "/icons/trustmebro2.png" },
]

const CandyGenerator = () => {
  const { connected, publicKey } = useWallet()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [candyTypes, setCandyTypes] = useState<CandyType[]>([
    {
      id: "1",
      name: "Candy Type A",
      outlineType: "solid",
      primaryColor: "#10B981",
      baseColor: "#1F2937",
      design: "jack",
      count: 5,
    },
  ])
  const [selectedCandy, setSelectedCandy] = useState<string>("1")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map())
  const [highlightTexture, setHighlightTexture] = useState<HTMLImageElement | null>(null)
  const [highlightTextureLoaded, setHighlightTextureLoaded] = useState(false)
  const [zipbagBackground, setZipbagBackground] = useState<HTMLImageElement | null>(null)
  const [zipbagBackgroundLoaded, setZipbagBackgroundLoaded] = useState(false)
  const [allImagesLoaded, setAllImagesLoaded] = useState(false)

  // Helper function to get the correct asset path for both v0 and local environments
  const getAssetPath = (path: string) => {
    // In v0 environment, we need to use the full path
    // In local environment, the path should work as-is
    return path
  }

  // Check if all required images are loaded
  const checkAllImagesLoaded = () => {
    const requiredDesigns = designOptions.map((d) => d.value)
    const allDesignsLoaded = requiredDesigns.every((design) => loadedImages.has(design))

    if (highlightTextureLoaded && zipbagBackgroundLoaded && allDesignsLoaded) {
      setAllImagesLoaded(true)
    }
  }

  // Preload zipbag background using public path
  const preloadZipbagBackground = () => {
    const img = new Image()

    img.onload = () => {
      setZipbagBackground(img)
      setZipbagBackgroundLoaded(true)
    }

    img.onerror = (error) => {
      console.error("Failed to load zipbag background:", error)
      setZipbagBackgroundLoaded(false)
    }

    img.crossOrigin = "anonymous"
    img.src = getAssetPath("/backgrounds/zipbag.png")
  }

  // Preload highlight texture using public path
  const preloadHighlightTexture = () => {
    const img = new Image()

    img.onload = () => {
      // 画像が完全に読み込まれたことを確認
      if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        setHighlightTexture(img)
        setHighlightTextureLoaded(true)
      }
    }

    img.onerror = (error) => {
      console.error("Failed to load highlight texture:", error)
      setHighlightTextureLoaded(false)
    }

    img.crossOrigin = "anonymous"
    img.src = getAssetPath("/textures/highlight.png")
  }

  // Preload design images with better error handling
  const preloadDesignImages = () => {
    const allDesigns = [...designOptions]

    allDesigns.forEach((design) => {
      if (design.imagePath && !imageCache.has(design.value)) {
        const img = new Image()

        img.onload = () => {
          // Update imageCache using setState for React re-rendering
          setImageCache((prev) => {
            const newCache = new Map(prev)
            newCache.set(design.value, img)
            return newCache
          })

          setLoadedImages((prev) => {
            const newSet = new Set([...prev, design.value])
            return newSet
          })

          // Force multiple re-renders after image loads to ensure display
          if (engineRef.current) {
            for (let i = 0; i < 5; i++) {
              setTimeout(() => {
                if (engineRef.current) {
                  Matter.Engine.update(engineRef.current, 16)
                }
              }, i * 100)
            }
          }
        }

        img.onerror = (error) => {
          console.warn(`Failed to load image: ${design.imagePath}`)
          setFailedImages((prev) => new Set([...prev, design.value]))
        }

        // Remove crossOrigin for same-domain public assets to prevent CORS issues in v0
        // img.crossOrigin = "anonymous" // Removed for public/icons/*.png
        setTimeout(() => {
          img.src = getAssetPath(design.imagePath!)
        }, 100)
      }
    })
  }

  // Draw radial stripes - 放射状ストライプを描画
  const drawRadialStripes = (ctx: CanvasRenderingContext2D, radius: number, candyData: any) => {
    const { outlineType, primaryColor, secondaryColor } = candyData

    if (outlineType === "solid") {
      // ソリッドの場合は単純な円を描画
      ctx.strokeStyle = primaryColor
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.stroke()
      return
    }

    const outerRadius = radius + 2.5
    const stripeCount = 16 // 放射状ストライプの数
    const angleStep = (Math.PI * 2) / stripeCount

    for (let i = 0; i < stripeCount; i++) {
      const startAngle = i * angleStep
      const endAngle = (i + 1) * angleStep

      // 交互の色を選択
      let fillColor
      if (outlineType === "oneColorStripe") {
        fillColor = i % 2 === 0 ? primaryColor : "#FFFFFF"
      } else if (outlineType === "biColorStripe") {
        fillColor = i % 2 === 0 ? primaryColor : secondaryColor || primaryColor
      } else {
        fillColor = primaryColor
      }

      ctx.fillStyle = fillColor
      ctx.beginPath()
      ctx.moveTo(0, 0) // 中心点から開始
      ctx.arc(0, 0, outerRadius, startAngle, endAngle)
      ctx.lineTo(0, 0) // 中心点に戻る
      ctx.closePath()
      ctx.fill()
    }

    // 内側の円で基本色を復元（ベースカラーが見えるように）
    ctx.fillStyle = candyData.baseColor
    ctx.beginPath()
    ctx.arc(0, 0, radius - 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw base color (background) - 修正して原点基準で描画
  const drawBaseColor = (ctx: CanvasRenderingContext2D, radius: number, baseColor: string) => {
    ctx.fillStyle = baseColor
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw highlight texture - より厳密な読み込み状態チェック
  const drawHighlightTexture = (ctx: CanvasRenderingContext2D, radius: number) => {
    // 厳密な読み込み状態チェック
    if (!highlightTextureLoaded || !highlightTexture) {
      return
    }

    // 画像の完全性を確認
    if (!highlightTexture.complete || highlightTexture.naturalWidth === 0 || highlightTexture.naturalHeight === 0) {
      return
    }

    // Save current composite operation
    const originalCompositeOperation = ctx.globalCompositeOperation

    // Set blend mode to screen for candy-like highlight effect
    ctx.globalCompositeOperation = "screen"

    // キャンディのサイズに合わせてテクスチャサイズを調整
    const textureSize = radius * 2.5

    // Create circular clipping path for the candy
    ctx.save()

    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.clip()

    try {
      // Draw the highlight texture centered at origin
      ctx.drawImage(highlightTexture, -textureSize / 2, -textureSize / 2, textureSize, textureSize)
    } catch (error) {
      console.error("Error drawing highlight texture:", error)
    }

    ctx.restore()

    // Restore original composite operation
    ctx.globalCompositeOperation = originalCompositeOperation
  }

  // Icon drawing functions - 修正して原点基準で描画
  const drawIcon = (ctx: CanvasRenderingContext2D, iconType: string, size: number) => {
    // Check if it's a PNG icon and if it's loaded (カスタムデザインも含める)
    const allDesigns = [...designOptions]
    const design = allDesigns.find((d) => d.value === iconType)

    if (design?.imagePath && imageCache.has(iconType)) {
      try {
        const img = imageCache.get(iconType)!

        // Try to draw the image even if it's not fully loaded yet
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          ctx.save() // 座標系を保存
          const scale = size / Math.max(img.naturalWidth, img.naturalHeight)
          ctx.scale(scale, scale)

          // Draw PNG images with their original colors (no color overlay)
          ctx.globalCompositeOperation = "source-over"
          ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
          ctx.restore() // 座標系を復元
        } else {
          // Image not ready yet, trigger a retry on next frame
          requestAnimationFrame(() => {
            if (engineRef.current) {
              Matter.Engine.update(engineRef.current, 16)
            }
          })
          drawFallbackIcon(ctx, iconType, size, "#FFFFFF")
        }
      } catch (error) {
        console.warn(`Error drawing image for ${iconType}:`, error)
        drawFallbackIcon(ctx, iconType, size, "#FFFFFF")
      }
    } else if (design?.imagePath && !imageCache.has(iconType)) {
      // Image not loaded yet, trigger retry
      requestAnimationFrame(() => {
        if (engineRef.current) {
          Matter.Engine.update(engineRef.current, 16)
        }
      })
      drawFallbackIcon(ctx, iconType, size, "#FFFFFF")
    } else {
      // Draw built-in icons or fallback
      drawFallbackIcon(ctx, iconType, size, "#FFFFFF")
    }
  }

  const drawFallbackIcon = (ctx: CanvasRenderingContext2D, iconType: string, size: number, color: string) => {
    const allDesigns = [...designOptions]
    const design = allDesigns.find((d) => d.value === iconType)

    // Draw a circle with first letter
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
    ctx.stroke()

    // Add text
    ctx.fillStyle = color
    ctx.font = `${size / 2}px monospace`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(design?.name.charAt(0) || "?", 0, 0)
  }

  // Preload images on component mount
  useEffect(() => {
    preloadDesignImages()
    preloadHighlightTexture()
    preloadZipbagBackground()
  }, [])

  // Check if all images are loaded whenever loading states change
  useEffect(() => {
    checkAllImagesLoaded()
  }, [highlightTextureLoaded, zipbagBackgroundLoaded, loadedImages])

  // Matter.js physics setup - 全ての画像読み込み完了後に初期化
  useEffect(() => {
    // 全ての必要な画像が読み込まれるまで待つ
    if (!allImagesLoaded) {
      return
    }

    if (!canvasRef.current) return

    // Create engine
    const engine = Matter.Engine.create()
    engine.world.gravity.y = 1
    engine.world.gravity.x = 0

    // Create renderer
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 490,
        height: 660,
        wireframes: false,
        background: "transparent",
        showAngleIndicator: false,
        showVelocity: false,
        showDebug: false,
        showBounds: false,
        showBroadphase: false,
        showSeparations: false,
        showAxes: false,
        showPositions: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false,
      },
    })

    // Add custom rendering after creating the render
    Matter.Events.on(render, "afterRender", () => {
      const ctx = render.canvas.getContext("2d")
      if (!ctx) return

      // Clear the canvas with proper transform reset
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, 490, 660)

      // Draw the zipbag background first with new dimensions
      if (zipbagBackground && zipbagBackgroundLoaded) {
        ctx.drawImage(zipbagBackground, 0, 0, 490, 660)
      }

      // Get all candy bodies (non-static bodies)
      const candyBodies = Matter.Composite.allBodies(engine.world).filter((body) => !body.isStatic)

      let needsRetry = false

      // Draw candies on top of background
      candyBodies.forEach((body) => {
        if (body.candyData) {
          const { iconType, baseColor } = body.candyData

          // Save context and apply position and rotation
          ctx.save()
          ctx.translate(body.position.x, body.position.y)
          ctx.rotate(body.angle)

          // Draw base color (background) at origin
          drawBaseColor(ctx, 25, baseColor)

          // Draw radial stripes at origin
          ctx.save()
          drawRadialStripes(ctx, 25, body.candyData)
          ctx.restore()

          // Check if design image is available for drawing
          const allDesigns = [...designOptions]
          const design = allDesigns.find((d) => d.value === iconType)
          if (design?.imagePath && (!imageCache.has(iconType) || !loadedImages.has(iconType))) {
            needsRetry = true
          }

          // Draw icon at origin
          ctx.save()
          drawIcon(ctx, iconType, 35)
          ctx.restore()

          // Draw highlight texture - 画像が確実に読み込まれた状態で描画
          ctx.save()
          drawHighlightTexture(ctx, 25)
          ctx.restore()

          // Restore context
          ctx.restore()
        }
      })

      // If some design images are still loading, schedule a retry
      if (needsRetry) {
        requestAnimationFrame(() => {
          if (engineRef.current) {
            Matter.Engine.update(engineRef.current, 16)
          }
        })
      }
    })

    // Create boundaries
    // Create boundaries with inner safe area margins
    const innerMarginLeft = 55
    const innerMarginRight = 55
    const innerMarginTop = 70
    const innerMarginBottom = 55

    const innerWidth = 490 - innerMarginLeft - innerMarginRight // 420
    const innerHeight = 660 - innerMarginTop - innerMarginBottom // 570
    const innerCenterX = innerMarginLeft + innerWidth / 2 // 260
    const innerCenterY = innerMarginTop + innerHeight / 2 // 365

    const ground = Matter.Bodies.rectangle(innerCenterX, 660 - innerMarginBottom, innerWidth, 20, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    })
    const leftWall = Matter.Bodies.rectangle(innerMarginLeft, innerCenterY, 20, innerHeight, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    })
    const rightWall = Matter.Bodies.rectangle(490 - innerMarginRight, innerCenterY, 20, innerHeight, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    })
    const ceiling = Matter.Bodies.rectangle(innerCenterX, innerMarginTop, innerWidth, 20, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    })

    // Add boundaries to world
    Matter.World.add(engine.world, [ground, leftWall, rightWall, ceiling])

    // Create runner
    const runner = Matter.Runner.create()

    // Start the engine and renderer
    Matter.Runner.run(runner, engine)
    Matter.Render.run(render)

    // Store references
    engineRef.current = engine
    renderRef.current = render

    // Initial candy creation after engine is ready
    setTimeout(() => {
      // Force initial candy creation
      const event = new Event("candyTypesChanged")
      window.dispatchEvent(event)
    }, 100)

    // Cleanup function
    return () => {
      Matter.Render.stop(render)
      Matter.Runner.stop(runner)
      Matter.World.clear(engine.world, false)
      Matter.Engine.clear(engine)
    }
  }, [allImagesLoaded]) // 全画像読み込み完了を待つ

  // Update candies in physics world
  useEffect(() => {
    if (!engineRef.current) return

    // Remove existing candy bodies (keep static walls)
    const allBodies = Matter.Composite.allBodies(engineRef.current.world)
    const candyBodies = allBodies.filter((body) => !body.isStatic)
    Matter.World.remove(engineRef.current.world, candyBodies)

    // Add new candies
    const newCandies: Matter.Body[] = []

    candyTypes.forEach((candyType, typeIndex) => {
      for (let i = 0; i < candyType.count; i++) {
        // Define inner safe area for candy spawning
        const innerMarginLeft = 50
        const innerMarginRight = 50
        const innerMarginTop = 80
        const innerMarginBottom = 50

        const candyRadius = 25
        const candyMargin = 10

        const minX = innerMarginLeft + candyRadius + candyMargin
        const maxX = 490 - innerMarginRight - candyRadius - candyMargin
        const minY = innerMarginTop + candyRadius + candyMargin
        const maxY = Math.min(innerMarginTop + 160, 700 - innerMarginBottom - candyRadius - candyMargin) // Upper area for spawning

        const x = Math.random() * (maxX - minX) + minX
        const y = Math.random() * (maxY - minY) + minY

        const candy = Matter.Bodies.circle(x, y, 30, {
          render: {
            visible: false, // Matter.jsの描画を完全に無効化
          },
          restitution: 0.6,
          friction: 0.4,
          frictionAir: 0.01,
          density: 0.001,
        })

        // Add custom data to the body
        candy.candyData = {
          iconType: candyType.design,
          primaryColor: candyType.primaryColor,
          secondaryColor: candyType.secondaryColor,
          baseColor: candyType.baseColor,
          outlineType: candyType.outlineType,
        }

        // Add random initial angular velocity for natural spinning
        Matter.Body.setAngularVelocity(candy, (Math.random() - 0.5) * 0.2)

        newCandies.push(candy)
      }
    })

    // Add all candies to world at once
    if (newCandies.length > 0) {
      Matter.World.add(engineRef.current.world, newCandies)
    }

    // Force re-render after adding candies
    setTimeout(() => {
      if (engineRef.current) {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            if (engineRef.current) {
              Matter.Engine.update(engineRef.current, 16)
            }
          }, i * 100)
        }
      }
    }, 50)
  }, [candyTypes, allImagesLoaded]) // allImagesLoaded dependency added

  // Force re-render when design images are loaded - imageCache dependency added
  useEffect(() => {
    // Trigger a re-render of the physics world when design images load
    if (engineRef.current && loadedImages.size > 0) {
      // Force multiple updates to ensure design images appear
      for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
          if (engineRef.current) {
            Matter.Engine.update(engineRef.current, 16)
          }
        }, i * 100) // 100ms, 200ms, 300ms, 400ms, 500ms
      }
    }
  }, [loadedImages, imageCache]) // imageCache dependency added for React re-rendering

  const addCandyType = () => {
    // 最大5つまでに制限
    if (candyTypes.length >= 5) {
      return
    }

    const newId = Date.now().toString()

    // デザインの選択ロジックを変更
    let selectedDesign
    if (candyTypes.length === 1) {
      // Candy Type B (2番目) の場合は liam-logo を選択
      selectedDesign = "liam-logo"
    } else {
      // その他の場合は順番に選択
      selectedDesign = designOptions[candyTypes.length % designOptions.length].value
    }

    const newCandy: CandyType = {
      id: newId,
      name: `Candy Type ${String.fromCharCode(65 + candyTypes.length)}`,
      outlineType: "oneColorStripe",
      primaryColor: colorOptions[candyTypes.length % colorOptions.length].value,
      baseColor: colorOptions[Math.floor(Math.random() * colorOptions.length)].value, // ランダムに選択
      design: selectedDesign,
      count: 1,
    }
    setCandyTypes([...candyTypes, newCandy])
    setSelectedCandy(newId)
  }

  const deleteCandyType = (id: string) => {
    setCandyTypes(candyTypes.filter((candy) => candy.id !== id))
    if (selectedCandy === id && candyTypes.length > 1) {
      setSelectedCandy(candyTypes.find((candy) => candy.id !== id)?.id || "")
    }
  }

  const updateCandyType = (id: string, updates: Partial<CandyType>) => {
    setCandyTypes(candyTypes.map((candy) => (candy.id === id ? { ...candy, ...updates } : candy)))
  }

  const selectedCandyData = candyTypes.find((candy) => candy.id === selectedCandy)
  const totalCandies = candyTypes.reduce((sum, candy) => sum + candy.count, 0)

  const getDesignIcon = (design: string) => {
    const designOption = designOptions.find((option) => option.value === design)
    return designOption?.icon || null
  }

  const getOutlineTypeDisplay = (candy: CandyType) => {
    const outlineOption = outlineTypeOptions.find((option) => option.value === candy.outlineType)
    return outlineOption?.name || "One Color"
  }

  const exportCanvasAsImage = () => {
    if (!canvasRef.current) {
      toast.error('No Canvas', {
        description: 'Canvas is not ready. Please wait for the candy to load.',
        duration: 3000
      })
      return
    }

    try {
      // Create a temporary canvas with the same dimensions as the original canvas
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = 490
      tempCanvas.height = 660
      const tempCtx = tempCanvas.getContext("2d")

      if (!tempCtx) {
        toast.error('Export Failed', {
          description: 'Could not create canvas context for export.',
          duration: 3000
        })
        return
      }

      // Simply copy the current canvas content which already includes the zipbag background
      tempCtx.drawImage(canvasRef.current, 0, 0)

      // Convert canvas to data URL
      const dataUrl = tempCanvas.toDataURL("image/png")

      // Create a download link
      const link = document.createElement("a")
      link.download = `candy-generator-${new Date().toISOString().slice(0, 10)}.png`
      link.href = dataUrl
      link.click()

      toast.success('Candy Exported! 📥', {
        description: 'Your candy creation has been downloaded successfully!',
        duration: 3000
      })
    } catch (error) {
      console.error('Error exporting canvas:', error)
      toast.error('Export Failed', {
        description: 'Failed to export candy. Please try again.',
        duration: 4000
      })
    }
  }

  const saveToDashboard = async () => {
    if (!canvasRef.current || !connected || !publicKey) {
      console.error('Cannot save: canvas, wallet connection, or public key missing')
      toast.error('Wallet Required', {
        description: 'Please connect your wallet first to save candy to dashboard.',
        duration: 4000,
        action: {
          label: 'Connect Wallet',
          onClick: () => {
            // Focus on wallet connection area
            const walletButton = document.querySelector('[data-testid="wallet-adapter-button"]')
            if (walletButton) {
              (walletButton as HTMLElement).click()
            }
          }
        }
      })
      return
    }

    setIsSaving(true)
    
    try {
      console.log('Saving candy to dashboard...')
      
      // Test Supabase connection first
      console.log('Testing Supabase connection...')
      const testResults = await runAllTests()
      console.log('Supabase test results:', testResults)
      
      if (!testResults.allPassed) {
        console.warn('Supabase connection test failed, but continuing with save attempt...')
        // Don't throw error, let the save function handle fallback
      }
      
      // Generate title and tags from candy types
      const title = generateCandyTitle(candyTypes)
      const tags = generateCandyTags(candyTypes)
      
      console.log('Generated title and tags:', { title, tags })
      
      // Create candy data
      const candyData = {
        canvas: canvasRef.current,
        title,
        tags,
        description: `Generated candy collection with ${totalCandies} candies`
      }
      
      console.log('Candy data prepared:', {
        title: candyData.title,
        tags: candyData.tags,
        description: candyData.description,
        canvasSize: `${candyData.canvas.width}x${candyData.canvas.height}`
      })
      
      // Save to Supabase only
      const savedMeme = await saveCandyToSupabase(candyData, publicKey.toString())
      
      if (savedMeme) {
        console.log('Candy saved successfully to dashboard:', savedMeme)
        toast.success('Candy Saved! 🍭', {
          description: 'Your candy creation has been saved to Supabase successfully!',
          duration: 4000,
          action: {
            label: 'View Dashboard',
            onClick: () => window.open('/dashboard', '_blank')
          }
        })
      } else {
        throw new Error('Failed to save candy')
      }
    } catch (error) {
      console.error('Error saving candy to dashboard:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      })
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      toast.error('Save Failed', {
        description: `Failed to save candy: ${errorMessage}`,
        duration: 5000,
        action: {
          label: 'Retry',
          onClick: () => saveToDashboard()
        }
      })
    } finally {
      setIsSaving(false)
    }
  }


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="font-inter bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide font-extrabold text-lg">
            🍭 Jack's Candy Studio
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <WalletConnectButton />
          </div>
        </div>
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-gray-800/95 border-b border-gray-700 mt-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="text-white hover:bg-gray-700"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Left Sidebar - Generator Controls */}
      <div
        className={`
      fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
      w-full lg:w-[498px] 
      bg-gray-800/95 border-r border-gray-700 backdrop-blur-sm shadow-2xl 
      transform transition-transform duration-300 ease-in-out
      lg:transform-none lg:transition-none
      overflow-y-auto
      ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0
      lg:mt-16
    `}
      >
        <div className="p-4 px-0 py-5">

          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end px-6 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="text-white hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Wallet Info */}
          <div className="px-6 mb-4">
            <WalletInfo />
          </div>

          <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl text-white font-normal">CANDY TYPES SUMMARY</CardTitle>
              <p className="text-gray-400 text-sm">Generate your candy collection 🍭 </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="space-y-3">
                  {candyTypes.map((candy) => {
                    const designOption = designOptions.find((d) => d.value === candy.design)
                    const isLoaded = loadedImages.has(candy.design)
                    const isFailed = failedImages.has(candy.design)

                    return (
                      <div
                        key={candy.id}
                        className={`flex justify-between p-3 rounded-lg border cursor-pointer transition-colors flex-col text-left items-stretch gap-y-1.5 ${
                          selectedCandy === candy.id
                            ? "bg-gray-700 border-green-500"
                            : "bg-gray-750 border-gray-600 hover:border-gray-500"
                        }`}
                        onClick={() => setSelectedCandy(candy.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-600 overflow-hidden">
                            <CandyPreviewIcon
                              candyData={candy}
                              highlightTexture={highlightTexture}
                              highlightTextureLoaded={highlightTextureLoaded}
                              designImage={imageCache.get(candy.design) || null}
                              designImageLoaded={isLoaded && !isFailed}
                              size={40}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white">{candy.name}</div>
                            <div className="text-xs text-slate-400">
                              {getOutlineTypeDisplay(candy)} • {candy.count} objects
                              {designOption?.imagePath && !isLoaded && !isFailed && (
                                <span className="text-yellow-400"> • Loading...</span>
                              )}
                              {isFailed && <span className="text-red-400"> • Failed to load</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 flex-row items-center justify-end">
                          <div className="flex items-center space-x-1">
                            <Button
                              className="bg-slate-700 text-white border-slate-500 w-6 h-6 p-0"
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateCandyType(candy.id, {
                                  count: Math.max(1, candy.count - 1),
                                })
                              }}
                              disabled={candy.count <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm w-6 text-center text-white font-medium">{candy.count}</span>
                            <Button
                              className="bg-slate-700 text-white border-slate-500 w-6 h-6 p-0"
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateCandyType(candy.id, {
                                  count: Math.min(10, candy.count + 1),
                                })
                              }}
                              disabled={candy.count >= 10}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteCandyType(candy.id)
                            }}
                            disabled={candyTypes.length === 1}
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Button
                  onClick={addCandyType}
                  className="w-full mt-3 hover:bg-[rgba(79,255,165,1)] text-black bg-[rgba(29,237,131,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={candyTypes.length >= 5}
                >
                  {candyTypes.length >= 5 ? "Max 5 Types Reached" : "Add Candy Type"}
                </Button>
              </div>

              {/* Edit Selected Candy */}
              {selectedCandyData && (
                <div className="py-5 rounded-lg border-slate-600 px-0 border-0">
                  <h3 className="mb-3 text-white font-light text-base">Edit {selectedCandyData.name}</h3>

                  {/* Base Color */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Base Color</label>
                    <div className="flex space-x-2 flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          className={`border-2 rounded-full w-6 h-6 relative group ${
                            selectedCandyData.baseColor === color.value ? "border-white" : "border-gray-600"
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => updateCandyType(selectedCandy, { baseColor: color.value })}
                          title={color.flavor}
                        >
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {color.flavor}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outline Type */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Outline Type</label>
                    <div className="flex space-x-2 flex-wrap gap-2">
                      {outlineTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`px-3 py-2 rounded text-sm border ${
                            selectedCandyData.outlineType === option.value
                              ? "border-green-500 bg-green-500/20 text-white"
                              : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                          }`}
                          onClick={() => updateCandyType(selectedCandy, { outlineType: option.value })}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Color */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      {selectedCandyData.outlineType === "solid" ? "Outline Color" : "Primary Color"}
                    </label>
                    <div className="flex space-x-2 flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          className={`border-2 rounded-full h-6 w-6 relative group ${
                            selectedCandyData.primaryColor === color.value ? "border-white" : "border-gray-600"
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => updateCandyType(selectedCandy, { primaryColor: color.value })}
                          title={color.flavor}
                        >
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {color.flavor}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Color (only for biColorStripe) */}
                  {selectedCandyData.outlineType === "biColorStripe" && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-400 mb-2">Secondary Color</label>
                      <div className="flex space-x-2 flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            className={`border-2 w-6 h-6 rounded-full relative group ${
                              selectedCandyData.secondaryColor === color.value ? "border-white" : "border-gray-600"
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => updateCandyType(selectedCandy, { secondaryColor: color.value })}
                            title={color.flavor}
                          >
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              {color.flavor}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Design */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Design</label>
                    <div className="grid grid-cols-8 gap-2">
                      {designOptions.map((design) => {
                        const IconComponent = design.icon as React.ComponentType<{ className?: string }> | null
                        const isLoaded = loadedImages.has(design.value)
                        const isFailed = failedImages.has(design.value)

                        return (
                          <button
                            key={design.value}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                              selectedCandyData.design === design.value
                                ? "border-green-500 bg-green-500/20"
                                : "border-gray-600 bg-gray-700 hover:border-gray-500"
                            }`}
                            onClick={() => updateCandyType(selectedCandy, { design: design.value })}
                          >
                            {IconComponent ? (
                              <IconComponent className="w-5 h-5 text-white" />
                            ) : design.imagePath && isLoaded && !isFailed ? (
                              <img src={design.imagePath || "/placeholder.svg"} alt={design.name} className="w-full h-full rounded-full object-cover " />
                            ) : (
                              <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-white">
                                {design.name.charAt(0)}
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content - Live Preview */}
      <div className="flex-1 p-4 overflow-hidden px-0 py-0 pt-32 lg:pt-20 lg:pl-4 min-h-0">
        <Card className="bg-transparent border-gray-700 h-full backdrop-blur-sm border-0 border-blue-500/30 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start gap-x-4">
                <CardTitle className="text-xl text-white font-normal">LIVE PREVIEW</CardTitle>
                <Badge variant="secondary" className="bg-black text-slate-400">
                  Total: {totalCandies} candies
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={exportCanvasAsImage}
                  className="hover:bg-[rgba(0,0,0,0.5)] font-normal border text-white bg-slate-500"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export Candy Bag
                </Button>
                <Button
                  variant="default"
                  onClick={saveToDashboard}
                  disabled={!connected || isSaving}
                  className="hover:bg-green-600 font-normal border text-white bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? 'Saving...' : 'Save to Dashboard'}
                </Button>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              {candyTypes.map((candy, index) => (
                <span key={candy.id}>
                  {candy.name}: {candy.count} objects
                  {index < candyTypes.length - 1 && " • "}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="relative h-full flex items-center justify-center">
              <div
                className="rounded-lg pt-5 px-[60px] pb-[60px] border-gray-700 border-0 max-h-full max-w-full"
                style={{
                  aspectRatio: "560/755", // 490+120 width / 660+95 height
                  height: "min(calc(100vh - 280px), calc((100vw - 400px) * 795/640), 795px)",
                  width: "min(calc((100vh - 280px) * 640/795), calc(100vw - 400px), 640px)",
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={490}
                  height={660}
                  className="w-full h-auto max-w-full border-gray-600 rounded border-0"
                  style={{
                    maxHeight: "660px",
                    aspectRatio: "490/660",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CandyGenerator
