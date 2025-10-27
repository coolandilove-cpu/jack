# 🔧 Debug Supabase Connection Issues

## 🚨 Lỗi hiện tại:
```
Error: Error creating meme: {}
```

## 🔍 Các bước debug:

### **1. Kiểm tra Environment Variables**
Đảm bảo file `.env.local` có đúng:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **2. Kiểm tra Database Schema**
Chạy các file SQL theo thứ tự:
```sql
-- 1. Users table
\i 01_create_users_table.sql

-- 2. Memes table  
\i 02_create_memes_table.sql

-- 3. User interactions table
\i 03_create_user_interactions_table.sql

-- 4. Functions and triggers
\i 04_create_functions_and_triggers.sql

-- 5. RLS policies
\i 05_create_rls_policies.sql
```

### **3. Kiểm tra Console Logs**
Khi click "Save to Dashboard", xem console logs:

**Expected logs:**
```
Saving candy to dashboard...
Testing Supabase connection...
Supabase test results: { connection: { success: true }, userTable: { success: true }, memeTable: { success: true }, allPassed: true }
Generated title and tags: { title: "...", tags: [...] }
Candy data prepared: { title: "...", tags: [...], canvasSize: "490x660" }
Starting saveCandyToSupabase: { title: "...", tags: [...], walletAddress: "...", hasCanvas: true }
Creating meme from candy: { title: "...", tags: [...], authorWalletAddress: "...", canvasWidth: 490, canvasHeight: 660 }
Canvas converted to base64, length: 12345
Inserting meme data: { title: "...", author_wallet_address: "...", tags: [...], hasImage: true }
Meme created successfully: { id: "...", title: "...", ... }
```

### **4. Các lỗi có thể gặp:**

#### **A. Environment Variables không đúng:**
```
Error: Invalid API key
```
**Fix:** Kiểm tra lại `.env.local` và restart server

#### **B. Database schema chưa tạo:**
```
Error: relation "memes" does not exist
```
**Fix:** Chạy các file SQL theo thứ tự

#### **C. RLS policies chặn:**
```
Error: new row violates row-level security policy
```
**Fix:** Kiểm tra RLS policies trong file `05_create_rls_policies.sql`

#### **D. Foreign key constraint:**
```
Error: insert or update on table "memes" violates foreign key constraint
```
**Fix:** Đảm bảo user đã tồn tại trong bảng `users`

#### **E. Canvas không hợp lệ:**
```
Error: Invalid canvas
```
**Fix:** Đảm bảo canvas đã được render đầy đủ

### **5. Test Manual:**

#### **A. Test Supabase Connection:**
```javascript
// Trong browser console
import { runAllTests } from '/src/lib/supabase-test'
runAllTests().then(console.log)
```

#### **B. Test Database Access:**
```sql
-- Trong Supabase SQL Editor
SELECT * FROM users LIMIT 1;
SELECT * FROM memes LIMIT 1;
```

#### **C. Test RLS Policies:**
```sql
-- Trong Supabase SQL Editor
SELECT * FROM memes WHERE is_public = true LIMIT 1;
```

### **6. Common Solutions:**

#### **A. Restart Development Server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

#### **B. Clear Browser Cache:**
- Hard refresh (Ctrl+Shift+R)
- Clear localStorage
- Check Network tab for failed requests

#### **C. Check Supabase Dashboard:**
- Go to Supabase Dashboard
- Check Logs for errors
- Verify tables exist
- Check RLS policies

### **7. Debug Steps:**

1. **Check console logs** for detailed error messages
2. **Verify environment variables** are correct
3. **Run Supabase tests** to check connection
4. **Check database schema** is complete
5. **Verify RLS policies** allow inserts
6. **Test with simple data** first

### **8. Fallback Options:**

Nếu Supabase không hoạt động, hệ thống sẽ tự động fallback về localStorage:
```
Falling back to localStorage only
```

### **9. Contact Support:**

Nếu vẫn gặp lỗi, cung cấp:
- Console logs đầy đủ
- Environment variables (ẩn API key)
- Supabase project settings
- Database schema status






