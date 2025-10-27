import { supabaseClient } from './supabase'
import type { Database } from './supabase'

type Meme = Database['public']['Tables']['memes']['Row']
type MemeInsert = Database['public']['Tables']['memes']['Insert']
type MemeUpdate = Database['public']['Tables']['memes']['Update']

export interface MemeData {
  id: string
  title: string
  image: string // base64 hoặc URL
  likes: number
  shares: number
  downloads: number
  tags: string[]
  author: string
  createdAt: string
  isLiked: boolean
  description?: string
}

export class MemeService {
  /**
   * Tạo meme mới từ candy generation
   */
  static async createMemeFromCandy(
    canvas: HTMLCanvasElement,
    title: string,
    tags: string[],
    authorWalletAddress: string,
    description?: string
  ): Promise<Meme | null> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, cannot create meme from candy')
        return null
      }

      console.log('Creating meme from candy:', { 
        title, 
        tags, 
        authorWalletAddress,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })

      // Validate inputs
      if (!title || title.trim() === '') {
        throw new Error('Title is required')
      }
      if (!authorWalletAddress || authorWalletAddress.trim() === '') {
        throw new Error('Author wallet address is required')
      }
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Invalid canvas')
      }

      // Convert canvas to base64
      const base64Image = canvas.toDataURL('image/png')
      console.log('Canvas converted to base64, length:', base64Image.length)

      const memeData: MemeInsert = {
        title: title.trim(),
        image_base64: base64Image,
        author_wallet_address: authorWalletAddress.trim(),
        tags: tags || [],
        description: description || `Generated candy with ${tags.join(', ')}`,
        likes: 0,
        shares: 0,
        downloads: 0,
        view_count: 0,
        is_public: true,
        is_featured: false
      }

      console.log('Inserting meme data:', {
        title: memeData.title,
        author_wallet_address: memeData.author_wallet_address,
        tags: memeData.tags,
        hasImage: !!memeData.image_base64
      })

      const { data, error } = await supabaseClient
        .from('memes')
        .insert(memeData)
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating meme:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Database error: ${error.message}`)
      }

      if (!data) {
        throw new Error('No data returned from database')
      }

      console.log('Meme created successfully:', data)
      return data
    } catch (error) {
      console.error('Error in createMemeFromCandy:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      })
      return null
    }
  }

  /**
   * Tạo meme từ file upload
   */
  static async createMemeFromUpload(
    file: File,
    title: string,
    tags: string[],
    authorWalletAddress: string,
    description?: string
  ): Promise<Meme | null> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, cannot create meme from upload')
        return null
      }

      console.log('📤 Creating meme from upload:', { title, tags, authorWalletAddress })

      // Convert file to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      console.log('📷 File converted to base64, size:', base64Image.length)

      const memeData: MemeInsert = {
        title: title.trim(),
        image_base64: base64Image,
        author_wallet_address: authorWalletAddress.trim(),
        tags: tags || [],
        description: description || `Uploaded meme: ${title}`,
        likes: 0,
        shares: 0,
        downloads: 0,
        view_count: 0,
        is_public: true,
        is_featured: false
      }

      console.log('📝 Inserting uploaded meme data:', {
        title: memeData.title,
        author_wallet_address: memeData.author_wallet_address,
        tags: memeData.tags,
        hasImage: !!memeData.image_base64
      })

      const { data, error } = await supabaseClient
        .from('memes')
        .insert(memeData)
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase error creating uploaded meme:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Database error: ${error.message}`)
      }

      if (!data) {
        throw new Error('No data returned from database')
      }

      console.log('✅ Uploaded meme created successfully:', data.id)
      return data
    } catch (error) {
      console.error('💥 Error in createMemeFromUpload:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      })
      return null
    }
  }

  /**
   * Lấy memes của user theo wallet address
   */
  static async getUserMemes(walletAddress: string): Promise<Meme[]> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, returning empty memes array')
        return []
      }

      const { data, error } = await supabaseClient
        .from('memes')
        .select('*')
        .eq('author_wallet_address', walletAddress)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user memes:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getUserMemes:', error)
      return []
    }
  }

  /**
   * Lấy tất cả public memes
   */
  static async getPublicMemes(limit: number = 50, offset: number = 0): Promise<Meme[]> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, returning empty public memes array')
        return []
      }

      const { data, error } = await supabaseClient
        .from('memes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching public memes:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getPublicMemes:', error)
      return []
    }
  }

  /**
   * Lấy trending memes
   */
  static async getTrendingMemes(limit: number = 20): Promise<Meme[]> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, returning empty trending memes array')
        return []
      }

      const { data, error } = await supabaseClient
        .rpc('get_trending_memes', { limit_count: limit })

      if (error) {
        console.error('Error fetching trending memes:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getTrendingMemes:', error)
      return []
    }
  }

  /**
   * Like/unlike meme
   */
  static async toggleLike(memeId: string, userWalletAddress: string): Promise<boolean> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, cannot toggle like')
        return false
      }

      // Kiểm tra xem user đã like chưa
      const { data: existingLike, error: checkError } = await supabaseClient
        .from('user_interactions')
        .select('id')
        .eq('meme_id', memeId)
        .eq('user_wallet_address', userWalletAddress)
        .eq('interaction_type', 'like')
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking like:', checkError)
        return false
      }

      if (existingLike) {
        // Unlike - xóa interaction
        const { error: deleteError } = await supabaseClient
          .from('user_interactions')
          .delete()
          .eq('meme_id', memeId)
          .eq('user_wallet_address', userWalletAddress)
          .eq('interaction_type', 'like')

        if (deleteError) {
          console.error('Error removing like:', deleteError)
          return false
        }
      } else {
        // Like - tạo interaction mới
        const { error: insertError } = await supabaseClient
          .from('user_interactions')
          .insert({
            meme_id: memeId,
            user_wallet_address: userWalletAddress,
            interaction_type: 'like'
          })

        if (insertError) {
          console.error('Error adding like:', insertError)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error in toggleLike:', error)
      return false
    }
  }

  /**
   * Share meme
   */
  static async shareMeme(memeId: string, userWalletAddress: string): Promise<boolean> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, cannot share meme')
        return false
      }

      const { error } = await supabaseClient
        .from('user_interactions')
        .insert({
          meme_id: memeId,
          user_wallet_address: userWalletAddress,
          interaction_type: 'share'
        })

      if (error) {
        console.error('Error sharing meme:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in shareMeme:', error)
      return false
    }
  }

  /**
   * Download meme
   */
  static async downloadMeme(memeId: string, userWalletAddress: string): Promise<boolean> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, cannot download meme')
        return false
      }

      const { error } = await supabaseClient
        .from('user_interactions')
        .insert({
          meme_id: memeId,
          user_wallet_address: userWalletAddress,
          interaction_type: 'download'
        })

      if (error) {
        console.error('Error downloading meme:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in downloadMeme:', error)
      return false
    }
  }

  /**
   * View meme
   */
  static async viewMeme(memeId: string, userWalletAddress: string): Promise<boolean> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, cannot view meme')
        return false
      }

      const { error } = await supabaseClient
        .from('user_interactions')
        .insert({
          meme_id: memeId,
          user_wallet_address: userWalletAddress,
          interaction_type: 'view'
        })

      if (error) {
        console.error('Error viewing meme:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in viewMeme:', error)
      return false
    }
  }

  /**
   * Xóa meme
   */
  static async deleteMeme(memeId: string, userWalletAddress: string): Promise<boolean> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, cannot delete meme')
        return false
      }

      const { error } = await supabaseClient
        .from('memes')
        .delete()
        .eq('id', memeId)
        .eq('author_wallet_address', userWalletAddress)

      if (error) {
        console.error('Error deleting meme:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteMeme:', error)
      return false
    }
  }

  /**
   * Cập nhật meme
   */
  static async updateMeme(
    memeId: string,
    updates: Partial<MemeUpdate>,
    userWalletAddress: string
  ): Promise<Meme | null> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, cannot update meme')
        return null
      }

      const { data, error } = await supabaseClient
        .from('memes')
        .update(updates)
        .eq('id', memeId)
        .eq('author_wallet_address', userWalletAddress)
        .select()
        .single()

      if (error) {
        console.error('Error updating meme:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateMeme:', error)
      return null
    }
  }

  /**
   * Tìm kiếm memes
   */
  static async searchMemes(query: string, limit: number = 20): Promise<Meme[]> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, returning empty search results')
        return []
      }

      const { data, error } = await supabaseClient
        .from('memes')
        .select('*')
        .eq('is_public', true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error searching memes:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in searchMemes:', error)
      return []
    }
  }

  /**
   * Lấy memes theo tags
   */
  static async getMemesByTags(tags: string[], limit: number = 20): Promise<Meme[]> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Supabase not configured, returning empty memes by tags array')
        return []
      }

      const { data, error } = await supabaseClient
        .from('memes')
        .select('*')
        .eq('is_public', true)
        .overlaps('tags', tags)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching memes by tags:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getMemesByTags:', error)
      return []
    }
  }
}

// Export default instance
export default MemeService
