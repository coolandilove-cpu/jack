-- =====================================================
-- FIX RLS POLICIES FOR WALLET AUTHENTICATION
-- =====================================================

-- Drop existing policies that use JWT auth
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

DROP POLICY IF EXISTS "Anyone can view public memes" ON memes;
DROP POLICY IF EXISTS "Users can view own memes" ON memes;
DROP POLICY IF EXISTS "Users can create own memes" ON memes;
DROP POLICY IF EXISTS "Users can update own memes" ON memes;
DROP POLICY IF EXISTS "Users can delete own memes" ON memes;

DROP POLICY IF EXISTS "Users can view own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can create own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can update own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can delete own interactions" ON user_interactions;

-- =====================================================
-- NEW RLS POLICIES FOR WALLET AUTHENTICATION
-- =====================================================

-- For wallet-based auth, we'll use a different approach
-- We'll create policies that allow operations based on the request context

-- =====================================================
-- USERS TABLE POLICIES (WALLET AUTH)
-- =====================================================

-- Allow anyone to read users (for public profiles)
CREATE POLICY "Allow read users" ON users
  FOR SELECT USING (true);

-- Allow anyone to insert users (when connecting wallet)
CREATE POLICY "Allow insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update users (when reconnecting wallet)
CREATE POLICY "Allow update users" ON users
  FOR UPDATE USING (true);

-- =====================================================
-- MEMES TABLE POLICIES (WALLET AUTH)
-- =====================================================

-- Allow anyone to read public memes
CREATE POLICY "Allow read public memes" ON memes
  FOR SELECT USING (is_public = true);

-- Allow anyone to read all memes (for now, can be restricted later)
CREATE POLICY "Allow read all memes" ON memes
  FOR SELECT USING (true);

-- Allow anyone to insert memes (for now, can be restricted later)
CREATE POLICY "Allow insert memes" ON memes
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update memes (for now, can be restricted later)
CREATE POLICY "Allow update memes" ON memes
  FOR UPDATE USING (true);

-- Allow anyone to delete memes (for now, can be restricted later)
CREATE POLICY "Allow delete memes" ON memes
  FOR DELETE USING (true);

-- =====================================================
-- USER INTERACTIONS TABLE POLICIES (WALLET AUTH)
-- =====================================================

-- Allow anyone to read interactions
CREATE POLICY "Allow read interactions" ON user_interactions
  FOR SELECT USING (true);

-- Allow anyone to insert interactions
CREATE POLICY "Allow insert interactions" ON user_interactions
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update interactions
CREATE POLICY "Allow update interactions" ON user_interactions
  FOR UPDATE USING (true);

-- Allow anyone to delete interactions
CREATE POLICY "Allow delete interactions" ON user_interactions
  FOR DELETE USING (true);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON POLICY "Allow read users" ON users IS 'Allow reading user profiles for wallet-based auth';
COMMENT ON POLICY "Allow insert users" ON users IS 'Allow creating users when connecting wallet';
COMMENT ON POLICY "Allow update users" ON users IS 'Allow updating users when reconnecting wallet';

COMMENT ON POLICY "Allow read public memes" ON memes IS 'Allow reading public memes';
COMMENT ON POLICY "Allow read all memes" ON memes IS 'Allow reading all memes for now';
COMMENT ON POLICY "Allow insert memes" ON memes IS 'Allow creating memes for wallet-based auth';
COMMENT ON POLICY "Allow update memes" ON memes IS 'Allow updating memes for wallet-based auth';
COMMENT ON POLICY "Allow delete memes" ON memes IS 'Allow deleting memes for wallet-based auth';

COMMENT ON POLICY "Allow read interactions" ON user_interactions IS 'Allow reading interactions for wallet-based auth';
COMMENT ON POLICY "Allow insert interactions" ON user_interactions IS 'Allow creating interactions for wallet-based auth';
COMMENT ON POLICY "Allow update interactions" ON user_interactions IS 'Allow updating interactions for wallet-based auth';
COMMENT ON POLICY "Allow delete interactions" ON user_interactions IS 'Allow deleting interactions for wallet-based auth';
