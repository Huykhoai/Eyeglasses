# VNOptic - Hệ thống Quản lý Mắt kính Doanh nghiệp

## 🚀 Giới thiệu

VNOptic là hệ thống quản lý mắt kính chuyên nghiệp được xây dựng bằng React + TypeScript + Vite, với giao diện hiện đại và thân thiện với người dùng.

## 📋 Tính năng hiện tại

- ✅ **Trang đăng nhập chuyên nghiệp** với giao diện hiện đại
- ✅ **React Router** để điều hướng giữa các trang
- ✅ **Dashboard** cơ bản sau khi đăng nhập
- ✅ **Responsive design** tương thích với mọi thiết bị

## 🛠️ Công nghệ sử dụng

- **React 19** - Thư viện UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router DOM** - Routing
- **CSS3** - Styling với animations và gradients

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

## 🎨 Cấu trúc dự án

```
vnoptic_fe/
├── src/
│   ├── pages/
│   │   ├── Login/
│   │   │   ├── Login.tsx       # Component trang đăng nhập
│   │   │   └── Login.css       # Styles cho trang đăng nhập
│   │   └── Dashboard/
│   │       ├── Dashboard.tsx   # Component trang dashboard
│   │       └── Dashboard.css   # Styles cho dashboard
│   ├── App.tsx                 # Router configuration
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── package.json
└── vite.config.ts
```

## 🔐 Sử dụng

### Trang đăng nhập

1. Mở trình duyệt và truy cập `http://localhost:5173`
2. Bạn sẽ thấy trang đăng nhập với:
   - Logo và branding VNOptic
   - Form đăng nhập với email và password
   - Tùy chọn "Ghi nhớ đăng nhập"
   - Hiệu ứng animation đẹp mắt
3. Nhập thông tin và nhấn "Đăng nhập" để chuyển đến Dashboard

### Dashboard

- Sau khi đăng nhập thành công, bạn sẽ được chuyển đến trang Dashboard
- Dashboard hiển thị các module chính của hệ thống:
  - 📦 Quản lý kho
  - 👥 Khách hàng
  - 📊 Báo cáo
  - ⚙️ Cài đặt

## 🎯 Roadmap

- [ ] Tích hợp API authentication
- [ ] Quản lý state với Context API hoặc Redux
- [ ] Xây dựng module Quản lý kho
- [ ] Xây dựng module Khách hàng
- [ ] Xây dựng module Báo cáo
- [ ] Xây dựng module Cài đặt
- [ ] Thêm protected routes
- [ ] Thêm role-based access control

## 🎨 Thiết kế

Giao diện được thiết kế theo phong cách:
- **Modern & Professional** - Phù hợp với doanh nghiệp
- **Gradient colors** - Sử dụng màu gradient tím (#667eea → #764ba2)
- **Smooth animations** - Hiệu ứng chuyển động mượt mà
- **Glassmorphism** - Hiệu ứng kính mờ hiện đại
- **Responsive** - Tương thích với mọi kích thước màn hình

## 📝 Ghi chú

- Hiện tại chức năng đăng nhập chỉ là demo, chưa kết nối với backend
- Khi nhấn "Đăng nhập", hệ thống sẽ tự động chuyển đến Dashboard
- Cần implement authentication logic thực tế trong tương lai

## 👨‍💻 Phát triển

Để thêm trang mới:

1. Tạo folder mới trong `src/pages/`
2. Tạo component và CSS file
3. Thêm route vào `App.tsx`
4. Import và sử dụng trong navigation

## 📄 License

Private project for enterprise use.
