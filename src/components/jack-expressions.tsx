"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shuffle, Heart, Smile, Download, Share2 } from "lucide-react"
import Link from "next/link"

// Định nghĩa độ hiếm
type Rarity = "common" | "rare" | "epic" | "legendary"

interface JackExpression {
  name: string
  path: string
  emotion: string
  rarity: Rarity
}

// Danh sách các ảnh biểu cảm của Jack từ thư mục assets-img với độ hiếm
const jackExpressions: JackExpression[] = [
  // COMMON (60% chance) - 20 cards
  { name: "Buồn", path: "/assets-img/bangoc-buon.png", emotion: "sad", rarity: "common" },
  { name: "Khóc", path: "/assets-img/bangoc-khoc.png", emotion: "crying", rarity: "common" },
  { name: "Ngượng ngùng", path: "/assets-img/bangoc-nguongngung.png", emotion: "shy", rarity: "common" },
  { name: "Vui vẻ", path: "/assets-img/bangoc-vuive.png", emotion: "happy", rarity: "common" },
  { name: "Giận dữ", path: "/assets-img/do-giandu.png", emotion: "angry", rarity: "common" },
  { name: "Cam chấm hỏi", path: "/assets-img/cam-chamhoi.png", emotion: "question", rarity: "common" },
  { name: "Cam chấm hỏi hơn", path: "/assets-img/cam-chamhoihon.png", emotion: "more_question", rarity: "common" },
  { name: "Cam", path: "/assets-img/cam.png", emotion: "orange", rarity: "common" },
  { name: "Hồng", path: "/assets-img/hong.png", emotion: "pink", rarity: "common" },
  { name: "Tim chấm hỏi", path: "/assets-img/tim-chamhoi.png", emotion: "heart_question", rarity: "common" },
  { name: "Tim", path: "/assets-img/tim.png", emotion: "heart", rarity: "common" },
  { name: "Xanh lá cười tươi", path: "/assets-img/xanhla-cuoituoi.png", emotion: "green_fresh", rarity: "common" },
  { name: "Xanh lá", path: "/assets-img/xanhla.png", emotion: "green", rarity: "common" },
  { name: "BF", path: "/assets-img/bf-removebg-preview.png", emotion: "bf", rarity: "common" },
  { name: "HGW", path: "/assets-img/hgw-removebg-preview.png", emotion: "hgw", rarity: "common" },
  { name: "VDF", path: "/assets-img/vdf-removebg-preview.png", emotion: "vdf", rarity: "common" },
  { name: "VX", path: "/assets-img/vx-removebg-preview.png", emotion: "vx", rarity: "common" },
  { name: "XC", path: "/assets-img/xc-removebg-preview.png", emotion: "xc", rarity: "common" },
  { name: "Z", path: "/assets-img/z-removebg-preview.png", emotion: "z", rarity: "common" },
  { name: "Xám buồn", path: "/assets-img/xam-buon.png", emotion: "gray_sad", rarity: "common" },

  // RARE (25% chance) - 10 cards
  { name: "Phong mã", path: "/assets-img/do-phongma.png", emotion: "wild", rarity: "rare" },
  { name: "Cam khóc dòng sông", path: "/assets-img/cam-khocdongsong.png", emotion: "river_cry", rarity: "rare" },
  { name: "Cam kính mắt", path: "/assets-img/cam-kinhmat.png", emotion: "cool", rarity: "rare" },
  { name: "Cam phấn khích", path: "/assets-img/cam-phankhich.png", emotion: "excited", rarity: "rare" },
  { name: "Tim cầm kéo", path: "/assets-img/tim-camkeo.png", emotion: "scissors", rarity: "rare" },
  { name: "Tim cầm kéo (preview)", path: "/assets-img/tim-camkeo-removebg-preview.png", emotion: "scissors_preview", rarity: "rare" },
  { name: "Xanh cổ kính", path: "/assets-img/xanh-cokinh.png", emotion: "vintage", rarity: "rare" },
  { name: "Xanh nón Noel", path: "/assets-img/xanh-nonnoel.png", emotion: "christmas", rarity: "rare" },
  { name: "Halloween PFP", path: "/assets-img/halloween-pfp.png", emotion: "halloween_pfp", rarity: "rare" },
  { name: "Hallow Queen", path: "/assets-img/hallowqueen-sec.png", emotion: "hallow_queen", rarity: "rare" },

  // EPIC (12% chance) - 5 cards
  { name: "Cầu vồng cười", path: "/assets-img/cauvong-cuoi.png", emotion: "rainbow_laugh", rarity: "epic" },
  { name: "Vàng vui vẻ", path: "/assets-img/vang-vuive.png", emotion: "gold_happy", rarity: "epic" },
  { name: "Xanh lá trắng Halloween", path: "/assets-img/xanhlatrang-halloween.png", emotion: "halloween", rarity: "epic" },
  { name: "Kem vui vẻ", path: "/assets-img/kem-vuive.png", emotion: "icecream_happy", rarity: "epic" },
  { name: "Màu tăm băm", path: "/assets-img/mautambam.png", emotion: "rainbow_mix", rarity: "epic" },

  // LEGENDARY (3% chance) - 3 cards
  { name: "Xanh pha tim vui vẻ", path: "/assets-img/xanhphatim-vuive.png", emotion: "blue_pink_happy", rarity: "legendary" },
  { name: "Hồng xanh tim cười mỉm", path: "/assets-img/hongxanhtim-cuoimim.png", emotion: "pink_blue_smile", rarity: "legendary" },
  { name: "Hồng xanh tim vui vẻ", path: "/assets-img/hongxanhtim-vuive.png", emotion: "pink_blue_happy", rarity: "legendary" },
]

