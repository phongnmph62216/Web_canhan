# Hướng dẫn cài đặt EmailJS để gửi email từ form liên hệ

## Bước 1: Tạo tài khoản EmailJS
1. Truy cập https://www.emailjs.com/
2. Đăng ký tài khoản miễn phí (có thể dùng Google/GitHub)

## Bước 2: Cài đặt Email Service
1. Trong Dashboard, chọn **Email Services**
2. Chọn **Add Service** 
3. Chọn Gmail (hoặc email provider khác)
4. Nhập thông tin email của bạn
5. Lưu **Service ID** (ví dụ: `service_abc123`)

## Bước 3: Tạo Email Template
1. Chọn **Email Templates**
2. Chọn **Create New Template**
3. Thiết kế template với các biến:
   ```
   Tên: {{from_name}}
   Email: {{from_email}}
   Tiêu đề: {{subject}}
   Nội dung: {{message}}
   ```
4. Lưu **Template ID** (ví dụ: `template_xyz789`)

## Bước 4: Lấy Public Key
1. Vào **Account** > **General**
2. Copy **Public Key** (ví dụ: `user_abcdefghijk`)

## Bước 5: Cập nhật code
Mở file `script.js` và thay đổi:

```javascript
// Thay YOUR_PUBLIC_KEY bằng Public Key của bạn
emailjs.init("user_abcdefghijk"); 

// Thay YOUR_SERVICE_ID và YOUR_TEMPLATE_ID
emailjs.send('service_abc123', 'template_xyz789', templateParams)

// Thay your-email@gmail.com bằng email nhận tin nhắn
to_email: 'your-email@gmail.com'
```

## Bước 6: Test
1. Mở trang contact.html
2. Điền form và gửi thử
3. Kiểm tra email để xem có nhận được tin nhắn không

## Lưu ý:
- EmailJS miễn phí cho 200 email/tháng
- Cần kích hoạt "Allow less secure app access" nếu dùng Gmail
- Hoặc tạo App Password cho Gmail