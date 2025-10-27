# 🔧 Environment Variables Check

## 🚨 Vấn đề: Network không call tới Supabase

### **🔍 Nguyên nhân có thể:**

1. **Environment variables chưa được set**
2. **Supabase client chưa được khởi tạo đúng**
3. **onConnect callback không được trigger**

### **📋 Cách kiểm tra:**

#### **1. Kiểm tra Environment Variables:**

Tạo file `.env.local` trong thư mục `jack_sunny_v0/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **2. Restart Development Server:**

```bash
# Stop server (Ctrl+C)
npm run dev
```

#### **3. Kiểm tra Console Logs:**

Khi kết nối ví, bạn sẽ thấy logs:

```
🔗 Wallet connected: Phantom
💾 Saving user to Supabase: { walletAddress: "...", walletType: "phantom" }
🔍 Testing Supabase environment variables...
NEXT_PUBLIC_SUPABASE_URL: Set
NEXT_PUBLIC_SUPABASE_ANON_KEY: Set
```

#### **4. Kiểm tra Network Tab:**

Trong Network tab, bạn sẽ thấy requests tới:
- `https://your-project-id.supabase.co/rest/v1/users`
- `https://your-project-id.supabase.co/rest/v1/memes`

### **🔧 Debug Steps:**

#### **A. Nếu Environment Variables Missing:**
```
NEXT_PUBLIC_SUPABASE_URL: Missing
NEXT_PUBLIC_SUPABASE_ANON_KEY: Missing
```

**Fix:** Tạo file `.env.local` với đúng values

#### **B. Nếu Environment Variables Set nhưng vẫn không call:**
```
NEXT_PUBLIC_SUPABASE_URL: Set
NEXT_PUBLIC_SUPABASE_ANON_KEY: Set
```

**Fix:** Kiểm tra Supabase project settings

#### **C. Nếu onConnect không được trigger:**
Không thấy logs `🔗 Wallet connected:`

**Fix:** Kiểm tra wallet connection flow

### **📊 Expected Network Requests:**

Khi kết nối ví thành công, bạn sẽ thấy:

1. **GET** `/rest/v1/users?wallet_address=eq.{wallet_address}`
2. **POST** `/rest/v1/users` (nếu user mới)
3. **PATCH** `/rest/v1/users` (nếu user đã tồn tại)

### **🚀 Test Commands:**

#### **Test Environment Variables:**
```javascript
// Trong browser console
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

#### **Test Supabase Connection:**
```javascript
// Trong browser console
import { supabaseClient } from '/src/lib/supabase'
supabaseClient.from('users').select('count').then(console.log)
```

### **📝 Checklist:**

- [ ] File `.env.local` tồn tại
- [ ] Environment variables được set đúng
- [ ] Development server đã restart
- [ ] Console logs hiển thị đúng
- [ ] Network requests tới Supabase
- [ ] Supabase project active
- [ ] Database tables tồn tại

### **🆘 Nếu vẫn không hoạt động:**

1. **Kiểm tra Supabase Dashboard:**
   - Project status
   - API settings
   - Database tables

2. **Kiểm tra Browser Console:**
   - Error messages
   - Network requests
   - Environment variables

3. **Test với trang `/wallet-test`:**
   - Vào `http://localhost:3000/wallet-test`
   - Click "Test Connection Flow"
   - Xem kết quả






