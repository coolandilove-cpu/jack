# 🍭 Hướng dẫn Test Chức năng Lưu Candy vào Supabase

## 📋 Bước 1: Chạy các file SQL còn thiếu

Bạn cần chạy thêm các file SQL sau trong Supabase SQL Editor:

### **Thứ tự chạy:**
```sql
-- 1. Đã chạy rồi ✅
\i 01_create_users_table.sql

-- 2. Chạy file này để tạo bảng memes
\i 02_create_memes_table.sql

-- 3. Chạy file này để tạo bảng interactions
\i 03_create_user_interactions_table.sql

-- 4. Chạy file này để tạo functions và triggers
\i 04_create_functions_and_triggers.sql

-- 5. Chạy file này để setup bảo mật
\i 05_create_rls_policies.sql
```

## 📋 Bước 2: Setup Environment Variables

Tạo file `.env.local` trong thư mục `jack_sunny_v0/`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 Bước 3: Test Chức năng

### **3.1. Khởi động ứng dụng:**
```bash
cd jack_sunny_v0
npm run dev
```

### **3.2. Test kết nối ví:**
1. Mở `http://localhost:3000/gene`
2. Click "Connect Wallet" 
3. Kết nối Phantom Wallet
4. Kiểm tra console logs:
   ```
   Saving user to Supabase: { walletAddress, walletType }
   User saved successfully: { user data }
   ```

### **3.3. Test tạo và lưu candy:**
1. Tạo candy trong gene page
2. Click "Save to Dashboard" button
3. Kiểm tra console logs:
   ```
   Saving candy to dashboard...
   Creating meme from candy: { title, tags, authorWalletAddress }
   Meme created successfully: { meme data }
   Candy saved successfully to dashboard: { savedMeme }
   ```
4. Xem alert: "Candy saved to dashboard successfully!"

### **3.4. Kiểm tra database:**
1. Vào Supabase Dashboard > **Table Editor**
2. Kiểm tra bảng `users` có user mới
3. Kiểm tra bảng `memes` có candy mới
4. Kiểm tra bảng `user_interactions` (nếu có)

## 🔍 Debug và Troubleshooting

### **Lỗi "Table doesn't exist":**
- Chạy lại các file SQL theo đúng thứ tự
- Kiểm tra foreign key constraints

### **Lỗi "RLS policy":**
- Đảm bảo đã chạy file `05_create_rls_policies.sql`
- Kiểm tra RLS đã được enable

### **Lỗi "Invalid API key":**
- Kiểm tra lại environment variables
- Restart development server

### **Candy không được lưu:**
- Kiểm tra console logs
- Kiểm tra network tab trong DevTools
- Kiểm tra Supabase logs

## 📊 Database Schema sau khi chạy

```
users (wallet_address, wallet_type, profile_data)
  ↓
memes (title, image_base64, author_wallet_address, tags, stats)
  ↓
user_interactions (user_wallet_address, meme_id, interaction_type)
```

## 🎯 Tính năng đã implement

✅ **Auto User Creation** - Tự động tạo user khi kết nối ví
✅ **Candy Generation** - Tạo candy với canvas
✅ **Save to Supabase** - Lưu candy vào database
✅ **localStorage Fallback** - Fallback nếu Supabase lỗi
✅ **Auto Triggers** - Tự động update interaction counts
✅ **RLS Security** - Bảo mật dữ liệu theo user

## 🚀 Next Steps

1. **Test với nhiều candy types**
2. **Kiểm tra dashboard hiển thị candy**
3. **Test interactions (like, share, download)**
4. **Setup Supabase Storage cho images**
5. **Implement real-time updates**

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Kiểm tra Supabase Dashboard logs
3. Verify database schema
4. Check environment variables






