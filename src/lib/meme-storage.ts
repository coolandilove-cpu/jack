// Local storage utilities for meme persistence
const STORAGE_KEY = 'jack_memes'

export interface MemeData {
  id: number
  title: string
  image: string
  likes: number
  shares: number
  downloads: number
  tags: string[]
  author: string
  createdAt: string
  isLiked: boolean
  description?: string
}

// Get memes from localStorage
export const getMemes = (): MemeData[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading memes from storage:', error)
    return []
  }
}

// Save memes to localStorage
export const saveMemes = (memes: MemeData[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memes))
  } catch (error) {
    console.error('Error saving memes to storage:', error)
  }
}

// Add a new meme
export const addMeme = (meme: Omit<MemeData, 'id'>): MemeData => {
  const memes = getMemes()
  const newMeme: MemeData = {
    ...meme,
    id: Date.now() + Math.random() // Unique ID
  }
  
  const updatedMemes = [newMeme, ...memes]
  saveMemes(updatedMemes)
  return newMeme
}

// Update a meme (for likes, etc.)
export const updateMeme = (id: number, updates: Partial<MemeData>): MemeData | null => {
  const memes = getMemes()
  const index = memes.findIndex(meme => meme.id === id)
  
  if (index === -1) return null
  
  const updatedMeme = { ...memes[index], ...updates }
  memes[index] = updatedMeme
  saveMemes(memes)
  
  return updatedMeme
}

// Delete a meme
export const deleteMeme = (id: number): boolean => {
  const memes = getMemes()
  const filteredMemes = memes.filter(meme => meme.id !== id)
  
  if (filteredMemes.length === memes.length) return false
  
  saveMemes(filteredMemes)
  return true
}

// Initialize with empty array - ready for upload testing
export const initializeDefaultMemes = (): MemeData[] => {
  // Clear any existing data for testing
  localStorage.removeItem('memes')
  
  // Return empty array for testing upload functionality
  const emptyMemes: MemeData[] = []
  
  saveMemes(emptyMemes)
  return emptyMemes
}


