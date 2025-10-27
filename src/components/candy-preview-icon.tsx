"use client"

import { useEffect, useRef } from "react"

interface CandyPreviewIconProps {
  candyData: {
    id: string
    name: string
    outlineType: "solid" | "oneColorStripe" | "biColorStripe"
    primaryColor: string
    secondaryColor?: string
    baseColor: string
    design: string
  }
  highlightTexture: HTMLImageElement | null
  highlightTextureLoaded: boolean
  designImage: HTMLImageElement | null
  designImageLoaded: boolean
  size?: number
}

const CandyPreviewIcon = ({
  candyData,
  highlightTexture,
  highlightTextureLoaded,
  designImage,
  designImageLoaded,
  size = 40,
}: CandyPreviewIconProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw base color for preview
  const drawBaseColorPreview = (ctx: CanvasRenderingContext2D, radius: number, baseColor: string) => {
    ctx.fillStyle = baseColor
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw radial stripes for preview
  const drawRadialStripesPreview = (ctx: CanvasRenderingContext2D, radius: number, candyData: any) => {
    const { outlineType, primaryColor, secondaryColor } = candyData

    if (outlineType === "solid") {
      // ソリッドの場合は単純な円を描画
      ctx.strokeStyle = primaryColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.stroke()
      return
    }

    const outerRadius = radius + 1
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
    ctx.arc(0, 0, radius - 1, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw highlight texture for preview
  const drawHighlightTexturePreview = (ctx: CanvasRenderingContext2D, radius: number) => {
    if (!highlightTextureLoaded || !highlightTexture) {
      return
    }

    if (!highlightTexture.complete || highlightTexture.naturalWidth === 0 || highlightTexture.naturalHeight === 0) {
      return
    }

    const originalCompositeOperation = ctx.globalCompositeOperation
    ctx.globalCompositeOperation = "screen"

    const textureSize = radius * 2.0

    ctx.save()
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.clip()

    try {
      ctx.drawImage(highlightTexture, -textureSize / 2, -textureSize / 2, textureSize, textureSize)
    } catch (error) {
      console.error("Error drawing highlight texture preview:", error)
    }

    ctx.restore()
    ctx.globalCompositeOperation = originalCompositeOperation
  }

  // Draw icon for preview
  const drawIconPreview = (ctx: CanvasRenderingContext2D, iconSize: number) => {
    if (designImage && designImageLoaded) {
      try {
        if (designImage.naturalWidth > 0 && designImage.naturalHeight > 0) {
          const scale = iconSize / Math.max(designImage.naturalWidth, designImage.naturalHeight)
          ctx.save()
          ctx.scale(scale, scale)
          ctx.globalCompositeOperation = "source-over"
          ctx.drawImage(designImage, -designImage.naturalWidth / 2, -designImage.naturalHeight / 2)
          ctx.restore()
        } else {
          drawFallbackIconPreview(ctx, iconSize)
        }
      } catch (error) {
        console.warn(`Error drawing preview image:`, error)
        drawFallbackIconPreview(ctx, iconSize)
      }
    } else {
      drawFallbackIconPreview(ctx, iconSize)
    }
  }

  const drawFallbackIconPreview = (ctx: CanvasRenderingContext2D, iconSize: number) => {
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, iconSize / 2, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = "#FFFFFF"
    ctx.font = `${iconSize / 3}px monospace`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(candyData.name.charAt(0) || "?", 0, 0)
  }

  // Render the candy preview
  const renderCandyPreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const radius = (size * 0.75) / 2 // 75% of canvas size for radius
    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Center the drawing
    ctx.save()
    ctx.translate(size / 2, size / 2)

    // Draw base color
    drawBaseColorPreview(ctx, radius, candyData.baseColor)

    // Draw radial stripes
    ctx.save()
    drawRadialStripesPreview(ctx, radius, candyData)
    ctx.restore()

    // Draw icon
    ctx.save()
    drawIconPreview(ctx, radius * 1.3)
    ctx.restore()

    // Draw highlight texture
    ctx.save()
    drawHighlightTexturePreview(ctx, radius)
    ctx.restore()

    ctx.restore()
  }

  // Re-render when dependencies change
  useEffect(() => {
    renderCandyPreview()
  }, [
    candyData.baseColor,
    candyData.outlineType,
    candyData.primaryColor,
    candyData.secondaryColor,
    candyData.design,
    highlightTextureLoaded,
    designImageLoaded,
    size,
  ])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="w-full h-full"
      style={{ imageRendering: "pixelated" }}
    />
  )
}

export default CandyPreviewIcon