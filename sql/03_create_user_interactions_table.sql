-- =====================================================
-- 03. CREATE USER INTERACTIONS TABLE
-- =====================================================
-- Tạo bảng user_interactions để theo dõi các tương tác
-- (like, share, download) của user với memes

CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT NOT NULL,
  meme_id UUID NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'share', 'download', 'view')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraints
  CONSTRAINT fk_interactions_user 
    FOREIGN KEY (user_wallet_address) 
    REFERENCES users(wallet_address) 
    ON DELETE CASCADE,
  CONSTRAINT fk_interactions_meme 
    FOREIGN KEY (meme_id) 
    REFERENCES memes(id) 
    ON DELETE CASCADE,
  
  -- Unique constraint để tránh duplicate interactions
  -- (trừ view - có thể view nhiều lần)
  CONSTRAINT unique_user_meme_interaction 
    UNIQUE(user_wallet_address, meme_id, interaction_type)
);

-- Tạo indexes
CREATE INDEX IF NOT EXISTS idx_interactions_user ON user_interactions(user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_interactions_meme ON user_interactions(meme_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON user_interactions(created_at DESC);

-- Comments
COMMENT ON TABLE user_interactions IS 'Bảng theo dõi tương tác của user với memes';
COMMENT ON COLUMN user_interactions.user_wallet_address IS 'Địa chỉ ví của user tương tác';
COMMENT ON COLUMN user_interactions.meme_id IS 'ID của meme được tương tác';
COMMENT ON COLUMN user_interactions.interaction_type IS 'Loại tương tác (like, share, download, view)';
COMMENT ON COLUMN user_interactions.created_at IS 'Thời gian tương tác';