# 🚀 Supabase Setup Guide cho Jack Liam

## 📋 Bước 1: Tạo Supabase Project

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Chọn organization và tạo project mới
4. Đặt tên project: `jack-liam-platform`
5. Chọn region gần nhất (Singapore cho Việt Nam)
6. Tạo database password mạnh
7. Click "Create new project"

## 📋 Bước 2: Setup Database Schema

1. Vào **SQL Editor** trong Supabase Dashboard
2. Chạy các file SQL theo thứ tự:

```sql
-- Chạy từng file theo thứ tự
\i 01_create_users_table.sql
\i 02_create_memes_table.sql
\i 03_create_user_interactions_table.sql
\i 04_create_candy_templates_table.sql
\i 05_create_system_settings_table.sql
\i 06_create_functions_and_triggers.sql
\i 07_create_rls_policies.sql
\i 08_create_indexes_and_optimization.sql
```

**Hoặc copy-paste từng file SQL vào SQL Editor và chạy.**

## 📋 Bước 3: Lấy API Keys

1. Vào **Settings** > **API**
2. Copy các thông tin sau:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📋 Bước 4: Setup Environment Variables

1. Tạo file `.env.local` trong thư mục `jack_sunny_v0/`
2. Thêm các biến môi trường:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Service Role Key (chỉ dùng cho server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📋 Bước 5: Test Connection

1. Chạy development server:
```bash
cd jack_sunny_v0
npm run dev
```

2. Mở browser và vào `http://localhost:3000`
3. Kết nối Phantom Wallet
4. Kiểm tra console để xem logs:
   - `Saving user to Supabase: { walletAddress, walletType }`
   - `User saved successfully: { user data }`

## 📋 Bước 6: Verify Database

1. Vào Supabase Dashboard > **Table Editor**
2. Kiểm tra bảng `users` có dữ liệu mới không
3. Kiểm tra bảng `system_settings` có default settings không

## 🔧 Troubleshooting

### Lỗi "Invalid API key"
- Kiểm tra lại `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Đảm bảo không có khoảng trắng thừa

### Lỗi "Table doesn't exist"
- Chạy lại các file SQL theo đúng thứ tự
- Kiểm tra database schema trong Supabase Dashboard

### Lỗi "RLS policy"
- Đảm bảo đã chạy file `07_create_rls_policies.sql`
- Kiểm tra RLS đã được enable cho các tables

### User không được tạo
- Kiểm tra console logs
- Kiểm tra network tab trong DevTools
- Kiểm tra Supabase logs trong Dashboard

## 📊 Database Schema Overview

```
users (wallet_address, wallet_type, profile_data)
  ↓
memes (title, image_url, author_wallet_address, tags, stats)
  ↓
user_interactions (user_wallet_address, meme_id, interaction_type)

candy_templates (name, template_data, category)
system_settings (setting_key, setting_value)
```

## 🎯 Features đã implement

✅ **User Management**
- Tự động tạo user khi kết nối ví
- Lưu thông tin wallet và profile
- Update last_active_at khi có activity

✅ **Profile Management**
- Edit username, bio, preferences
- Theme settings (light/dark/auto)
- Notification preferences
- Public profile toggle

✅ **Dashboard Integration**
- Hiển thị thông tin user trong dashboard
- User profile card với edit functionality
- Real-time user data loading

✅ **Security**
- Row Level Security (RLS) policies
- Wallet-based authentication
- Data isolation theo user

## 🚀 Next Steps

1. **Test user creation** bằng cách kết nối ví
2. **Migrate memes** từ localStorage sang Supabase
3. **Implement real-time features** cho likes/shares
4. **Add user analytics** và statistics
5. **Setup Supabase Storage** cho images

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Kiểm tra Supabase Dashboard logs
3. Verify database schema
4. Check environment variables






