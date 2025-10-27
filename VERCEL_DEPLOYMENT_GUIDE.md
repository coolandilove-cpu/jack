# 🚀 Hướng dẫn Deploy lên Vercel

## 📋 Chuẩn bị

### Bước 1: Push code lên GitHub
```bash
# Kết nối với GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Bước 2: Chuẩn bị Environment Variables
Copy các biến môi trường cần thiết từ file `.env.local` (nếu có)

---

## 🎯 Triển khai lên Vercel

### **Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)** ⭐

#### 1. Truy cập Vercel
- Vào: https://vercel.com
- Đăng nhập bằng GitHub account

#### 2. Import Project
- Click **"Add New..."** → **"Project"**
- Chọn repository GitHub của bạn
- Click **"Import"**

#### 3. Cấu hình Project
- **Framework Preset**: Next.js (auto-detect)
- **Root Directory**: `./` (mặc định)
- **Build Command**: `npm run build` (mặc định)
- **Output Directory**: `.next` (mặc định)
- **Install Command**: `npm install` (mặc định)

#### 4. Environment Variables (QUAN TRỌNG!) 🔑
Thêm các biến môi trường cần thiết:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Cách thêm:**
- Scroll xuống phần **"Environment Variables"**
- Thêm từng biến (Key và Value)
- Hoặc có thể thêm sau trong Settings → Environment Variables

#### 5. Deploy!
- Click **"Deploy"**
- Đợi build (khoảng 2-3 phút)
- ✅ Xong! Site sẽ có URL: `https://your-project.vercel.app`

---

### **Cách 2: Deploy qua Vercel CLI**

#### 1. Cài đặt Vercel CLI
```bash
npm install -g vercel
```

#### 2. Đăng nhập Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

#### 4. Thêm Environment Variables (nếu cần)
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 🔄 Auto-Deploy

Sau lần đầu deploy, mỗi khi bạn push code lên GitHub:
- ✅ Vercel tự động build và deploy
- ✅ Preview URL cho mỗi PR/commit
- ✅ Production URL khi merge vào main branch

---

## ⚙️ Cấu hình nâng cao

### Thêm Custom Domain
1. Vào Project Settings → Domains
2. Thêm domain của bạn
3. Cập nhật DNS records theo hướng dẫn

### Preview Comments
Vercel tự động comment preview URL vào GitHub PR

### Analytics
Project đã có `@vercel/analytics` - sẽ tự hoạt động khi deploy

---

## 🐛 Troubleshooting

### Build Failed
- Kiểm tra Environment Variables đã đầy đủ
- Xem build logs trong Vercel Dashboard
- Test build local: `npm run build`

### Environment Variables không hoạt động
- Đảm bảo có prefix `NEXT_PUBLIC_` cho client-side variables
- Redeploy sau khi thêm environment variables

### 404 Not Found
- Kiểm tra `next.config.mjs` đã đúng cấu hình
- Kiểm tra routing trong Next.js

---

## 📚 Tài liệu thêm
- Vercel Docs: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