interface JackExpressionsProps {
  className?: string
}

export default function JackExpressions({ className = "" }: JackExpressionsProps) {
  const [currentExpression, setCurrentExpression] = useState<JackExpression | null>(null)

  // Hàm random biểu cảm với độ hiếm
  const generateRandomJack = () => {
    const random = Math.random()
    
    let selectedRarity: Rarity
    if (random < 0.03) {
      selectedRarity = "legendary" // 3%
    } else if (random < 0.15) {
      selectedRarity = "epic" // 12%
    } else if (random < 0.40) {
      selectedRarity = "rare" // 25%
    } else {
      selectedRarity = "common" // 60%
    }
    
    // Lọc các thẻ theo độ hiếm đã chọn
    const cardsOfRarity = jackExpressions.filter(card => card.rarity === selectedRarity)
    const randomIndex = Math.floor(Math.random() * cardsOfRarity.length)
    setCurrentExpression(cardsOfRarity[randomIndex])
  }

  // Random ngay khi load lần đầu
  useEffect(() => {
    generateRandomJack()
  }, [])

  const handleImageError = () => {
    console.warn(`Failed to load image: ${currentExpression?.path}`)
  }

  const handleDownload = () => {
    if (currentExpression) {
      const link = document.createElement("a")
      link.href = currentExpression.path
      link.download = `jack_expression_${currentExpression.emotion}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePostToDashboard = () => {
    if (currentExpression) {
      // TODO: Implement actual dashboard posting logic
      alert(`Posting expression "${currentExpression.name}" to Dashboard!`)
    }
  }

  // Hàm lấy màu sắc theo độ hiếm
  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case "common": return "text-gray-400 bg-gray-600/20"
      case "rare": return "text-blue-400 bg-blue-600/20"
      case "epic": return "text-purple-400 bg-purple-600/20"
      case "legendary": return "text-yellow-400 bg-yellow-600/20"
      default: return "text-gray-400 bg-gray-600/20"
    }
  }

  // Hàm lấy tên độ hiếm
  const getRarityName = (rarity: Rarity) => {
    switch (rarity) {
      case "common": return "Common"
      case "rare": return "Rare"
      case "epic": return "Epic"
      case "legendary": return "Legendary"
      default: return "Unknown"
    }
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Smile className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 bg-clip-text text-transparent">
            Jack Gene Generator
          </h1>
        </div>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Generate random Jack expressions with one click
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
        {/* Image Display */}
        <div className="relative mb-6">
          <div className="relative group">
            {/* Image Container */}
            <div className="relative w-80 h-80 mx-auto rounded-2xl overflow-hidden">
              {currentExpression ? (
                <Link href="/profile" className="block w-full h-full">
                  <div className="relative w-full h-full cursor-pointer group">
                    <img
                      src={currentExpression.path}
                      alt={`Jack ${currentExpression.name}`}
                      className="w-full h-full object-contain transition-all duration-200 group-hover:scale-105"
                      onError={handleImageError}
                    />
                    {/* Rarity Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getRarityColor(currentExpression.rarity)}`}>
                      {getRarityName(currentExpression.rarity)}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                        View Profile
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Loading...</div>
                </div>
              )}
            </div>
            
          </div>
        </div>


        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={generateRandomJack}
            className="w-full h-12 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-150"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Generate Gene
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDownload}
              disabled={!currentExpression}
              className="h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-150"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            
            <Button
              onClick={handlePostToDashboard}
              disabled={!currentExpression}
              className="h-10 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-150"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Post
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Click "Generate New Jack" to create random expressions
          </p>
        </div>
      </div>
    </div>
  )
}
