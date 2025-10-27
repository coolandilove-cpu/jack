# 🗄️ Jack Liam Database Schema

Thư mục này chứa tất cả các file SQL để setup database cho Jack Liam platform với Supabase.

## 📋 Thứ tự thực hiện

Chạy các file SQL theo thứ tự sau:

### 1. **01_create_users_table.sql**
- Tạo bảng `users` để lưu trữ thông tin kết nối ví
- Bao gồm: wallet_address, wallet_type, profile_data, timestamps
- Tạo indexes và triggers

### 2. **02_create_memes_table.sql**
- Tạo bảng `memes` để lưu trữ candy creations và memes
- Bao gồm: title, image_url, likes, shares, downloads, tags, author
- Liên kết với users table qua wallet_address

### 3. **03_create_user_interactions_table.sql**
- Tạo bảng `user_interactions` để theo dõi tương tác
- Bao gồm: like, share, download, view
- Unique constraints để tránh duplicate

### 4. **04_create_candy_templates_table.sql**
- Tạo bảng `candy_templates` để lưu trữ template candy
- Bao gồm: template_data (JSON), preview_image, category
- Hỗ trợ system templates và user-created templates

### 5. **05_create_system_settings_table.sql**
- Tạo bảng `system_settings` để lưu cấu hình hệ thống
- Bao gồm: app settings, limits, feature flags
- Insert default settings

### 6. **06_create_functions_and_triggers.sql**
- Tạo các functions và triggers tự động
- Auto-update interaction counts
- User activity tracking
- Analytics functions

### 7. **07_create_rls_policies.sql**
- Setup Row Level Security (RLS)
- Tạo policies cho từng table
- Bảo mật dữ liệu theo wallet_address

### 8. **08_create_indexes_and_optimization.sql**
- Tạo composite indexes cho performance
- Full-text search indexes
- Analytics và trending indexes
- Maintenance functions

### 9. **09_sample_data_and_seeds.sql**
- Insert dữ liệu mẫu cho development
- Sample users, memes, templates, interactions
- Chỉ dùng cho testing

### 10. **10_migration_from_localstorage.sql**
- Functions để migrate từ localStorage
- Batch migration functions
- Validation và cleanup functions

## 🚀 Cách sử dụng

### Setup Database:
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

### Development Data:
```sql
-- Chỉ chạy trong development
\i 09_sample_data_and_seeds.sql
```

### Migration:
```sql
-- Khi migrate từ localStorage
\i 10_migration_from_localstorage.sql
```

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

## 🔐 Security Features

- **Row Level Security (RLS)** enabled cho tất cả tables
- **JWT-based authentication** với wallet_address
- **Policy-based access control**
- **Data isolation** theo user wallet

## ⚡ Performance Features

- **Composite indexes** cho common queries
- **Partial indexes** cho filtered data
- **Full-text search** cho memes và templates
- **Analytics views** cho reporting
- **Auto-updating triggers** cho real-time stats

## 🛠️ Maintenance

- **Cleanup functions** cho old data
- **Statistics update** functions
- **Migration tracking** với migration_log table
- **Validation functions** cho data integrity

## 📝 Notes

- Tất cả timestamps sử dụng `TIMESTAMP WITH TIME ZONE`
- UUID được sử dụng cho primary keys
- JSONB được sử dụng cho flexible data
- Array types được sử dụng cho tags
- Foreign key constraints với CASCADE deletes

## 🔄 Migration từ localStorage

1. Export data từ localStorage
2. Chạy migration functions
3. Validate migration results
4. Cleanup duplicate data
5. Update application code để sử dụng Supabase

## 📞 Support

Nếu có vấn đề với database schema, hãy kiểm tra:
1. Thứ tự chạy các file SQL
2. Permissions và RLS policies
3. Foreign key constraints
4. Index performance






