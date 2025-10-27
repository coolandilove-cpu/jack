-- =====================================================
-- 05. CREATE ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Tạo các policies để bảo mật dữ liệu với Row Level Security

-- Enable RLS cho tất cả tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users có thể đọc thông tin public của tất cả users
CREATE POLICY "Users can view public user info" ON users
  FOR SELECT USING (true);

-- Users có thể update thông tin của chính họ
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = wallet_address);

-- Users có thể insert thông tin của chính họ
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = wallet_address);

-- =====================================================
-- MEMES TABLE POLICIES
-- =====================================================

-- Tất cả users có thể đọc public memes
CREATE POLICY "Anyone can view public memes" ON memes
  FOR SELECT USING (is_public = true);

-- Users có thể đọc memes của chính họ (kể cả private)
CREATE POLICY "Users can view own memes" ON memes
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = author_wallet_address);

-- Users có thể insert memes với author là chính họ
CREATE POLICY "Users can create own memes" ON memes
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = author_wallet_address);

-- Users có thể update memes của chính họ
CREATE POLICY "Users can update own memes" ON memes
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = author_wallet_address);

-- Users có thể delete memes của chính họ
CREATE POLICY "Users can delete own memes" ON memes
  FOR DELETE USING (auth.jwt() ->> 'wallet_address' = author_wallet_address);

-- =====================================================
-- USER INTERACTIONS TABLE POLICIES
-- =====================================================

-- Users có thể đọc interactions của chính họ
CREATE POLICY "Users can view own interactions" ON user_interactions
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = user_wallet_address);

-- Users có thể tạo interactions với wallet address của chính họ
CREATE POLICY "Users can create own interactions" ON user_interactions
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = user_wallet_address);

-- Users có thể update interactions của chính họ
CREATE POLICY "Users can update own interactions" ON user_interactions
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = user_wallet_address);

-- Users có thể delete interactions của chính họ
CREATE POLICY "Users can delete own interactions" ON user_interactions
  FOR DELETE USING (auth.jwt() ->> 'wallet_address' = user_wallet_address);

-- =====================================================
-- HELPER FUNCTIONS FOR AUTH
-- =====================================================

-- Function để get current user wallet address từ JWT
CREATE OR REPLACE FUNCTION get_current_wallet_address()
RETURNS TEXT AS $$
BEGIN
  RETURN auth.jwt() ->> 'wallet_address';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Implement admin check logic here
  -- Có thể dựa vào wallet address hoặc role trong JWT
  RETURN false; -- Placeholder
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON FUNCTION get_current_wallet_address() IS 'Lấy wallet address hiện tại từ JWT token';
COMMENT ON FUNCTION is_admin() IS 'Kiểm tra xem user có phải admin không';






