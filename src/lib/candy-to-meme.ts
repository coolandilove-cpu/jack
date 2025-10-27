import { addMeme, MemeData } from './meme-storage'
import { MemeService } from './meme-service'

export interface CandyMemeData {
  canvas: HTMLCanvasElement
  title: string
  tags: string[]
  description?: string
}

// Convert canvas to base64 image
export const canvasToBase64 = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL('image/png')
}

// Save candy generation to meme storage (localStorage - fallback)
export const saveCandyToMeme = async (
  candyData: CandyMemeData,
  walletAddress: string
): Promise<MemeData> => {
  const base64Image = canvasToBase64(candyData.canvas)
  
  const memeData: Omit<MemeData, 'id'> = {
    title: candyData.title,
    image: base64Image,
    likes: 0,
    shares: 0,
    downloads: 0,
    tags: candyData.tags,
    author: walletAddress,
    createdAt: new Date().toISOString(),
    isLiked: false,
    description: candyData.description || `Generated candy with ${candyData.tags.join(', ')}`
  }
  
  return addMeme(memeData)
}

// Save candy generation to Supabase only
export const saveCandyToSupabase = async (
  candyData: CandyMemeData,
  walletAddress: string
): Promise<any> => {
  try {
    console.log('Starting saveCandyToSupabase:', {
      title: candyData.title,
      tags: candyData.tags,
      walletAddress,
      hasCanvas: !!candyData.canvas
    })

    const meme = await MemeService.createMemeFromCandy(
      candyData.canvas,
      candyData.title,
      candyData.tags,
      walletAddress,
      candyData.description
    )
    
    if (meme) {
      console.log('Meme created successfully in Supabase:', meme)
      
      // Return Supabase meme data directly
      return {
        id: meme.id,
        title: meme.title,
        image: meme.image_base64 || '',
        likes: meme.likes,
        shares: meme.shares,
        downloads: meme.downloads,
        tags: meme.tags,
        author: meme.author_wallet_address,
        createdAt: meme.created_at,
        isLiked: false,
        description: meme.description || undefined
      }
    }
    
    throw new Error('Failed to create meme in Supabase - no data returned')
  } catch (error) {
    console.error('Error saving candy to Supabase:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // Fallback to localStorage if Supabase fails
    console.log('⚠️ Falling back to localStorage due to Supabase error...')
    try {
      const localMeme = await saveCandyToMeme(candyData, walletAddress)
      console.log('✅ Successfully saved to localStorage as fallback')
      return localMeme
    } catch (fallbackError) {
      console.error('❌ Fallback to localStorage also failed:', fallbackError)
      throw new Error(`Failed to save candy (both Supabase and localStorage failed): ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Generate title from candy properties
export const generateCandyTitle = (candyTypes: any[]): string => {
  if (candyTypes.length === 0) return 'My Candy Creation'
  
  const firstCandy = candyTypes[0]
  const colorName = getColorName(firstCandy.primaryColor)
  const designName = getDesignName(firstCandy.design)
  
  return `${colorName} ${designName} Candy`
}

// Generate tags from candy properties
export const generateCandyTags = (candyTypes: any[]): string[] => {
  const tags = ['candy', 'generated']
  
  if (candyTypes.length > 0) {
    const firstCandy = candyTypes[0]
    
    // Add color tag
    const colorName = getColorName(firstCandy.primaryColor).toLowerCase()
    tags.push(colorName)
    
    // Add design tag
    const designName = getDesignName(firstCandy.design).toLowerCase()
    tags.push(designName)
    
    // Add outline type tag
    if (firstCandy.outlineType) {
      tags.push(firstCandy.outlineType)
    }
  }
  
  return tags
}

// Helper function to get color name from hex value
const getColorName = (hexColor: string): string => {
  const colorMap: { [key: string]: string } = {
    '#FF4949': 'Red',
    '#6277EF': 'Blue', 
    '#F3FF51': 'Yellow',
    '#1DED83': 'Green',
    '#FFA947': 'Orange',
    '#9D2D99': 'Purple',
    '#F5789A': 'Pink',
    '#6AE3F8': 'Cyan',
    '#2D363A': 'Dark Gray',
    '#FFFFFF': 'White'
  }
  
  return colorMap[hexColor] || 'Custom'
}

// Helper function to get design name from design value
const getDesignName = (designValue: string): string => {
  const designMap: { [key: string]: string } = {
    'liam-logo': 'Liam Logo',
    'jack': 'Jack',
    'liam-logotype': 'Liam Text',
    'star': 'Star',
    'planet': 'Planet'
  }
  
  return designMap[designValue] || 'Custom Design'
}
