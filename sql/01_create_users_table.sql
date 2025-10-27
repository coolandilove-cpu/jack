-- =====================================================
-- 01. CREATE USERS TABLE
-- =====================================================
-- Tạo bảng users để lưu trữ thông tin kết nối ví
-- Mỗi wallet address sẽ có một record duy nhất

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  wallet_type TEXT DEFAULT 'phantom' CHECK (wallet_type IN ('phantom', 'solflare', 'backpack')),
  first_connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  profile_data JSONB DEFAULT '{}', -- Lưu thông tin profile tùy chỉnh
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tối ưu query
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Tạo trigger để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE users IS 'Bảng lưu trữ thông tin người dùng và kết nối ví';
COMMENT ON COLUMN users.wallet_address IS 'Địa chỉ ví Solana (public key)';
COMMENT ON COLUMN users.wallet_type IS 'Loại ví (phantom, solflare, backpack)';
COMMENT ON COLUMN users.first_connected_at IS 'Thời gian kết nối ví lần đầu';
COMMENT ON COLUMN users.last_active_at IS 'Thời gian hoạt động cuối cùng';
COMMENT ON COLUMN users.is_active IS 'Trạng thái hoạt động của user';
COMMENT ON COLUMN users.profile_data IS 'Dữ liệu profile tùy chỉnh (JSON)';






