-- =====================================================
-- 04. CREATE FUNCTIONS AND TRIGGERS
-- =====================================================
-- Tạo các functions và triggers để tự động hóa các tác vụ

-- Function để update interaction counts trong memes table
CREATE OR REPLACE FUNCTION update_meme_interaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update counts based on interaction type
  IF TG_OP = 'INSERT' THEN
    CASE NEW.interaction_type
      WHEN 'like' THEN
        UPDATE memes SET likes = likes + 1 WHERE id = NEW.meme_id;
      WHEN 'share' THEN
        UPDATE memes SET shares = shares + 1 WHERE id = NEW.meme_id;
      WHEN 'download' THEN
        UPDATE memes SET downloads = downloads + 1 WHERE id = NEW.meme_id;
      WHEN 'view' THEN
        UPDATE memes SET view_count = view_count + 1 WHERE id = NEW.meme_id;
    END CASE;
  ELSIF TG_OP = 'DELETE' THEN
    CASE OLD.interaction_type
      WHEN 'like' THEN
        UPDATE memes SET likes = GREATEST(likes - 1, 0) WHERE id = OLD.meme_id;
      WHEN 'share' THEN
        UPDATE memes SET shares = GREATEST(shares - 1, 0) WHERE id = OLD.meme_id;
      WHEN 'download' THEN
        UPDATE memes SET downloads = GREATEST(downloads - 1, 0) WHERE id = OLD.meme_id;
    END CASE;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger để tự động update interaction counts
CREATE TRIGGER trigger_update_meme_interaction_counts
  AFTER INSERT OR DELETE ON user_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_meme_interaction_counts();

-- Function để update user last_active_at
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_active_at khi có interaction mới
  UPDATE users 
  SET last_active_at = NOW() 
  WHERE wallet_address = NEW.user_wallet_address;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger để update user activity
CREATE TRIGGER trigger_update_user_last_active
  AFTER INSERT ON user_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_active();

-- Function để get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_wallet TEXT)
RETURNS TABLE (
  total_memes BIGINT,
  total_likes BIGINT,
  total_shares BIGINT,
  total_downloads BIGINT,
  total_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(m.id) as total_memes,
    COALESCE(SUM(m.likes), 0) as total_likes,
    COALESCE(SUM(m.shares), 0) as total_shares,
    COALESCE(SUM(m.downloads), 0) as total_downloads,
    COALESCE(SUM(m.view_count), 0) as total_views
  FROM memes m
  WHERE m.author_wallet_address = user_wallet;
END;
$$ LANGUAGE plpgsql;

-- Function để get trending memes
CREATE OR REPLACE FUNCTION get_trending_memes(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  title TEXT,
  image_url TEXT,
  likes INTEGER,
  shares INTEGER,
  downloads INTEGER,
  view_count INTEGER,
  author_wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  trending_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.title,
    m.image_url,
    m.likes,
    m.shares,
    m.downloads,
    m.view_count,
    m.author_wallet_address,
    m.created_at,
    -- Trending score: likes*2 + shares*3 + downloads*1 + views*0.1
    (m.likes * 2 + m.shares * 3 + m.downloads * 1 + m.view_count * 0.1) as trending_score
  FROM memes m
  WHERE m.is_public = true
  ORDER BY trending_score DESC, m.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION update_meme_interaction_counts() IS 'Tự động update số lượng interactions trong memes table';
COMMENT ON FUNCTION update_user_last_active() IS 'Tự động update thời gian hoạt động cuối của user';
COMMENT ON FUNCTION get_user_stats(TEXT) IS 'Lấy thống kê của user';
COMMENT ON FUNCTION get_trending_memes(INTEGER) IS 'Lấy danh sách memes trending';






