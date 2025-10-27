-- =====================================================
-- 02. CREATE MEMES TABLE
-- =====================================================
-- Tạo bảng memes để lưu trữ các candy creations và memes
-- Mỗi meme sẽ liên kết với một user thông qua wallet_address

CREATE TABLE IF NOT EXISTS memes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT, -- URL từ Supabase Storage
  image_base64 TEXT, -- Base64 fallback cho compatibility
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  shares INTEGER DEFAULT 0 CHECK (shares >= 0),
  downloads INTEGER DEFAULT 0 CHECK (downloads >= 0),
  tags TEXT[] DEFAULT '{}', -- Array of tags
  author_wallet_address TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false, -- Meme nổi bật
  view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraint
  CONSTRAINT fk_memes_author 
    FOREIGN KEY (author_wallet_address) 
    REFERENCES users(wallet_address) 
    ON DELETE CASCADE
);

-- Tạo indexes để tối ưu query
CREATE INDEX IF NOT EXISTS idx_memes_author ON memes(author_wallet_address);
CREATE INDEX IF NOT EXISTS idx_memes_created_at ON memes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memes_is_public ON memes(is_public);
CREATE INDEX IF NOT EXISTS idx_memes_is_featured ON memes(is_featured);
CREATE INDEX IF NOT EXISTS idx_memes_likes ON memes(likes DESC);
CREATE INDEX IF NOT EXISTS idx_memes_tags ON memes USING GIN(tags);

-- Tạo trigger để tự động update updated_at
CREATE TRIGGER update_memes_updated_at 
    BEFORE UPDATE ON memes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE memes IS 'Bảng lưu trữ các meme và candy creations';
COMMENT ON COLUMN memes.title IS 'Tiêu đề của meme';
COMMENT ON COLUMN memes.image_url IS 'URL ảnh từ Supabase Storage';
COMMENT ON COLUMN memes.image_base64 IS 'Base64 ảnh (fallback)';
COMMENT ON COLUMN memes.likes IS 'Số lượt like';
COMMENT ON COLUMN memes.shares IS 'Số lượt share';
COMMENT ON COLUMN memes.downloads IS 'Số lượt download';
COMMENT ON COLUMN memes.tags IS 'Array các tags';
COMMENT ON COLUMN memes.author_wallet_address IS 'Địa chỉ ví của tác giả';
COMMENT ON COLUMN memes.description IS 'Mô tả chi tiết';
COMMENT ON COLUMN memes.is_public IS 'Có public hay không';
COMMENT ON COLUMN memes.is_featured IS 'Có được feature hay không';
COMMENT ON COLUMN memes.view_count IS 'Số lượt xem';