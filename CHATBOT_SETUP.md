# Hướng dẫn cấu hình Chatbot Portfolio FUGA26

## 📋 Tổng quan

Chatbot FUGA26 là hệ thống chat hỗ trợ khách truy cập website portfolio với các tính năng:
- ✅ Chat tư vấn và giới thiệu về bản thân
- ✅ Lưu lịch sử chat (LocalStorage + API)
- ✅ Hiển thị thông tin dự án khi được hỏi
- ✅ Theo dõi người truy cập
- ✅ Tích hợp AI API (OpenAI/Gemini)

## 🚀 Cách sử dụng cơ bản

Chatbot đã được tích hợp sẵn vào website. Chỉ cần mở bất kỳ trang nào và click vào nút chat ở góc phải dưới.

## ⚙️ Cấu hình nâng cao

### 1. Sử dụng AI API

#### OpenAI (GPT-3.5/GPT-4)

```javascript
window.chatBot = new ChatBot({
    botName: 'FUGA26 Assistant',
    aiProvider: 'openai',
    aiApiKey: 'sk-your-openai-api-key-here'
});
```

#### Google Gemini

```javascript
window.chatBot = new ChatBot({
    botName: 'FUGA26 Assistant',
    aiProvider: 'gemini',
    aiApiKey: 'your-gemini-api-key-here'
});
```

### 2. Kết nối Backend API để lưu lịch sử

```javascript
window.chatBot = new ChatBot({
    botName: 'FUGA26 Assistant',
    apiEndpoint: 'https://your-api.com/api'
});
```

Backend của bạn cần có các endpoints:
- `POST /api/chat/save` - Lưu lịch sử chat
- `POST /api/tracking/visit` - Tracking người dùng

#### Cấu trúc dữ liệu gửi đến `/api/chat/save`:

```json
{
    "sessionId": "session_1234567890_abc123",
    "userId": "user_1234567890_xyz789",
    "messages": [
        {
            "type": "user",
            "message": "Xin chào",
            "timestamp": "2026-02-03T10:30:00.000Z"
        },
        {
            "type": "bot",
            "message": "Xin chào! Tôi có thể giúp gì cho bạn?",
            "timestamp": "2026-02-03T10:30:01.000Z"
        }
    ],
    "userInfo": {
        "userId": "user_1234567890_xyz789",
        "userAgent": "Mozilla/5.0...",
        "language": "vi-VN",
        "screenSize": "1920x1080",
        "timezone": "Asia/Ho_Chi_Minh",
        "referrer": "https://google.com",
        "currentPage": "https://fuga26.com/index.html"
    }
}
```

### 3. Thêm dự án mới

Mở file `chatbot.js` và thêm vào mảng `this.projects`:

```javascript
this.projects = [
    // ... dự án hiện có
    {
        id: 4,
        name: 'Dự án mới',
        category: 'web',
        description: 'Mô tả dự án',
        tags: ['React', 'Node.js', 'MongoDB'],
        status: 'Hoàn thành'
    }
];
```

## 🔧 Tùy chỉnh giao diện

### Thay đổi màu sắc

Mở file `chatbot.css` và chỉnh sửa gradient:

```css
.chat-toggle {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}

.chat-header {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

### Thay đổi kích thước

```css
.chat-window {
    width: 400px;  /* Chiều rộng */
    height: 600px; /* Chiều cao */
}
```

## 📱 Responsive

Chatbot đã được thiết kế responsive và hoạt động tốt trên mọi thiết bị.

## 🌙 Dark Mode

Chatbot tự động hỗ trợ Dark Mode dựa vào cài đặt hệ thống của người dùng.

## 📊 Lấy thống kê chat

```javascript
const stats = window.chatBot.getChatStats();
console.log(stats);
// Output:
// {
//     totalMessages: 10,
//     userMessages: 5,
//     botMessages: 5,
//     sessionId: "session_xxx",
//     userId: "user_xxx"
// }
```

## 🔍 Tìm kiếm dự án

```javascript
const results = window.chatBot.searchProjects('web');
console.log(results);
```

## 🛠️ Backend API mẫu (Node.js/Express)

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// Lưu chat history
app.post('/api/chat/save', async (req, res) => {
    const { sessionId, userId, messages, userInfo } = req.body;
    
    // Lưu vào database
    await ChatHistory.create({
        sessionId,
        userId,
        messages,
        userInfo,
        createdAt: new Date()
    });
    
    res.json({ success: true });
});

// Tracking visit
app.post('/api/tracking/visit', async (req, res) => {
    const visitData = req.body;
    
    await UserVisit.create(visitData);
    
    res.json({ success: true });
});

// Lấy lịch sử chat của user
app.get('/api/chat/history/:userId', async (req, res) => {
    const history = await ChatHistory.find({ 
        userId: req.params.userId 
    }).sort({ createdAt: -1 });
    
    res.json(history);
});

app.listen(3000);
```

## 📧 Hỗ trợ

Nếu cần hỗ trợ, vui lòng liên hệ qua [trang Contact](contact.html).

---

© 2026 FUGA26 - Minh Phong
