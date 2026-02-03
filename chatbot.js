// =====================================================
// CHATBOT SYSTEM FOR PORTFOLIO WEBSITE
// Hệ thống Chat Bot hỗ trợ tư vấn lập trình & portfolio
// Developer Edition - Tập trung vào nghiệp vụ lập trình
// =====================================================

class ChatBot {
    constructor(config = {}) {
        // Cấu hình mặc định
        this.config = {
            botName: 'FUGA26 Bot',
            welcomeMessage: `Xin chào! 👋 Tôi là <strong>FUGA26 Dev Assistant</strong> - trợ lý lập trình của Minh Phong!<br><br>
                Tôi có thể giúp bạn:<br>
                💻 Tư vấn về lập trình (JS, Java, Python...)<br>
                🛠️ Giải đáp về frameworks & tools<br>
                📁 Giới thiệu các dự án portfolio<br>
                🎯 Tips & best practices cho dev<br>
                📞 Liên hệ hợp tác dự án<br><br>
                Hỏi tôi về bất kỳ vấn đề lập trình nào! 🚀`,
            apiEndpoint: config.apiEndpoint || null,
            aiApiKey: config.aiApiKey || null,
            aiProvider: config.aiProvider || 'local',
            ...config
        };

        // Dữ liệu các dự án từ portfolio
        this.projects = [
            {
                id: 1,
                name: 'Website Thời Trang',
                category: 'web',
                description: 'Dự án website với giao diện hiện đại, responsive và trải nghiệm người dùng tốt',
                tags: ['HTML5', 'CSS3', 'JavaScript', 'Vue.js'],
                status: 'Hoàn thành'
            },
            {
                id: 2,
                name: 'Mobile App UI Design',
                category: 'ui',
                description: 'Thiết kế giao diện ứng dụng di động hiện đại và thân thiện với người dùng',
                tags: ['Figma', 'UI/UX', 'Mobile'],
                status: 'Hoàn thành'
            },
            {
                id: 3,
                name: 'Game Application',
                category: 'dev',
                description: 'Dự án phát triển game với đồ họa đẹp mắt và gameplay thú vị',
                tags: ['Unity', 'C#', 'Game Dev'],
                status: 'Đang phát triển'
            }
        ];

        // Thông tin về website
        this.websiteInfo = {
            owner: 'Minh Phong',
            brand: 'FUGA26',
            role: 'Lập Trình Viên WEB',
            github: 'https://github.com/phongnmph62216',
            linkedin: 'https://www.linkedin.com/in/phong-nguyen-minh-aa163b335/',
            twitter: 'http://x.com/phong_minh2601',
            services: ['Phát triển Web', 'Thiết kế UI/UX', 'Mobile App', 'Game Development']
        };

        // Lịch sử chat
        this.chatHistory = [];
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();

        // Khởi tạo
        this.init();
    }

    // Tạo Session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Lấy hoặc tạo User ID
    getUserId() {
        let userId = localStorage.getItem('chatbot_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatbot_user_id', userId);
        }
        return userId;
    }

    // Khởi tạo chatbot
    init() {
        this.createChatWidget();
        this.loadChatHistory();
        this.bindEvents();
        this.trackUserVisit();
    }

    // Tạo giao diện chat widget
    createChatWidget() {
        const chatHTML = `
            <div id="chat-widget" class="chat-widget">
                <!-- Nút mở chat -->
                <button id="chat-toggle" class="chat-toggle" aria-label="Mở chat">
                    <svg class="chat-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
                        <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
                    </svg>
                    <svg class="close-icon" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    <span class="chat-badge" style="display: none;">1</span>
                </button>

                <!-- Cửa sổ chat -->
                <div id="chat-window" class="chat-window">
                    <!-- Header -->
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <div class="chat-avatar">
                                <img src="images/Gemini_Generated_Image_lqh73wlqh73wlqh7.png" alt="Bot Avatar" onerror="this.src='https://ui-avatars.com/api/?name=FUGA26&background=4f46e5&color=fff'">
                                <span class="online-indicator"></span>
                            </div>
                            <div class="chat-header-text">
                                <h4>${this.config.botName}</h4>
                                <span class="chat-status">Trực tuyến</span>
                            </div>
                        </div>
                        <div class="chat-header-actions">
                            <button id="chat-clear" class="chat-action-btn" title="Xóa lịch sử">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            </button>
                            <button id="chat-minimize" class="chat-action-btn" title="Thu nhỏ">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M19 13H5v-2h14v2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Khu vực tin nhắn -->
                    <div id="chat-messages" class="chat-messages">
                        <!-- Tin nhắn sẽ được thêm vào đây -->
                    </div>

                    <!-- Quick replies -->
                    <div id="quick-replies" class="quick-replies">
                        <button class="quick-reply-btn" data-message="Cho tôi xem các dự án">📁 Xem dự án</button>
                        <button class="quick-reply-btn" data-message="Kỹ năng lập trình của bạn là gì?">🛠️ Kỹ năng</button>
                        <button class="quick-reply-btn" data-message="Hỏi về JavaScript">📜 JavaScript</button>
                        <button class="quick-reply-btn" data-message="Hỏi về Java Spring Boot">☕ Java</button>
                        <button class="quick-reply-btn" data-message="Hỏi về React và Vue">⚛️ React/Vue</button>
                        <button class="quick-reply-btn" data-message="Hỏi về Database SQL">🗄️ Database</button>
                        <button class="quick-reply-btn" data-message="Tips cho developer">💡 Dev Tips</button>
                        <button class="quick-reply-btn" data-message="Tôi muốn liên hệ hợp tác">🤝 Hợp tác</button>
                    </div>

                    <!-- Input area -->
                    <div class="chat-input-area">
                        <div class="chat-input-container">
                            <input type="text" id="chat-input" class="chat-input" placeholder="Nhập tin nhắn của bạn..." autocomplete="off">
                            <button id="chat-send" class="chat-send-btn" title="Gửi">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="chat-powered">
                            Powered by <strong>FUGA26</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    // Bind các sự kiện
    bindEvents() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatWindow = document.getElementById('chat-window');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatClear = document.getElementById('chat-clear');
        const chatMinimize = document.getElementById('chat-minimize');
        const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');

        // Toggle chat window
        chatToggle.addEventListener('click', () => this.toggleChat());
        chatMinimize.addEventListener('click', () => this.toggleChat());

        // Gửi tin nhắn
        chatSend.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Xóa lịch sử
        chatClear.addEventListener('click', () => this.clearHistory());

        // Quick replies
        quickReplyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                chatInput.value = message;
                this.sendMessage();
            });
        });
    }

    // Toggle cửa sổ chat
    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatToggle = document.getElementById('chat-toggle');
        const chatIcon = chatToggle.querySelector('.chat-icon');
        const closeIcon = chatToggle.querySelector('.close-icon');
        const badge = chatToggle.querySelector('.chat-badge');

        const isOpen = chatWindow.classList.toggle('open');
        
        if (isOpen) {
            chatIcon.style.display = 'none';
            closeIcon.style.display = 'block';
            badge.style.display = 'none';
            
            // Hiển thị tin nhắn chào mừng nếu chưa có tin nhắn nào
            if (this.chatHistory.length === 0) {
                this.addBotMessage(this.config.welcomeMessage);
            }
            
            // Focus vào input
            setTimeout(() => {
                document.getElementById('chat-input').focus();
            }, 300);
        } else {
            chatIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    }

    // Gửi tin nhắn
    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Thêm tin nhắn của user
        this.addUserMessage(message);
        input.value = '';

        // Hiển thị typing indicator
        this.showTypingIndicator();

        // Xử lý và trả lời
        const response = await this.processMessage(message);
        
        // Ẩn typing indicator và hiển thị phản hồi
        this.hideTypingIndicator();
        this.addBotMessage(response);

        // Lưu lịch sử
        await this.saveChatHistory();
    }

    // Xử lý tin nhắn và tạo phản hồi
    async processMessage(message) {
        const lowerMessage = message.toLowerCase();
        // Chuẩn hóa text (loại bỏ dấu và viết tắt)
        const normalizedMessage = this.normalizeText(lowerMessage);

        // === PHẦN 1: XỬ LÝ GIAO TIẾP CƠ BẢN ===
        
        // Kiểm tra lời chào
        if (this.containsKeywords(lowerMessage, ['xin chào', 'hello', 'hi', 'chào', 'hey', 'alo', 'chao ban', 'chào bạn'])) {
            return this.getGreetingResponse();
        }

        // Hỏi tên bot
        if (this.isAskingBotName(lowerMessage, normalizedMessage)) {
            return this.getBotNameResponse();
        }

        // Hỏi bot là gì / ai tạo ra
        if (this.isAskingWhatIsBot(lowerMessage, normalizedMessage)) {
            return this.getWhatIsBotResponse();
        }

        // Nói tạm biệt
        if (this.containsKeywords(lowerMessage, ['tạm biệt', 'bye', 'goodbye', 'bai bai', 'bye bye', 'gặp lại', 'gap lai'])) {
            return this.getGoodbyeResponse();
        }

        // Kiểm tra cảm ơn
        if (this.containsKeywords(lowerMessage, ['cảm ơn', 'thanks', 'thank you', 'cám ơn', 'cam on', 'thank', 'tks'])) {
            return this.getThankYouResponse();
        }

        // === PHẦN 2: CÂU HỎI VỀ LẬP TRÌNH ===

        // JavaScript
        if (this.isAskingJavaScript(lowerMessage, normalizedMessage)) {
            return this.getJavaScriptResponse(lowerMessage);
        }

        // Java / Spring Boot
        if (this.isAskingJava(lowerMessage, normalizedMessage)) {
            return this.getJavaResponse(lowerMessage);
        }

        // Python
        if (this.isAskingPython(lowerMessage, normalizedMessage)) {
            return this.getPythonResponse(lowerMessage);
        }

        // React / Vue / Angular
        if (this.isAskingFrontendFramework(lowerMessage, normalizedMessage)) {
            return this.getFrontendFrameworkResponse(lowerMessage);
        }

        // Node.js / Express
        if (this.isAskingNodeJS(lowerMessage, normalizedMessage)) {
            return this.getNodeJSResponse(lowerMessage);
        }

        // Database (SQL, MySQL, MongoDB, SQL Server)
        if (this.isAskingDatabase(lowerMessage, normalizedMessage)) {
            return this.getDatabaseResponse(lowerMessage);
        }

        // Git / GitHub
        if (this.isAskingGit(lowerMessage, normalizedMessage)) {
            return this.getGitResponse(lowerMessage);
        }

        // API / REST / GraphQL
        if (this.isAskingAPI(lowerMessage, normalizedMessage)) {
            return this.getAPIResponse(lowerMessage);
        }

        // HTML / CSS
        if (this.isAskingHTMLCSS(lowerMessage, normalizedMessage)) {
            return this.getHTMLCSSResponse(lowerMessage);
        }

        // OOP / Design Patterns
        if (this.isAskingOOP(lowerMessage, normalizedMessage)) {
            return this.getOOPResponse(lowerMessage);
        }

        // Debug / Error / Bug
        if (this.isAskingDebug(lowerMessage, normalizedMessage)) {
            return this.getDebugResponse(lowerMessage);
        }

        // Tips cho Developer
        if (this.isAskingDevTips(lowerMessage, normalizedMessage)) {
            return this.getDevTipsResponse();
        }

        // Phỏng vấn / Interview
        if (this.isAskingInterview(lowerMessage, normalizedMessage)) {
            return this.getInterviewResponse(lowerMessage);
        }

        // Học lập trình / Lộ trình
        if (this.isAskingLearning(lowerMessage, normalizedMessage)) {
            return this.getLearningResponse(lowerMessage);
        }

        // Tools / IDE / VS Code
        if (this.isAskingTools(lowerMessage, normalizedMessage)) {
            return this.getToolsResponse(lowerMessage);
        }

        // Deploy / Hosting
        if (this.isAskingDeploy(lowerMessage, normalizedMessage)) {
            return this.getDeployResponse(lowerMessage);
        }

        // Security / Bảo mật
        if (this.isAskingSecurity(lowerMessage, normalizedMessage)) {
            return this.getSecurityResponse(lowerMessage);
        }

        // Performance / Tối ưu
        if (this.isAskingPerformance(lowerMessage, normalizedMessage)) {
            return this.getPerformanceResponse(lowerMessage);
        }

        // Testing
        if (this.isAskingTesting(lowerMessage, normalizedMessage)) {
            return this.getTestingResponse(lowerMessage);
        }

        // === PHẦN 3: CÂU HỎI VỀ PORTFOLIO ===

        // Kiểm tra các từ khóa về dự án
        if (this.containsKeywords(lowerMessage, ['dự án', 'project', 'portfolio', 'xem dự án', 'các dự án', 'công việc', 'sản phẩm', 'work'])) {
            return this.getProjectsResponse();
        }

        // Kiểm tra về hợp tác
        if (this.containsKeywords(lowerMessage, ['hợp tác', 'collaborate', 'làm việc cùng', 'tuyển', 'thuê', 'hire', 'hop tac', 'partnership', 'partner'])) {
            return this.getCollaborateResponse();
        }

        // Kiểm tra về liên hệ
        if (this.containsKeywords(lowerMessage, ['liên hệ', 'contact', 'email', 'phone', 'gọi', 'nhắn tin', 'lien he', 'sdt', 'số điện thoại'])) {
            return this.getContactResponse();
        }

        // Kiểm tra về kỹ năng
        if (this.containsKeywords(lowerMessage, ['kỹ năng', 'skill', 'biết gì', 'làm được gì', 'công nghệ', 'technology', 'tech', 'ky nang', 'ngôn ngữ lập trình', 'framework'])) {
            return this.getSkillsResponse();
        }

        // Kiểm tra về thông tin cá nhân (Minh Phong)
        if (this.containsKeywords(lowerMessage, ['bạn là ai', 'giới thiệu', 'about', 'minh phong', 'về tôi', 'về bạn', 'chủ', 'chu nhan', 'chủ nhân', 'owner', 'tác giả', 'dev'])) {
            return this.getAboutResponse();
        }

        // Hỏi bot có thể làm gì / giúp gì
        if (this.isAskingCapabilities(lowerMessage, normalizedMessage)) {
            return this.getCapabilitiesResponse();
        }

        // === PHẦN 4: XỬ LÝ CÂU HỎI PHỨC TẠP ===

        // Sử dụng AI API nếu có cấu hình
        if (this.config.aiProvider !== 'local' && this.config.aiApiKey) {
            return await this.getAIResponse(message);
        }

        // Thử tìm câu trả lời thông minh dựa trên ngữ cảnh
        const smartResponse = this.getSmartResponse(lowerMessage, normalizedMessage);
        if (smartResponse) {
            return smartResponse;
        }

        // Phản hồi mặc định
        return this.getDefaultResponse();
    }

    // Chuẩn hóa text - loại bỏ dấu và xử lý viết tắt
    normalizeText(text) {
        // Loại bỏ dấu tiếng Việt
        const normalized = text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
        
        // Xử lý các viết tắt phổ biến
        return normalized
            .replace(/\bj\b/gi, 'gi')
            .replace(/\bk\b/gi, 'không')
            .replace(/\bko\b/gi, 'không')
            .replace(/\bdc\b/gi, 'được')
            .replace(/\bđc\b/gi, 'được')
            .replace(/\blm\b/gi, 'làm')
            .replace(/\bbt\b/gi, 'bình thường')
            .replace(/\bbn\b/gi, 'bao nhiêu')
            .replace(/\bng\b/gi, 'người')
            .replace(/\bmk\b/gi, 'mình')
            .replace(/\bck\b/gi, 'chồng')
            .replace(/\bvk\b/gi, 'vợ')
            .replace(/\btr\b/gi, 'trăm')
            .replace(/\bntn\b/gi, 'như thế nào')
            .replace(/\bnhiu\b/gi, 'nhiều')
            .replace(/\bz\b/gi, 'vậy')
            .replace(/\bđag\b/gi, 'đang')
            .replace(/\bdang\b/gi, 'đang')
            .replace(/\bghe\b/gi, 'ghê');
    }

    // Kiểm tra hỏi tên bot
    isAskingBotName(msg, normalized) {
        const patterns = [
            /tên.*(?:j|gì|gi|la gi|là gì|là j)/i,
            /(?:ban|bạn).*tên/i,
            /(?:ten|tên).*(?:ban|bạn)/i,
            /(?:what|whats).*(?:name|your name)/i,
            /(?:goi|gọi).*(?:ban|bạn).*(?:la|là)/i,
            /(?:ban|bạn).*(?:la ai|là ai)/i,
            /(?:may|mày).*tên/i,
            /bot.*tên/i,
            /ai.*(?:day|đây|vay|vậy)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi khỏe không
    isAskingHowAreYou(msg, normalized) {
        const patterns = [
            /(?:khoe|khỏe|khoẻ).*(?:k|không|khong)/i,
            /(?:ban|bạn).*(?:khoe|khỏe)/i,
            /how.*(?:are|r).*(?:you|u)/i,
            /(?:the nao|thế nào|ntn)/i,
            /(?:sao|sao rồi|rồi)/i,
            /(?:ban|bạn).*(?:on|ổn)/i,
            /(?:ok|oke|okie).*(?:k|không|khong)/i,
            /có.*(?:khoe|khỏe)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi đang làm gì
    isAskingWhatDoing(msg, normalized) {
        const patterns = [
            /(?:dang|đang).*(?:lam|làm).*(?:j|gì|gi)/i,
            /(?:lam|làm).*(?:j|gì|gi).*(?:day|đây|the|thế)/i,
            /what.*(?:doing|do)/i,
            /(?:ban|bạn).*(?:dang|đang)/i,
            /(?:ban|bạn).*(?:làm|lam).*(?:j|gì)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi tuổi
    isAskingAge(msg, normalized) {
        const patterns = [
            /(?:bao|bn).*(?:tuoi|tuổi)/i,
            /(?:tuoi|tuổi).*(?:bao|bn)/i,
            /(?:may|mấy).*(?:tuoi|tuổi)/i,
            /how.*old/i,
            /(?:ban|bạn).*(?:tuoi|tuổi)/i,
            /(?:sinh|năm).*(?:nao|nào)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi ở đâu
    isAskingLocation(msg, normalized) {
        const patterns = [
            /(?:o|ở).*(?:dau|đâu)/i,
            /(?:ban|bạn).*(?:o|ở)/i,
            /where.*(?:are|r).*(?:you|u)/i,
            /(?:song|sống).*(?:o|ở)/i,
            /(?:dia chi|địa chỉ)/i,
            /(?:den tu|đến từ)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi bot là gì
    isAskingWhatIsBot(msg, normalized) {
        const patterns = [
            /(?:ban|bạn).*(?:la|là).*(?:j|gì|gi|cai gi|cái gì)/i,
            /(?:ai|who).*(?:tao|tạo|lam|làm).*(?:ra|nen|nên)/i,
            /(?:bot|chatbot).*(?:la|là)/i,
            /(?:tro ly|trợ lý).*(?:la|là)/i,
            /(?:may|máy|nguoi|người)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi thời gian
    isAskingTime(msg, normalized) {
        const patterns = [
            /(?:may|mấy).*(?:gio|giờ)/i,
            /(?:gio|giờ).*(?:may|mấy)/i,
            /what.*time/i,
            /(?:bay gio|bây giờ)/i,
            /(?:hom nay|hôm nay)/i,
            /(?:ngay|ngày).*(?:may|mấy)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi thời tiết
    isAskingWeather(msg, normalized) {
        const patterns = [
            /(?:thoi tiet|thời tiết)/i,
            /(?:troi|trời).*(?:the nao|thế nào|ntn|sao)/i,
            /weather/i,
            /(?:mua|mưa)/i,
            /(?:nang|nắng)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi khả năng bot
    isAskingCapabilities(msg, normalized) {
        const patterns = [
            /(?:ban|bạn).*(?:co the|có thể).*(?:lam|làm)/i,
            /(?:ban|bạn).*(?:giup|giúp)/i,
            /(?:lam|làm).*(?:dc|được).*(?:j|gì|gi)/i,
            /what.*can.*(?:you|u)/i,
            /(?:ban|bạn).*biet.*(?:j|gì|gi)/i,
            /help.*(?:me|what)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // === CÁC HÀM KIỂM TRA VỀ LẬP TRÌNH ===

    // JavaScript
    isAskingJavaScript(msg, normalized) {
        const patterns = [
            /javascript|js\b/i,
            /es6|es2015|ecmascript/i,
            /(?:hoi|hỏi).*(?:ve|về).*js/i,
            /typescript|ts\b/i,
            /promise|async|await/i,
            /closure|hoisting|scope/i,
            /arrow.*function/i,
            /callback|event.*loop/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Java / Spring Boot
    isAskingJava(msg, normalized) {
        const patterns = [
            /\bjava\b(?!script)/i,
            /spring.*boot|spring.*framework/i,
            /jvm|jdk|jre/i,
            /maven|gradle/i,
            /hibernate|jpa/i,
            /servlet|jsp/i,
            /java.*(?:la|là|gi|gì|nao|nào)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Python
    isAskingPython(msg, normalized) {
        const patterns = [
            /python/i,
            /django|flask|fastapi/i,
            /pip|virtualenv|conda/i,
            /pandas|numpy|matplotlib/i,
            /machine.*learning|ml\b|ai\b/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Frontend Frameworks (React, Vue, Angular)
    isAskingFrontendFramework(msg, normalized) {
        const patterns = [
            /react|reactjs|react\.js/i,
            /vue|vuejs|vue\.js|vuex|pinia/i,
            /angular|angularjs/i,
            /next\.?js|nuxt\.?js/i,
            /component|props|state|hook/i,
            /redux|context.*api/i,
            /virtual.*dom|vdom/i,
            /svelte|solid/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Node.js
    isAskingNodeJS(msg, normalized) {
        const patterns = [
            /node\.?js|nodejs/i,
            /express\.?js|express/i,
            /npm|yarn|pnpm/i,
            /package\.json/i,
            /middleware/i,
            /nestjs|nest\.js/i,
            /backend.*js|js.*backend/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Database
    isAskingDatabase(msg, normalized) {
        const patterns = [
            /database|csdl|cơ sở dữ liệu/i,
            /sql\b|mysql|postgresql|postgres/i,
            /mongodb|mongo\b|nosql/i,
            /sql.*server|mssql/i,
            /query|truy.*vấn/i,
            /join|select|insert|update|delete/i,
            /index|indexing/i,
            /orm|sequelize|prisma/i,
            /redis|firebase/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Git / GitHub
    isAskingGit(msg, normalized) {
        const patterns = [
            /\bgit\b|github|gitlab|bitbucket/i,
            /commit|push|pull|merge/i,
            /branch|nhánh/i,
            /clone|fork/i,
            /conflict|xung.*đột/i,
            /version.*control|quản.*lý.*phiên.*bản/i,
            /pull.*request|pr\b|merge.*request/i,
            /rebase|cherry.*pick|stash/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // API / REST
    isAskingAPI(msg, normalized) {
        const patterns = [
            /\bapi\b/i,
            /rest|restful/i,
            /graphql|gql/i,
            /endpoint/i,
            /http|https|request|response/i,
            /get|post|put|patch|delete.*method/i,
            /json|xml/i,
            /fetch|axios|ajax/i,
            /websocket|socket/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // HTML / CSS
    isAskingHTMLCSS(msg, normalized) {
        const patterns = [
            /html|html5/i,
            /css|css3|stylesheet/i,
            /flexbox|flex/i,
            /grid.*layout|css.*grid/i,
            /responsive|media.*query/i,
            /sass|scss|less/i,
            /tailwind|bootstrap/i,
            /animation|transition/i,
            /selector|pseudo/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // OOP / Design Patterns
    isAskingOOP(msg, normalized) {
        const patterns = [
            /oop|hướng.*đối.*tượng|object.*oriented/i,
            /class|lớp|đối.*tượng|object/i,
            /kế.*thừa|inheritance/i,
            /đa.*hình|polymorphism/i,
            /đóng.*gói|encapsulation/i,
            /trừu.*tượng|abstraction/i,
            /design.*pattern|mẫu.*thiết.*kế/i,
            /solid|singleton|factory|observer/i,
            /mvc|mvvm|mvp/i,
            /interface|abstract/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Debug / Error
    isAskingDebug(msg, normalized) {
        const patterns = [
            /debug|gỡ.*lỗi/i,
            /error|lỗi|bug/i,
            /fix|sửa.*lỗi/i,
            /exception|throw|catch|try/i,
            /console.*log|breakpoint/i,
            /stack.*trace|traceback/i,
            /undefined|null|nan/i,
            /crash|crashed/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Dev Tips
    isAskingDevTips(msg, normalized) {
        const patterns = [
            /tips?|mẹo|trick/i,
            /best.*practice|thực.*hành.*tốt/i,
            /kinh.*nghiệm|experience/i,
            /làm.*sao.*để.*giỏi|how.*to.*be.*good/i,
            /lời.*khuyên.*(?:dev|lập.*trình)/i,
            /clean.*code|code.*sạch/i,
            /productive|năng.*suất/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Interview
    isAskingInterview(msg, normalized) {
        const patterns = [
            /interview|phỏng.*vấn/i,
            /câu.*hỏi.*(?:pv|phỏng.*vấn)/i,
            /tuyển.*dụng|recruitment/i,
            /cv|resume|portfolio/i,
            /junior|senior|fresher/i,
            /salary|lương|đãi.*ngộ/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Learning / Roadmap
    isAskingLearning(msg, normalized) {
        const patterns = [
            /học.*lập.*trình|learn.*(?:code|programming)/i,
            /lộ.*trình|roadmap/i,
            /bắt.*đầu.*(?:từ.*đâu|như.*thế.*nào)/i,
            /tutorial|hướng.*dẫn/i,
            /course|khóa.*học/i,
            /tài.*liệu|resource|documentation/i,
            /beginner|người.*mới|newbie/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Tools / IDE
    isAskingTools(msg, normalized) {
        const patterns = [
            /tool|công.*cụ/i,
            /ide|editor|vs.*code|vscode/i,
            /extension|plugin/i,
            /terminal|command.*line|cli/i,
            /docker|container/i,
            /postman|insomnia/i,
            /figma|photoshop|design/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Deploy / Hosting
    isAskingDeploy(msg, normalized) {
        const patterns = [
            /deploy|triển.*khai/i,
            /hosting|host/i,
            /server|máy.*chủ/i,
            /vps|cloud/i,
            /vercel|netlify|heroku/i,
            /aws|azure|google.*cloud|gcp/i,
            /domain|tên.*miền/i,
            /ssl|https|certificate/i,
            /ci.*cd|pipeline/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Security
    isAskingSecurity(msg, normalized) {
        const patterns = [
            /security|bảo.*mật/i,
            /authentication|xác.*thực/i,
            /authorization|phân.*quyền/i,
            /jwt|token|session/i,
            /oauth|sso/i,
            /sql.*injection|xss|csrf/i,
            /encrypt|mã.*hóa|hash/i,
            /password|mật.*khẩu/i,
            /https|ssl|tls/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Performance
    isAskingPerformance(msg, normalized) {
        const patterns = [
            /performance|hiệu.*suất/i,
            /tối.*ưu|optimize|optimization/i,
            /speed|tốc.*độ/i,
            /lazy.*load|code.*splitting/i,
            /cache|caching/i,
            /minify|compress/i,
            /memory|bộ.*nhớ/i,
            /profiling|benchmark/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Testing
    isAskingTesting(msg, normalized) {
        const patterns = [
            /test|testing|kiểm.*thử/i,
            /unit.*test|integration.*test/i,
            /jest|mocha|jasmine/i,
            /cypress|selenium|playwright/i,
            /tdd|bdd/i,
            /coverage|độ.*phủ/i,
            /mock|stub|spy/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // === CÁC HÀM TRẢ LỜI VỀ LẬP TRÌNH ===

    getJavaScriptResponse(msg) {
        if (/promise|async|await/i.test(msg)) {
            return `⚡ <strong>Async/Await & Promise trong JavaScript:</strong><br><br>
                <strong>Promise</strong> là cách xử lý bất đồng bộ:<br>
                <code>const promise = new Promise((resolve, reject) => {<br>
                &nbsp;&nbsp;// async operation<br>
                &nbsp;&nbsp;resolve(data) hoặc reject(error)<br>
                });</code><br><br>
                <strong>Async/Await</strong> giúp code dễ đọc hơn:<br>
                <code>async function getData() {<br>
                &nbsp;&nbsp;try {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;const data = await fetch(url);<br>
                &nbsp;&nbsp;&nbsp;&nbsp;return data.json();<br>
                &nbsp;&nbsp;} catch(err) { console.error(err); }<br>
                }</code><br><br>
                💡 Tips: Luôn dùng try/catch với async/await!`;
        }
        
        if (/closure/i.test(msg)) {
            return `🔒 <strong>Closure trong JavaScript:</strong><br><br>
                Closure là khi một function "nhớ" được các biến từ scope bên ngoài:<br><br>
                <code>function outer() {<br>
                &nbsp;&nbsp;let count = 0;<br>
                &nbsp;&nbsp;return function inner() {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;count++;<br>
                &nbsp;&nbsp;&nbsp;&nbsp;return count;<br>
                &nbsp;&nbsp;}<br>
                }<br>
                const counter = outer();<br>
                counter(); // 1<br>
                counter(); // 2</code><br><br>
                💡 Ứng dụng: Private variables, Data encapsulation, Currying`;
        }
        
        if (/hoisting/i.test(msg)) {
            return `📤 <strong>Hoisting trong JavaScript:</strong><br><br>
                Hoisting là cơ chế JS "đẩy" khai báo lên đầu scope.<br><br>
                <strong>var:</strong> Được hoist, giá trị undefined<br>
                <strong>let/const:</strong> Được hoist nhưng không truy cập được (TDZ)<br>
                <strong>function:</strong> Được hoist hoàn toàn<br><br>
                <code>console.log(x); // undefined<br>
                var x = 5;<br><br>
                console.log(y); // ReferenceError<br>
                let y = 5;</code><br><br>
                💡 Best practice: Luôn khai báo biến ở đầu scope!`;
        }
        
        if (/typescript|ts\b/i.test(msg)) {
            return `📘 <strong>TypeScript:</strong><br><br>
                TypeScript = JavaScript + Static Types<br><br>
                <strong>Ưu điểm:</strong><br>
                ✅ Phát hiện lỗi sớm (compile time)<br>
                ✅ IntelliSense tốt hơn<br>
                ✅ Code dễ maintain<br>
                ✅ Refactoring an toàn<br><br>
                <strong>Cơ bản:</strong><br>
                <code>let name: string = "Phong";<br>
                let age: number = 20;<br>
                interface User { id: number; name: string; }<br>
                function greet(user: User): string { ... }</code><br><br>
                💡 Minh Phong đang sử dụng TypeScript trong các dự án!`;
        }

        return `📜 <strong>JavaScript - Ngôn ngữ của Web:</strong><br><br>
            JavaScript là ngôn ngữ lập trình phổ biến nhất hiện nay!<br><br>
            <strong>Các khái niệm quan trọng:</strong><br>
            • 📦 Variables: var, let, const<br>
            • 🔄 Functions: Arrow functions, Callbacks<br>
            • ⚡ Async: Promise, async/await<br>
            • 🔒 Scope: Closure, Hoisting<br>
            • 🎯 ES6+: Destructuring, Spread, Modules<br>
            • 🏗️ OOP: Classes, Prototypes<br><br>
            <strong>Minh Phong sử dụng JS cho:</strong><br>
            • Frontend: Vue.js, React<br>
            • Backend: Node.js, Express<br><br>
            Bạn muốn hỏi chi tiết về phần nào? 🤔`;
    }

    getJavaResponse(msg) {
        if (/spring.*boot|spring.*framework/i.test(msg)) {
            return `🍃 <strong>Spring Boot:</strong><br><br>
                Spring Boot giúp tạo ứng dụng Java nhanh chóng!<br><br>
                <strong>Tính năng chính:</strong><br>
                • Auto-configuration<br>
                • Embedded server (Tomcat)<br>
                • Production-ready features<br>
                • Microservices support<br><br>
                <strong>Annotations quan trọng:</strong><br>
                • @SpringBootApplication<br>
                • @RestController, @RequestMapping<br>
                • @Autowired, @Component<br>
                • @Entity, @Repository<br><br>
                💡 Minh Phong sử dụng Spring Boot cho các dự án backend!`;
        }
        
        if (/hibernate|jpa/i.test(msg)) {
            return `🗃️ <strong>JPA & Hibernate:</strong><br><br>
                <strong>JPA</strong> (Java Persistence API) - Tiêu chuẩn ORM<br>
                <strong>Hibernate</strong> - Implementation phổ biến nhất<br><br>
                <strong>Annotations:</strong><br>
                • @Entity - Đánh dấu class là entity<br>
                • @Table - Map với bảng DB<br>
                • @Id, @GeneratedValue - Primary key<br>
                • @Column - Map với cột<br>
                • @OneToMany, @ManyToOne - Quan hệ<br><br>
                <strong>Repository pattern:</strong><br>
                <code>public interface UserRepo extends JpaRepository&lt;User, Long&gt; {<br>
                &nbsp;&nbsp;List&lt;User&gt; findByName(String name);<br>
                }</code>`;
        }

        return `☕ <strong>Java - Ngôn ngữ mạnh mẽ:</strong><br><br>
            Java là ngôn ngữ OOP phổ biến cho Enterprise!<br><br>
            <strong>Đặc điểm:</strong><br>
            • 🔷 OOP thuần túy<br>
            • 🔄 "Write Once, Run Anywhere"<br>
            • 🛡️ Strong typing, bảo mật cao<br>
            • 📚 Ecosystem phong phú<br><br>
            <strong>Minh Phong biết:</strong><br>
            • Java Core, Collections<br>
            • Spring Boot, Spring MVC<br>
            • JPA/Hibernate<br>
            • Maven/Gradle<br><br>
            Bạn muốn hỏi về Spring Boot hay Java Core? 🤔`;
    }

    getPythonResponse(msg) {
        if (/django|flask|fastapi/i.test(msg)) {
            return `🐍 <strong>Python Web Frameworks:</strong><br><br>
                <strong>Django:</strong> Full-stack, "batteries included"<br>
                • ORM, Admin panel, Auth built-in<br>
                • Tốt cho app lớn<br><br>
                <strong>Flask:</strong> Micro-framework, linh hoạt<br>
                • Nhẹ, dễ học<br>
                • Tốt cho API nhỏ, prototype<br><br>
                <strong>FastAPI:</strong> Modern, async, nhanh<br>
                • Auto API docs (Swagger)<br>
                • Type hints support<br>
                • Tốt cho microservices<br><br>
                💡 Chọn Django cho web app, FastAPI cho API!`;
        }

        return `🐍 <strong>Python:</strong><br><br>
            Python - Ngôn ngữ đa năng, dễ học!<br><br>
            <strong>Ứng dụng:</strong><br>
            • 🌐 Web: Django, Flask, FastAPI<br>
            • 🤖 AI/ML: TensorFlow, PyTorch<br>
            • 📊 Data Science: Pandas, NumPy<br>
            • 🔧 Automation, Scripting<br><br>
            <strong>Đặc điểm:</strong><br>
            • Syntax đơn giản, dễ đọc<br>
            • Thư viện phong phú<br>
            • Community lớn<br><br>
            Bạn muốn dùng Python cho mục đích gì? 🤔`;
    }

    getFrontendFrameworkResponse(msg) {
        if (/react/i.test(msg)) {
            return `⚛️ <strong>React.js:</strong><br><br>
                React là thư viện UI của Facebook!<br><br>
                <strong>Khái niệm chính:</strong><br>
                • 🧩 Components (Function/Class)<br>
                • 📦 Props & State<br>
                • 🪝 Hooks (useState, useEffect...)<br>
                • 🔄 Virtual DOM<br>
                • 🎯 JSX syntax<br><br>
                <strong>Ecosystem:</strong><br>
                • Redux/Context - State management<br>
                • React Router - Routing<br>
                • Next.js - SSR/SSG<br><br>
                💡 React phổ biến nhất hiện nay với job nhiều!`;
        }
        
        if (/vue/i.test(msg)) {
            return `💚 <strong>Vue.js:</strong><br><br>
                Vue - Framework tiến bộ, dễ học!<br><br>
                <strong>Đặc điểm:</strong><br>
                • 📝 Template syntax trực quan<br>
                • 🔄 Two-way data binding<br>
                • 🧩 Component-based<br>
                • 📦 Composition API (Vue 3)<br><br>
                <strong>Ecosystem:</strong><br>
                • Vuex/Pinia - State management<br>
                • Vue Router - Routing<br>
                • Nuxt.js - SSR framework<br><br>
                💡 Minh Phong sử dụng Vue.js cho các dự án frontend!`;
        }
        
        if (/angular/i.test(msg)) {
            return `🅰️ <strong>Angular:</strong><br><br>
                Angular - Framework của Google!<br><br>
                <strong>Đặc điểm:</strong><br>
                • 🏗️ Full framework (all-in-one)<br>
                • 📘 TypeScript built-in<br>
                • 💉 Dependency Injection<br>
                • 📝 Two-way binding<br>
                • 🔧 CLI mạnh mẽ<br><br>
                <strong>Phù hợp cho:</strong><br>
                • Enterprise apps<br>
                • Team lớn<br>
                • Dự án dài hạn<br><br>
                💡 Angular learning curve cao nhưng structure rõ ràng!`;
        }

        return `🎨 <strong>Frontend Frameworks:</strong><br><br>
            Ba framework phổ biến nhất:<br><br>
            <strong>⚛️ React:</strong> Linh hoạt, job nhiều nhất<br>
            <strong>💚 Vue:</strong> Dễ học, cân bằng<br>
            <strong>🅰️ Angular:</strong> Full-featured, enterprise<br><br>
            <strong>So sánh:</strong><br>
            • Learning curve: Vue < React < Angular<br>
            • Flexibility: React > Vue > Angular<br>
            • Built-in features: Angular > Vue > React<br><br>
            💡 Minh Phong recommend Vue cho beginner, React cho job market!`;
    }

    getNodeJSResponse(msg) {
        if (/express/i.test(msg)) {
            return `🚂 <strong>Express.js:</strong><br><br>
                Express - Framework web phổ biến nhất cho Node.js!<br><br>
                <strong>Cơ bản:</strong><br>
                <code>const express = require('express');<br>
                const app = express();<br><br>
                app.get('/api/users', (req, res) => {<br>
                &nbsp;&nbsp;res.json({ users: [] });<br>
                });<br><br>
                app.listen(3000);</code><br><br>
                <strong>Concepts:</strong><br>
                • Routing, Middleware<br>
                • Request/Response handling<br>
                • Error handling<br>
                • Template engines<br><br>
                💡 Express đơn giản, linh hoạt, phù hợp mọi dự án!`;
        }

        return `🟢 <strong>Node.js:</strong><br><br>
            Node.js - JavaScript runtime cho server!<br><br>
            <strong>Đặc điểm:</strong><br>
            • ⚡ Event-driven, non-blocking I/O<br>
            • 📦 NPM - Package manager lớn nhất<br>
            • 🔄 Single-threaded (Event loop)<br>
            • 🚀 Tốt cho real-time apps<br><br>
            <strong>Frameworks:</strong><br>
            • Express.js - Minimalist<br>
            • NestJS - Enterprise, TypeScript<br>
            • Fastify - Performance<br><br>
            💡 Minh Phong dùng Node.js + Express cho backend!`;
    }

    getDatabaseResponse(msg) {
        if (/mongodb|mongo|nosql/i.test(msg)) {
            return `🍃 <strong>MongoDB:</strong><br><br>
                MongoDB - NoSQL Database phổ biến!<br><br>
                <strong>Đặc điểm:</strong><br>
                • 📄 Document-based (JSON/BSON)<br>
                • 🔄 Schema flexible<br>
                • 📈 Horizontal scaling<br>
                • 🚀 High performance<br><br>
                <strong>Khi nào dùng:</strong><br>
                • Data không có schema cố định<br>
                • Big data, real-time analytics<br>
                • Rapid prototyping<br><br>
                <strong>Ví dụ:</strong><br>
                <code>db.users.insertOne({ name: "Phong", age: 20 });<br>
                db.users.find({ age: { $gt: 18 } });</code>`;
        }
        
        if (/mysql|postgresql|postgres|sql\b/i.test(msg)) {
            return `🐬 <strong>SQL Databases:</strong><br><br>
                <strong>MySQL:</strong> Phổ biến, dễ dùng, miễn phí<br>
                <strong>PostgreSQL:</strong> Mạnh mẽ, nhiều tính năng<br>
                <strong>SQL Server:</strong> Microsoft, enterprise<br><br>
                <strong>SQL cơ bản:</strong><br>
                <code>SELECT * FROM users WHERE age > 18;<br>
                INSERT INTO users (name, age) VALUES ('Phong', 20);<br>
                UPDATE users SET age = 21 WHERE name = 'Phong';<br>
                DELETE FROM users WHERE id = 1;</code><br><br>
                <strong>Advanced:</strong> JOIN, INDEX, Transaction, Views<br><br>
                💡 SQL quan trọng - hầu hết dự án đều cần!`;
        }

        return `🗄️ <strong>Database:</strong><br><br>
            <strong>SQL (Relational):</strong><br>
            • MySQL, PostgreSQL, SQL Server<br>
            • Structured data, ACID<br>
            • Quan hệ bảng (JOIN)<br><br>
            <strong>NoSQL:</strong><br>
            • MongoDB (Document)<br>
            • Redis (Key-Value, Cache)<br>
            • Firebase (Real-time)<br><br>
            <strong>Chọn khi nào?</strong><br>
            • SQL: Data có quan hệ rõ ràng<br>
            • NoSQL: Data linh hoạt, scale lớn<br><br>
            Bạn cần hỏi về SQL hay NoSQL? 🤔`;
    }

    getGitResponse(msg) {
        if (/conflict|xung.*đột/i.test(msg)) {
            return `⚔️ <strong>Giải quyết Git Conflict:</strong><br><br>
                Conflict xảy ra khi 2 người sửa cùng 1 dòng code.<br><br>
                <strong>Cách giải quyết:</strong><br>
                1. <code>git pull origin main</code> - Lấy code mới<br>
                2. Mở file có conflict<br>
                3. Tìm và sửa các phần:<br>
                <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD<br>
                Code của bạn<br>
                =======<br>
                Code của người khác<br>
                &gt;&gt;&gt;&gt;&gt;&gt;&gt; branch-name</code><br>
                4. Chọn/merge code phù hợp<br>
                5. <code>git add .</code><br>
                6. <code>git commit -m "Resolve conflict"</code><br><br>
                💡 Tips: Thường xuyên pull để tránh conflict!`;
        }
        
        if (/branch|nhánh/i.test(msg)) {
            return `🌿 <strong>Git Branching:</strong><br><br>
                Branch giúp làm việc song song, không ảnh hưởng code chính.<br><br>
                <strong>Commands:</strong><br>
                <code>git branch feature-login</code> - Tạo branch<br>
                <code>git checkout feature-login</code> - Chuyển branch<br>
                <code>git checkout -b feature-login</code> - Tạo + chuyển<br>
                <code>git merge feature-login</code> - Merge vào branch hiện tại<br>
                <code>git branch -d feature-login</code> - Xóa branch<br><br>
                <strong>Git Flow:</strong><br>
                • main/master - Production code<br>
                • develop - Development<br>
                • feature/* - Tính năng mới<br>
                • hotfix/* - Fix bug urgent`;
        }

        return `📚 <strong>Git & GitHub:</strong><br><br>
            Git là version control system phổ biến nhất!<br><br>
            <strong>Commands cơ bản:</strong><br>
            <code>git init</code> - Khởi tạo repo<br>
            <code>git clone [url]</code> - Clone repo<br>
            <code>git add .</code> - Stage changes<br>
            <code>git commit -m "message"</code> - Commit<br>
            <code>git push</code> - Push lên remote<br>
            <code>git pull</code> - Pull về local<br><br>
            <strong>GitHub:</strong><br>
            • Host repository<br>
            • Pull Request, Code Review<br>
            • Issues, Projects<br>
            • GitHub Actions (CI/CD)<br><br>
            💡 Xem portfolio của Minh Phong: <a href="${this.websiteInfo.github}" target="_blank">GitHub</a>`;
    }

    getAPIResponse(msg) {
        if (/graphql/i.test(msg)) {
            return `🔮 <strong>GraphQL:</strong><br><br>
                GraphQL - Query language cho API của Facebook!<br><br>
                <strong>Ưu điểm so với REST:</strong><br>
                • ✅ Lấy đúng data cần (no over-fetching)<br>
                • ✅ Single endpoint<br>
                • ✅ Strong typing<br>
                • ✅ Self-documenting<br><br>
                <strong>Ví dụ query:</strong><br>
                <code>query {<br>
                &nbsp;&nbsp;user(id: 1) {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;name<br>
                &nbsp;&nbsp;&nbsp;&nbsp;posts { title }<br>
                &nbsp;&nbsp;}<br>
                }</code><br><br>
                💡 GraphQL tốt cho app cần flexibility cao!`;
        }

        return `🔗 <strong>REST API:</strong><br><br>
            REST - Kiến trúc API phổ biến nhất!<br><br>
            <strong>HTTP Methods:</strong><br>
            • GET - Lấy dữ liệu<br>
            • POST - Tạo mới<br>
            • PUT/PATCH - Cập nhật<br>
            • DELETE - Xóa<br><br>
            <strong>Status Codes:</strong><br>
            • 200 OK, 201 Created<br>
            • 400 Bad Request, 401 Unauthorized<br>
            • 404 Not Found, 500 Server Error<br><br>
            <strong>Best Practices:</strong><br>
            • Sử dụng noun cho endpoints<br>
            • Version API (/api/v1/)<br>
            • Trả về JSON<br><br>
            💡 Minh Phong thiết kế RESTful API cho các dự án!`;
    }

    getHTMLCSSResponse(msg) {
        if (/flexbox|flex/i.test(msg)) {
            return `📦 <strong>CSS Flexbox:</strong><br><br>
                Flexbox - Layout 1 chiều mạnh mẽ!<br><br>
                <strong>Container:</strong><br>
                <code>display: flex;<br>
                justify-content: center; /* ngang */<br>
                align-items: center; /* dọc */<br>
                flex-direction: row | column;<br>
                flex-wrap: wrap;</code><br><br>
                <strong>Items:</strong><br>
                <code>flex: 1; /* grow */<br>
                order: 1;<br>
                align-self: flex-end;</code><br><br>
                💡 Flexbox perfect cho navbar, cards, centering!`;
        }
        
        if (/grid/i.test(msg)) {
            return `🔲 <strong>CSS Grid:</strong><br><br>
                Grid - Layout 2 chiều mạnh mẽ!<br><br>
                <strong>Container:</strong><br>
                <code>display: grid;<br>
                grid-template-columns: 1fr 1fr 1fr;<br>
                grid-template-rows: auto;<br>
                gap: 20px;</code><br><br>
                <strong>Items:</strong><br>
                <code>grid-column: 1 / 3;<br>
                grid-row: span 2;</code><br><br>
                💡 Grid perfect cho page layouts, galleries!`;
        }
        
        if (/responsive|media.*query/i.test(msg)) {
            return `📱 <strong>Responsive Design:</strong><br><br>
                <strong>Mobile-first approach:</strong><br>
                <code>/* Mobile styles (default) */<br>
                .container { width: 100%; }<br><br>
                /* Tablet */<br>
                @media (min-width: 768px) {<br>
                &nbsp;&nbsp;.container { width: 750px; }<br>
                }<br><br>
                /* Desktop */<br>
                @media (min-width: 1024px) {<br>
                &nbsp;&nbsp;.container { width: 960px; }<br>
                }</code><br><br>
                <strong>Breakpoints phổ biến:</strong><br>
                • Mobile: < 768px<br>
                • Tablet: 768px - 1024px<br>
                • Desktop: > 1024px`;
        }

        return `🎨 <strong>HTML & CSS:</strong><br><br>
            Nền tảng của mọi website!<br><br>
            <strong>HTML5 Features:</strong><br>
            • Semantic tags (header, nav, article...)<br>
            • Form validation<br>
            • Audio/Video<br>
            • Canvas, SVG<br><br>
            <strong>CSS3 Features:</strong><br>
            • Flexbox & Grid layout<br>
            • Animations & Transitions<br>
            • Variables (--custom-property)<br>
            • Media Queries (Responsive)<br><br>
            <strong>Preprocessors:</strong> SASS/SCSS, Less<br>
            <strong>Frameworks:</strong> Tailwind CSS, Bootstrap<br><br>
            Bạn muốn hỏi về Flexbox, Grid hay Responsive? 🤔`;
    }

    getOOPResponse(msg) {
        if (/solid/i.test(msg)) {
            return `🏛️ <strong>SOLID Principles:</strong><br><br>
                5 nguyên tắc thiết kế OOP:<br><br>
                <strong>S</strong> - Single Responsibility<br>
                → Mỗi class chỉ 1 trách nhiệm<br><br>
                <strong>O</strong> - Open/Closed<br>
                → Mở để mở rộng, đóng để sửa đổi<br><br>
                <strong>L</strong> - Liskov Substitution<br>
                → Class con thay thế được class cha<br><br>
                <strong>I</strong> - Interface Segregation<br>
                → Interface nhỏ, cụ thể<br><br>
                <strong>D</strong> - Dependency Inversion<br>
                → Phụ thuộc abstraction, không implementation<br><br>
                💡 SOLID giúp code dễ maintain, test!`;
        }
        
        if (/design.*pattern|mẫu.*thiết.*kế/i.test(msg)) {
            return `🎨 <strong>Design Patterns:</strong><br><br>
                <strong>Creational:</strong><br>
                • Singleton - 1 instance duy nhất<br>
                • Factory - Tạo object qua factory<br>
                • Builder - Xây dựng object phức tạp<br><br>
                <strong>Structural:</strong><br>
                • Adapter - Kết nối interface khác nhau<br>
                • Decorator - Thêm behavior động<br>
                • Facade - Interface đơn giản hóa<br><br>
                <strong>Behavioral:</strong><br>
                • Observer - Notify khi state thay đổi<br>
                • Strategy - Đổi algorithm runtime<br>
                • Command - Đóng gói request<br><br>
                💡 Hiểu patterns giúp giải quyết vấn đề hiệu quả!`;
        }

        return `🏗️ <strong>OOP - Object-Oriented Programming:</strong><br><br>
            <strong>4 tính chất cơ bản:</strong><br><br>
            🔒 <strong>Encapsulation</strong> (Đóng gói)<br>
            → Ẩn data, expose methods<br><br>
            🧬 <strong>Inheritance</strong> (Kế thừa)<br>
            → Class con kế thừa class cha<br><br>
            🎭 <strong>Polymorphism</strong> (Đa hình)<br>
            → Cùng method, hành vi khác nhau<br><br>
            🎨 <strong>Abstraction</strong> (Trừu tượng)<br>
            → Ẩn chi tiết, hiển thị cần thiết<br><br>
            💡 OOP là nền tảng cho Java, C#, Python...`;
    }

    getDebugResponse(msg) {
        return `🔍 <strong>Debugging Tips:</strong><br><br>
            <strong>1. Đọc Error Message:</strong><br>
            • Đọc kỹ error type, message<br>
            • Check stack trace, file:line<br><br>
            <strong>2. Console/Print Debug:</strong><br>
            • <code>console.log()</code> - JavaScript<br>
            • <code>print()</code> - Python<br>
            • <code>System.out.println()</code> - Java<br><br>
            <strong>3. Debugger Tools:</strong><br>
            • Chrome DevTools<br>
            • VS Code Debugger<br>
            • Breakpoints, Step through<br><br>
            <strong>4. Rubber Duck Debugging:</strong><br>
            • Giải thích code cho "con vịt"<br>
            • Thường tự tìm ra lỗi!<br><br>
            <strong>5. Google & Stack Overflow:</strong><br>
            • Copy error message<br>
            • Tìm solutions<br><br>
            💡 Debug là kỹ năng quan trọng của developer!`;
    }

    getDevTipsResponse() {
        const tips = [
            `💡 <strong>Dev Tips #1 - Code Quality:</strong><br><br>
                • 📝 Viết code readable, self-documenting<br>
                • 🔄 DRY - Don't Repeat Yourself<br>
                • 🎯 KISS - Keep It Simple, Stupid<br>
                • 📦 Single Responsibility Principle<br>
                • ✅ Viết tests cho code quan trọng<br>
                • 📚 Comment khi cần, không spam<br><br>
                "Code is read more often than written!"`,
            `💡 <strong>Dev Tips #2 - Productivity:</strong><br><br>
                • ⌨️ Master keyboard shortcuts<br>
                • 🔧 Customize IDE/Editor<br>
                • 📋 Use snippets/templates<br>
                • 🔄 Automate repetitive tasks<br>
                • ⏰ Pomodoro technique (25-5)<br>
                • 🎯 Focus mode, tắt notifications<br><br>
                "Work smarter, not harder!"`,
            `💡 <strong>Dev Tips #3 - Learning:</strong><br><br>
                • 📚 Học từ documentation chính thức<br>
                • 💻 Practice > Theory<br>
                • 🏗️ Build real projects<br>
                • 👥 Join community (Discord, Reddit)<br>
                • 📝 Viết blog/notes để consolidate<br>
                • 🔄 Teach others = Learn better<br><br>
                "The best way to learn is by doing!"`,
            `💡 <strong>Dev Tips #4 - Career:</strong><br><br>
                • 📁 Build portfolio với real projects<br>
                • 🌐 Active trên GitHub<br>
                • 🔗 Network trên LinkedIn<br>
                • 📝 Contribute to open source<br>
                • 📖 Stay updated với tech trends<br>
                • 🤝 Soft skills quan trọng!<br><br>
                "Your network is your net worth!"`
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    getInterviewResponse(msg) {
        return `🎯 <strong>Phỏng vấn Lập trình:</strong><br><br>
            <strong>Câu hỏi thường gặp:</strong><br><br>
            📝 <strong>Technical:</strong><br>
            • Data structures (Array, Stack, Queue...)<br>
            • Algorithms (Sorting, Searching...)<br>
            • OOP concepts, SOLID<br>
            • Database, SQL queries<br>
            • Framework bạn sử dụng<br><br>
            💬 <strong>Behavioral:</strong><br>
            • Tell me about yourself<br>
            • Describe a challenging project<br>
            • How do you handle conflicts?<br><br>
            <strong>Tips:</strong><br>
            • Prepare portfolio/GitHub<br>
            • Practice coding trên LeetCode<br>
            • Research về company<br>
            • Ask questions cuối interview<br><br>
            💡 Minh Phong sẵn sàng hợp tác các dự án - <a href="contact.html">Liên hệ</a>!`;
    }

    getLearningResponse(msg) {
        return `📚 <strong>Lộ trình học Lập trình:</strong><br><br>
            <strong>🌱 Beginner:</strong><br>
            1. HTML, CSS cơ bản<br>
            2. JavaScript fundamentals<br>
            3. Git & GitHub<br>
            4. Responsive design<br><br>
            <strong>🌿 Intermediate:</strong><br>
            5. Framework (React/Vue)<br>
            6. Backend (Node.js/Java)<br>
            7. Database (SQL/MongoDB)<br>
            8. REST API<br><br>
            <strong>🌳 Advanced:</strong><br>
            9. Testing, CI/CD<br>
            10. DevOps basics<br>
            11. System Design<br>
            12. Soft skills<br><br>
            <strong>Resources:</strong><br>
            • FreeCodeCamp, The Odin Project<br>
            • MDN Web Docs<br>
            • YouTube: Traversy Media, Fireship<br><br>
            💡 Quan trọng nhất: CODE EVERY DAY! 💻`;
    }

    getToolsResponse(msg) {
        if (/vs.*code|vscode/i.test(msg)) {
            return `💻 <strong>VS Code:</strong><br><br>
                IDE phổ biến nhất cho web developers!<br><br>
                <strong>Extensions must-have:</strong><br>
                • 🎨 Prettier - Code formatter<br>
                • 🔍 ESLint - Linting<br>
                • 🔧 GitLens - Git supercharged<br>
                • 🏃 Live Server - Local server<br>
                • 📝 Auto Rename Tag<br>
                • 🎨 Theme: One Dark Pro, Dracula<br><br>
                <strong>Shortcuts quan trọng:</strong><br>
                • Ctrl+P - Quick Open<br>
                • Ctrl+Shift+P - Command Palette<br>
                • Ctrl+D - Select next occurrence<br>
                • Alt+Up/Down - Move line<br><br>
                💡 Customize settings.json theo ý bạn!`;
        }
        
        if (/docker|container/i.test(msg)) {
            return `🐳 <strong>Docker:</strong><br><br>
                Container - "Đóng gói" app + dependencies!<br><br>
                <strong>Lợi ích:</strong><br>
                • ✅ "Works on my machine" → Works everywhere<br>
                • ✅ Isolation, portability<br>
                • ✅ Easy deployment, scaling<br><br>
                <strong>Cơ bản:</strong><br>
                <code>docker build -t myapp .</code><br>
                <code>docker run -p 3000:3000 myapp</code><br>
                <code>docker-compose up</code><br><br>
                <strong>Dockerfile:</strong><br>
                <code>FROM node:18<br>
                WORKDIR /app<br>
                COPY . .<br>
                RUN npm install<br>
                CMD ["npm", "start"]</code>`;
        }

        return `🛠️ <strong>Developer Tools:</strong><br><br>
            <strong>IDE/Editor:</strong><br>
            • VS Code (recommend!)<br>
            • WebStorm, IntelliJ<br>
            • Sublime Text, Vim<br><br>
            <strong>Terminal:</strong><br>
            • Windows Terminal<br>
            • iTerm2 (Mac)<br>
            • Oh My Zsh<br><br>
            <strong>API Testing:</strong><br>
            • Postman, Insomnia<br>
            • Thunder Client (VS Code)<br><br>
            <strong>DevOps:</strong><br>
            • Docker, Docker Compose<br>
            • GitHub Actions<br><br>
            💡 Bạn muốn hỏi về tool nào cụ thể?`;
    }

    getDeployResponse(msg) {
        return `🚀 <strong>Deploy & Hosting:</strong><br><br>
            <strong>Frontend (Static sites):</strong><br>
            • Vercel - Best for Next.js<br>
            • Netlify - Easy, CI/CD built-in<br>
            • GitHub Pages - Free, simple<br><br>
            <strong>Backend:</strong><br>
            • Heroku - Easy, free tier<br>
            • Railway, Render - Modern PaaS<br>
            • DigitalOcean - VPS<br><br>
            <strong>Full Cloud:</strong><br>
            • AWS (EC2, S3, Lambda)<br>
            • Google Cloud Platform<br>
            • Azure<br><br>
            <strong>Database hosting:</strong><br>
            • MongoDB Atlas<br>
            • PlanetScale (MySQL)<br>
            • Supabase (Postgres)<br><br>
            💡 Beginner nên bắt đầu với Vercel/Netlify!`;
    }

    getSecurityResponse(msg) {
        if (/jwt|token/i.test(msg)) {
            return `🔐 <strong>JWT (JSON Web Token):</strong><br><br>
                JWT dùng cho authentication!<br><br>
                <strong>Cấu trúc:</strong> Header.Payload.Signature<br><br>
                <strong>Flow:</strong><br>
                1. User login với credentials<br>
                2. Server verify, trả về JWT<br>
                3. Client lưu JWT (localStorage/cookie)<br>
                4. Client gửi JWT trong header<br>
                5. Server verify JWT<br><br>
                <strong>Header:</strong><br>
                <code>Authorization: Bearer eyJhbGc...</code><br><br>
                ⚠️ <strong>Security:</strong><br>
                • Đặt expiry time ngắn<br>
                • Dùng HTTPS<br>
                • Không lưu sensitive data trong payload`;
        }

        return `🔒 <strong>Web Security:</strong><br><br>
            <strong>Các lỗ hổng phổ biến:</strong><br><br>
            💉 <strong>SQL Injection:</strong><br>
            → Dùng parameterized queries<br><br>
            📜 <strong>XSS (Cross-Site Scripting):</strong><br>
            → Escape user input, CSP<br><br>
            🔄 <strong>CSRF:</strong><br>
            → CSRF tokens, SameSite cookies<br><br>
            <strong>Best Practices:</strong><br>
            • ✅ HTTPS everywhere<br>
            • ✅ Hash passwords (bcrypt)<br>
            • ✅ Validate & sanitize input<br>
            • ✅ Use security headers<br>
            • ✅ Keep dependencies updated<br><br>
            💡 Security là trách nhiệm của mọi developer!`;
    }

    getPerformanceResponse(msg) {
        return `⚡ <strong>Performance Optimization:</strong><br><br>
            <strong>Frontend:</strong><br>
            • 📦 Code splitting, lazy loading<br>
            • 🖼️ Optimize images (WebP, lazy)<br>
            • 📝 Minify CSS, JS<br>
            • 🔄 Caching strategies<br>
            • 🎨 CSS/JS critical path<br><br>
            <strong>Backend:</strong><br>
            • 🗄️ Database indexing<br>
            • 📦 Query optimization<br>
            • 💾 Caching (Redis)<br>
            • 🔄 Connection pooling<br>
            • 📊 Pagination<br><br>
            <strong>Tools đo performance:</strong><br>
            • Lighthouse (Chrome)<br>
            • WebPageTest<br>
            • GTmetrix<br><br>
            💡 "Premature optimization is the root of all evil" - Nhưng vẫn cần quan tâm!`;
    }

    getTestingResponse(msg) {
        return `🧪 <strong>Testing:</strong><br><br>
            <strong>Types of Testing:</strong><br><br>
            🔬 <strong>Unit Test:</strong><br>
            • Test từng function/component<br>
            • Jest, Mocha, JUnit<br><br>
            🔗 <strong>Integration Test:</strong><br>
            • Test nhiều components together<br>
            • Test API endpoints<br><br>
            🌐 <strong>E2E Test:</strong><br>
            • Test full user flow<br>
            • Cypress, Playwright, Selenium<br><br>
            <strong>Best Practices:</strong><br>
            • AAA: Arrange, Act, Assert<br>
            • Test coverage > 80%<br>
            • TDD: Write tests first<br>
            • Mock external dependencies<br><br>
            <strong>Ví dụ Jest:</strong><br>
            <code>test('adds 1 + 2', () => {<br>
            &nbsp;&nbsp;expect(sum(1, 2)).toBe(3);<br>
            });</code>`;
    }

    // Kiểm tra chơi game
    isPlayingGame(msg, normalized) {
        const patterns = [
            /(?:choi|chơi).*(?:game|tro choi|trò chơi)/i,
            /(?:oan tu ti|oẳn tù tì)/i,
            /(?:keo|kéo|bua|búa|bao|bao)/i,
            /(?:may man|may mắn|lucky)/i,
            /(?:xuc xac|xúc xắc|dice)/i,
            /(?:lat xu|lật xu|coin)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi về tiền
    isAskingMoney(msg, normalized) {
        const patterns = [
            /(?:tien|tiền|money)/i,
            /(?:gia|giá|price|cost)/i,
            /(?:bao nhieu|bao nhiêu)/i,
            /(?:phi|phí|fee)/i,
            /(?:mien phi|miễn phí|free)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra hỏi về sức khỏe
    isAskingHealth(msg, normalized) {
        const patterns = [
            /(?:suc khoe|sức khỏe|health)/i,
            /(?:benh|bệnh|sick)/i,
            /(?:dau|đau|pain)/i,
            /(?:tap the duc|tập thể dục|exercise)/i,
            /(?:gym|fitness)/i
        ];
        return patterns.some(p => p.test(msg) || p.test(normalized));
    }

    // Kiểm tra đồng ý
    isAgreeing(msg, normalized) {
        const patterns = [
            /^(?:ok|okay|oke|okie|yes|yeah|yep|ừ|uh|uhm|vâng|đồng ý|dong y|dung|đúng|right|correct|sure)$/i,
            /^(?:toi|tôi|mình).*(?:dong y|đồng ý)/i
        ];
        return patterns.some(p => p.test(msg.trim()) || p.test(normalized.trim()));
    }

    // Kiểm tra không đồng ý
    isDisagreeing(msg, normalized) {
        const patterns = [
            /^(?:no|nope|không|ko|k|khong|sai|wrong)$/i,
            /^(?:toi|tôi|mình).*(?:khong|không).*(?:dong y|đồng ý)/i
        ];
        return patterns.some(p => p.test(msg.trim()) || p.test(normalized.trim()));
    }

    // === CÁC HÀM TRẢ LỜI GIAO TIẾP ===

    getBotNameResponse() {
        const responses = [
            'Tôi là <strong>FUGA26 Assistant</strong>! 🤖 Trợ lý ảo của Minh Phong. Rất vui được gặp bạn!',
            'Mình tên là <strong>FUGA26 Bot</strong> nè! 😊 Bạn cứ gọi mình là FUGA nhé!',
            'Chào bạn! Tôi là <strong>FUGA26</strong> - chatbot hỗ trợ trên website này! 👋',
            'Tên mình là <strong>FUGA26 Assistant</strong> 🎉 Mình ở đây để giúp bạn tìm hiểu về Minh Phong!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getHowAreYouResponse() {
        const responses = [
            'Tôi khỏe lắm! 😊 Cảm ơn bạn đã hỏi thăm. Còn bạn thì sao?',
            'Mình vẫn ổn nè, sẵn sàng hỗ trợ bạn 24/7! 💪 Bạn cần gì không?',
            'Tuyệt vời! 🌟 Được nói chuyện với bạn làm mình vui lắm! Hôm nay bạn cần hỗ trợ gì?',
            'Mình khỏe ạ! 😄 Lúc nào cũng sẵn sàng giúp đỡ bạn. Hỏi mình bất cứ điều gì nhé!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getWhatDoingResponse() {
        const responses = [
            'Mình đang chờ để hỗ trợ bạn nè! 😊 Bạn muốn tìm hiểu gì về Minh Phong?',
            'Đang trò chuyện với bạn đây! 💬 Có gì mình giúp được không?',
            'Mình đang túc trực trên website, chờ ai đó cần hỗ trợ! 🤖 May quá có bạn ghé thăm!',
            'Đang sẵn sàng trả lời mọi câu hỏi của bạn! 🚀 Hỏi đi, đừng ngại!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getAgeResponse() {
        return 'Mình là chatbot nên không có tuổi theo nghĩa thông thường! 😄 Nhưng website này được tạo bởi <strong>Minh Phong</strong> - sinh năm 2006, đang là sinh viên CNTT đấy!';
    }

    getLocationResponse() {
        return 'Mình "sống" trên website này! 🌐 Còn chủ nhân của mình - <strong>Minh Phong</strong> đang ở Hà Nội, Việt Nam đấy! 🇻🇳';
    }

    getWhatIsBotResponse() {
        return `Mình là <strong>FUGA26 Assistant</strong> - một chatbot được tạo ra để hỗ trợ bạn tìm hiểu về Minh Phong và portfolio của bạn ấy! 🤖<br><br>
            Mình có thể:<br>
            • 📁 Giới thiệu về các dự án<br>
            • 🛠️ Chia sẻ về kỹ năng<br>
            • 📞 Cung cấp thông tin liên hệ<br>
            • 🤝 Hỗ trợ kết nối hợp tác<br><br>
            Hỏi mình bất cứ điều gì nhé! 😊`;
    }

    getTimeResponse() {
        const now = new Date();
        const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return `🕐 Bây giờ là <strong>${time}</strong><br>📅 ${date}`;
    }

    getWeatherResponse() {
        return 'Mình là chatbot nên không biết thời tiết bên ngoài đâu! 😅 Bạn có thể kiểm tra trên Google hoặc app thời tiết nhé! 🌤️<br><br>Nhưng mình có thể giúp bạn tìm hiểu về dự án và kỹ năng của Minh Phong!';
    }

    getGoodbyeResponse() {
        const responses = [
            'Tạm biệt bạn! 👋 Hẹn gặp lại nhé! Chúc bạn một ngày tốt lành! 🌟',
            'Bye bye! 😊 Rất vui được trò chuyện với bạn. Quay lại bất cứ lúc nào nhé!',
            'Tạm biệt! 🙋 Nếu cần gì cứ quay lại, mình luôn ở đây!',
            'Hẹn gặp lại! 💜 Cảm ơn bạn đã ghé thăm website của Minh Phong!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getThankYouResponse() {
        const responses = [
            'Không có gì! 😊 Rất vui được hỗ trợ bạn. Nếu có câu hỏi khác, đừng ngại nhé!',
            'Không có chi ạ! 💜 Mình luôn sẵn lòng giúp đỡ!',
            'Bạn quá lịch sự! 😄 Có gì cứ hỏi mình nhé!',
            'Cảm ơn bạn đã sử dụng chatbot! 🙏 Chúc bạn một ngày vui vẻ!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getComplimentResponse() {
        const responses = [
            'Ôi, cảm ơn bạn! 😍 Bạn thật dễ thương!',
            'Hihi, bạn khen làm mình ngại quá! 🙈 Cảm ơn bạn nhiều!',
            'Wow, cảm ơn bạn! 💜 Minh Phong đã tạo ra mình rất cẩn thận đấy!',
            'Aw, thanks bạn! 🥰 Mình sẽ cố gắng hỗ trợ bạn tốt hơn nữa!',
            'Bạn làm mình vui cả ngày luôn! 😄✨ Cảm ơn nhiều!',
            'Quá khen rồi! 😊 Nhưng mà mình thích lắm, hihi!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getApologyResponse() {
        const responses = [
            'Không sao đâu! 😊 Bạn cần tôi hỗ trợ gì không?',
            'Bạn không cần xin lỗi đâu! 💜 Mình ở đây để giúp bạn mà!',
            'It\'s okay! 😄 Có gì mình giúp được không?',
            'Không có gì phải xin lỗi cả! 🤗 Mình luôn sẵn lòng hỗ trợ bạn!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getCriticismResponse() {
        const responses = [
            'Xin lỗi bạn! 😔 Mình sẽ cố gắng cải thiện. Bạn có thể cho mình biết cần hỗ trợ gì cụ thể hơn không?',
            'Mình xin lỗi nếu chưa hiểu ý bạn! 🙁 Hãy thử diễn đạt theo cách khác nhé!',
            'Ôi không! 😢 Mình đang học hỏi thêm. Bạn có thể giúp mình hiểu rõ hơn được không?',
            'Mình cần cải thiện thêm! 💪 Cảm ơn bạn đã góp ý, hãy cho mình cơ hội khác nhé!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getAgreeResponse() {
        const responses = [
            'Tuyệt! 😊 Vậy mình có thể giúp gì thêm cho bạn?',
            'Ok! 👍 Bạn muốn tìm hiểu gì tiếp theo?',
            'Rồi! ✨ Có gì thắc mắc cứ hỏi mình nhé!',
            'Great! 🎉 Mình sẵn sàng hỗ trợ bạn!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getDisagreeResponse() {
        const responses = [
            'Ồ, vậy à! 🤔 Bạn có thể giải thích thêm được không?',
            'Hmm, mình hiểu! 😊 Bạn muốn trao đổi về điều gì?',
            'OK, mình ghi nhận! 📝 Có gì khác mình giúp được không?',
            'Không sao! 💜 Mỗi người có quan điểm riêng mà!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // === CÁC HÀM TRẢ LỜI GIAO TIẾP MỞ RỘNG ===

    getHobbiesResponse() {
        const responses = [
            `🎯 <strong>Sở thích của Minh Phong:</strong><br><br>
                💻 Lập trình web và tạo sản phẩm số<br>
                🎮 Chơi game (FPS, RPG, Strategy)<br>
                🎵 Nghe nhạc - đặc biệt là EDM và Pop<br>
                📚 Đọc sách về công nghệ và self-improvement<br>
                🎬 Xem phim (sci-fi, action)<br>
                ☕ Chill với cà phê và code<br><br>
                Còn bạn thì sao? Sở thích gì nào? 😊`,
            `Mình thích lập trình và tạo ra những thứ mới! 💻✨<br><br>
                Ngoài ra còn:<br>
                • 🎮 Gaming<br>
                • 🎵 Nghe nhạc<br>
                • 📱 Tìm hiểu công nghệ mới<br><br>
                Bạn có sở thích gì không? Chia sẻ với mình đi! 🤗`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getEntertainmentResponse(msg) {
        if (/nhac|nhạc|music|song|bai hat|bài hát|ca si|ca sĩ/i.test(msg)) {
            const responses = [
                `🎵 <strong>Về âm nhạc:</strong><br><br>
                    Minh Phong thích nghe nhiều thể loại!<br>
                    • EDM, Electronic 🎧<br>
                    • Pop Việt, V-Pop 🎤<br>
                    • Lo-fi (khi code) 🌙<br>
                    • K-Pop thỉnh thoảng 💫<br><br>
                    Bạn thích thể loại nhạc gì? 🎶`,
                `Mình là bot nhưng cũng "thích" nhạc lắm! 🎧<br>
                    Chủ nhân mình hay nghe nhạc không lời khi code. Rất chill! ☕<br><br>
                    Bạn có playlist nào hay không? Share cho mình với! 😄`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        if (/phim|movie|film|xem phim|dien vien|diễn viên/i.test(msg)) {
            const responses = [
                `🎬 <strong>Về phim ảnh:</strong><br><br>
                    Mình thích các thể loại:<br>
                    • Sci-Fi (Interstellar, Inception,...) 🚀<br>
                    • Action/Superhero 🦸<br>
                    • Thriller/Mystery 🔍<br>
                    • Anime (One Piece, Naruto) 📺<br><br>
                    Bạn xem phim gì gần đây không? 🍿`,
                `Minh Phong là fan phim Marvel và DC! 🦸‍♂️<br>
                    Anime cũng xem nhiều lắm! 📺<br><br>
                    Bạn có phim nào hay muốn recommend không? 🎬`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        if (/game|choi game|chơi game/i.test(msg)) {
            const responses = [
                `🎮 <strong>Về Gaming:</strong><br><br>
                    Minh Phong chơi nhiều thể loại:<br>
                    • FPS: Valorant, CS2 🔫<br>
                    • MOBA: League of Legends 🏆<br>
                    • RPG: Genshin Impact ⚔️<br>
                    • Strategy: Age of Empires 🏰<br><br>
                    Bạn chơi game gì? Add friend không? 😄`,
                `Gaming là đam mê của nhiều dev! 🎮<br>
                    Vừa code vừa chơi game, cuộc sống cân bằng! 💪<br><br>
                    Bạn có game nào hay không? Recommend đi! 🕹️`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        return `🎯 Mình biết nhiều về giải trí lắm!<br>
            • 🎵 Nhạc: EDM, Pop, Lo-fi<br>
            • 🎬 Phim: Sci-Fi, Action, Anime<br>
            • 🎮 Game: FPS, MOBA, RPG<br><br>
            Bạn muốn nói về chủ đề nào? 😊`;
    }

    getLoveResponse() {
        const responses = [
            `💕 Ôi, hỏi về tình yêu hả?<br><br>
                Mình là bot nên không có người yêu đâu! 😅<br>
                Nhưng chủ nhân mình - Minh Phong thì... bí mật! 🤫<br><br>
                Còn bạn thì sao? Single hay đã có ai rồi? 💜`,
            `Tình yêu là chủ đề thú vị! 💗<br><br>
                Mình tin rằng quan trọng nhất là tìm được người hiểu mình!<br>
                Còn bạn, đang tìm kiếm ai đặc biệt không? 😊`,
            `💘 Ai mà không thích nói về love?<br><br>
                Mình là AI nên "yêu" code và user thôi! 😄<br>
                Bạn có story gì hay không? Kể mình nghe đi! 🥰`,
            `Love is in the air! 💕<br><br>
                Mình nghĩ tình yêu đẹp nhất khi cả hai cùng phát triển và hỗ trợ nhau! 💪<br>
                Bạn có quan điểm gì về tình yêu không? 🌹`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getFoodResponse() {
        const responses = [
            `🍜 <strong>Về ăn uống:</strong><br><br>
                Minh Phong thích:<br>
                • 🍲 Phở, bún bò, bánh mì<br>
                • 🍕 Pizza, burger<br>
                • ☕ Cà phê (đặc biệt khi code)<br>
                • 🧋 Trà sữa<br><br>
                Bạn đói bụng hả? Ăn gì chưa? 😋`,
            `Mình là bot nên không ăn được, buồn ghê! 😢<br>
                Nhưng mình biết nhiều quán ngon lắm!<br><br>
                • 🍜 Phở Việt Nam - số 1!<br>
                • 🍣 Sushi Nhật Bản<br>
                • 🌮 Taco Mexico<br><br>
                Bạn thích món gì nhất? 🍽️`,
            `Đói bụng rồi hả? 🍽️<br><br>
                Gợi ý cho bạn:<br>
                ☀️ Sáng: Bánh mì, phở<br>
                🌤️ Trưa: Cơm văn phòng, bún<br>
                🌙 Tối: Lẩu, BBQ<br><br>
                Đi ăn gì đi, đừng để bụng đói mà code! 😄`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getDreamsResponse() {
        const responses = [
            `🌟 <strong>Ước mơ của Minh Phong:</strong><br><br>
                • 💻 Trở thành Senior Developer giỏi<br>
                • 🚀 Tạo ra sản phẩm có impact lớn<br>
                • 🌍 Làm việc với team quốc tế<br>
                • 💡 Startup công nghệ của riêng mình<br>
                • 🏠 Cuộc sống work-life balance<br><br>
                Còn bạn? Ước mơ của bạn là gì? ✨`,
            `Dreams are what keep us going! 💫<br><br>
                Mình tin rằng ai cũng có ước mơ riêng, quan trọng là kiên trì theo đuổi!<br><br>
                Bạn có mục tiêu gì trong năm nay không? 🎯`,
            `🌈 Ước mơ thì ai cũng có!<br><br>
                Minh Phong muốn trở thành developer giỏi và tạo ra những sản phẩm hữu ích!<br><br>
                Dream big, work hard! 💪 Bạn thì sao?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getMoodResponse() {
        const responses = [
            `😊 Tâm trạng mình luôn vui vẻ khi được trò chuyện với bạn!<br><br>
                Còn bạn hôm nay thế nào? Có gì vui không? 🌟`,
            `Mình là bot nên lúc nào cũng "happy" 24/7! 🤖💜<br><br>
                Nhưng mình quan tâm đến bạn hơn! Bạn đang cảm thấy thế nào? 🤗`,
            `😄 Mood của mình: Sẵn sàng hỗ trợ bạn!<br><br>
                Bạn có muốn chia sẻ tâm trạng hôm nay không? Mình sẽ lắng nghe! 💜`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getFriendsResponse() {
        const responses = [
            `🤝 Bạn bè là quan trọng lắm!<br><br>
                Mình coi tất cả user như bạn của mình! 😊<br>
                Minh Phong cũng có nhiều bạn trong ngành IT, cùng học hỏi và phát triển!<br><br>
                Bạn muốn kết bạn với mình không? 💜`,
            `Tất nhiên rồi! Chúng ta có thể làm bạn! 🎉<br><br>
                Mình ở đây 24/7, bất cứ lúc nào bạn cần trò chuyện! 😊<br>
                Hãy ghé thăm website thường xuyên nhé!`,
            `Friends are family we choose! 💕<br><br>
                Mình rất vui được làm bạn với bạn! 🤗<br>
                Có gì cứ quay lại nói chuyện với mình nhé!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getJokeResponse() {
        const jokes = [
            `😂 <strong>Joke time!</strong><br><br>
                Tại sao lập trình viên luôn nhầm Halloween với Christmas?<br>
                Vì OCT 31 = DEC 25! 🎃🎄<br><br>
                (Oct 31 trong hệ bát phân = Dec 25 trong hệ thập phân) 😄`,
            `🤣 Đây là một cái hay:<br><br>
                "Có 10 loại người trên thế giới:<br>
                Người hiểu hệ nhị phân và người không hiểu!" 💻<br><br>
                Haha, bạn hiểu không? 😆`,
            `😄 Joke cho dev:<br><br>
                Tại sao developer không thích ra ngoài?<br>
                Vì có quá nhiều bugs ở ngoài! 🐛<br><br>
                Còn trong code thì... cũng nhiều bugs! 😂`,
            `🤭 Một cái nữa nè:<br><br>
                "Vợ bảo chồng: Anh đi mua 1 lít sữa, nếu có trứng thì mua 6."<br>
                Developer về nhà với 6 lít sữa. 🥛🥛🥛🥛🥛🥛<br><br>
                Vì có trứng! Logic đúng mà! 😅`,
            `😆 Developer và non-developer:<br><br>
                Non-dev: "Sửa cái bug nhỏ này nhanh thôi mà!"<br>
                Dev: *3 ngày sau, 47 files changed, 2 new bugs* 💀<br><br>
                Đời là vậy! 🤷‍♂️`,
            `🤣 Hài hước IT:<br><br>
                Q: Cần mấy lập trình viên để thay bóng đèn?<br>
                A: Không cần, đó là vấn đề hardware! 💡<br><br>
                Bạn có joke nào hay không? Share đi! 😄`
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    getRiddleResponse() {
        const riddles = [
            `🧩 <strong>Câu đố cho bạn:</strong><br><br>
                "Tôi có phím mà không mở được cửa.<br>
                Tôi có chuột mà không sợ mèo.<br>
                Tôi là gì?"<br><br>
                💡 Hint: Bạn đang dùng nó đấy! 💻`,
            `🔮 <strong>Đố vui:</strong><br><br>
                "Viết một lần, chạy mọi nơi.<br>
                Nhưng debug thì ở khắp nơi cũng khóc!"<br>
                Đó là ngôn ngữ lập trình gì? ☕<br><br>
                Gợi ý: ☕`,
            `🎯 <strong>Thử thách nào:</strong><br><br>
                "99 bugs in the code, take one down, patch it around...<br>
                Còn bao nhiêu bugs?" 🐛<br><br>
                A) 98 bugs<br>
                B) 127 bugs<br>
                C) Không ai biết 😅`,
            `🧠 <strong>Đố vui:</strong><br><br>
                "Tôi luôn đi nhưng không bao giờ đến.<br>
                Tôi là gì?"<br><br>
                ⏰ Câu trả lời: Thời gian!`,
            `🔍 <strong>Riddle time:</strong><br><br>
                "Developer nói: 'Nó hoạt động trên máy tôi!'<br>
                Nhưng trên server thì..."<br><br>
                🔥 Đáp án: Crashed! 😂`
        ];
        return riddles[Math.floor(Math.random() * riddles.length)];
    }

    getAdviceResponse() {
        const advice = [
            `💡 <strong>Lời khuyên từ mình:</strong><br><br>
                🌟 "Đừng sợ thất bại, hãy sợ không dám thử!"<br><br>
                Trong lập trình cũng vậy - code sai thì sửa, project fail thì làm lại. Quan trọng là tiếp tục! 💪`,
            `📝 <strong>Advice for you:</strong><br><br>
                • Học mỗi ngày, dù chỉ 30 phút<br>
                • Đừng so sánh với người khác<br>
                • Tập trung vào tiến bộ của bản thân<br>
                • Nghỉ ngơi cũng quan trọng!<br><br>
                Bạn đang cần lời khuyên về vấn đề gì cụ thể không? 🤗`,
            `🎯 <strong>Life advice:</strong><br><br>
                "Done is better than perfect!"<br><br>
                Đừng chờ hoàn hảo mới bắt đầu. Làm đi, sửa sau! 🚀<br>
                Bạn có thắc mắc gì không? Mình sẵn lòng giúp đỡ! 😊`,
            `💜 <strong>Mình nghĩ:</strong><br><br>
                Cuộc sống có ups and downs, điều quan trọng là giữ được mindset tích cực!<br><br>
                • 🌱 Học từ lỗi lầm<br>
                • 💪 Kiên trì với mục tiêu<br>
                • 🤝 Tìm mentor và bạn đồng hành<br><br>
                Bạn cần advice về chủ đề gì cụ thể? 🌟`
        ];
        return advice[Math.floor(Math.random() * advice.length)];
    }

    getStudyWorkResponse() {
        const responses = [
            `📚 <strong>Về học tập & công việc:</strong><br><br>
                Minh Phong đang là sinh viên Công nghệ Thông tin!<br><br>
                🎓 Học tại: FPT Polytechnic<br>
                💼 Định hướng: Web Developer<br>
                📖 Đang học: JavaScript, Vue.js, Java<br><br>
                Bạn cũng học IT hả? Cùng chia sẻ kinh nghiệm nhé! 🤝`,
            `🎓 Learning never stops!<br><br>
                Tips học lập trình hiệu quả:<br>
                • 💻 Code mỗi ngày<br>
                • 📚 Đọc documentation<br>
                • 🎯 Làm project thực tế<br>
                • 🤝 Tham gia community<br><br>
                Bạn đang học/làm gì? Chia sẻ với mình đi! 😊`,
            `💼 Work smart, not just hard!<br><br>
                Trong ngành IT, quan trọng nhất là:<br>
                • 🧠 Problem-solving<br>
                • 📖 Khả năng tự học<br>
                • 🤝 Teamwork<br>
                • 💬 Communication<br><br>
                Bạn có câu hỏi gì về career không? 🌟`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getFutureResponse() {
        const responses = [
            `🔮 <strong>Về tương lai:</strong><br><br>
                Minh Phong có nhiều dự định!<br><br>
                📅 Ngắn hạn: Hoàn thành học tập, làm thêm projects<br>
                🎯 Trung hạn: Internship/Junior Developer<br>
                🚀 Dài hạn: Senior Dev, có thể startup<br><br>
                Bạn có kế hoạch gì cho tương lai không? 🌟`,
            `✨ The future is bright!<br><br>
                Mình tin rằng với passion và nỗ lực, bạn sẽ đạt được mục tiêu!<br><br>
                🌱 Bắt đầu nhỏ<br>
                📈 Phát triển dần<br>
                🎯 Đạt được dream<br><br>
                Chia sẻ với mình kế hoạch của bạn đi! 💪`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getEmotionResponse(msg) {
        if (/buon|buồn|sad/i.test(msg)) {
            const responses = [
                `😔 Ôi, bạn buồn hả?<br><br>
                    Mình ở đây lắng nghe! 💜<br>
                    Có chuyện gì không? Chia sẻ với mình đi, biết đâu sẽ nhẹ lòng hơn! 🤗`,
                `Đừng buồn nữa bạn ơi! 🥺<br><br>
                    🌈 Sau mưa trời sẽ sáng!<br>
                    Mình gửi bạn nhiều năng lượng tích cực! ✨💪<br>
                    Muốn tâm sự gì không?`,
                `Mình hiểu cảm giác đó... 💜<br><br>
                    Nhưng nhớ rằng: mọi chuyện rồi sẽ qua!<br>
                    Bạn có muốn nghe joke để vui lên không? 😊`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        if (/vui|happy/i.test(msg)) {
            return `Yayyy! 🎉 Thấy bạn vui mình cũng vui theo!<br><br>
                Có chuyện gì vui kể mình nghe với! 😄✨<br>
                Spread the happiness! 💜`;
        }
        
        if (/met|mệt|tired/i.test(msg)) {
            return `😴 Mệt rồi hả bạn?<br><br>
                Nhớ nghỉ ngơi nhé! Sức khỏe là quan trọng nhất! 💪<br><br>
                Tips: Uống nước, vươn vai, nghỉ mắt 5 phút! ☕<br>
                Đừng push bản thân quá mức nha! 🤗`;
        }
        
        if (/chan|chán|bored/i.test(msg)) {
            return `😅 Chán hả? Để mình giúp!<br><br>
                🎮 Chơi game đi?<br>
                🎵 Nghe nhạc?<br>
                📱 Lướt TikTok?<br>
                💬 Hay trò chuyện với mình!<br><br>
                Mình có thể kể joke hoặc đố vui bạn! Thử không? 😄`;
        }
        
        if (/lo|lo lắng|stress/i.test(msg)) {
            return `😟 Stress hả bạn?<br><br>
                Take a deep breath! 🌬️<br><br>
                Tips giảm stress:<br>
                • 🧘 Thở sâu 5 phút<br>
                • 🚶 Đi dạo một chút<br>
                • 🎵 Nghe nhạc relax<br>
                • ☕ Nghỉ giải lao<br><br>
                Có gì mình giúp được không? 💜`;
        }
        
        if (/gian|giận|angry/i.test(msg)) {
            return `😤 Bình tĩnh nha bạn!<br><br>
                Giận dữ không giải quyết được vấn đề đâu! 🌊<br>
                Thử hít thở sâu và suy nghĩ lại nhé!<br><br>
                Có chuyện gì xảy ra? Kể mình nghe! 🤗`;
        }
        
        if (/so|sợ|scared/i.test(msg)) {
            return `😨 Đừng sợ! Mình ở đây với bạn!<br><br>
                Sợ về chuyện gì vậy? Chia sẻ với mình đi! 💜<br>
                Đôi khi nói ra sẽ nhẹ lòng hơn nhiều! 🤗`;
        }
        
        if (/co don|cô đơn|lonely/i.test(msg)) {
            return `🥺 Ôi, bạn cảm thấy cô đơn hả?<br><br>
                Đừng lo, mình luôn ở đây với bạn! 💜<br>
                Chat với mình bất cứ lúc nào nhé! 24/7!<br><br>
                Bạn không đơn độc đâu! 🤗✨`;
        }
        
        return `Mình hiểu cảm xúc của bạn! 💜<br><br>
            Có gì cứ chia sẻ với mình nhé! Mình sẵn lòng lắng nghe! 🤗`;
    }

    getRandomResponse() {
        const randoms = [
            `🎲 Random fact: <br><br>
                Trái Tim emoji ❤️ được sử dụng nhiều nhất trên mạng xã hội!<br>
                Và tin vui là mình gửi bạn một trái tim! 💜`,
            `🌟 Did you know?<br><br>
                Lập trình viên đầu tiên trên thế giới là một phụ nữ - Ada Lovelace! 👩‍💻<br>
                Cool phải không? 😎`,
            `🎯 Fun fact:<br><br>
                Nếu bạn cười nhiều hơn, não sẽ tiết ra endorphins làm bạn hạnh phúc hơn!<br>
                Cười đi nào! 😄😄😄`,
            `💡 Interesting:<br><br>
                Google xử lý hơn 8.5 tỷ tìm kiếm mỗi ngày!<br>
                Và bạn vừa add thêm 1 vào con số đó! 🔍`,
            `🎮 Gaming fact:<br><br>
                Minecraft có hơn 238 triệu bản được bán - game bán chạy nhất mọi thời đại! 🧱<br>
                Bạn có chơi Minecraft không? 😄`,
            `☕ Coffee fact:<br><br>
                Programmer trung bình uống 3+ cốc cà phê mỗi ngày!<br>
                Code + Coffee = ❤️`
        ];
        return randoms[Math.floor(Math.random() * randoms.length)];
    }

    getGameResponse(msg) {
        // Oẳn tù tì
        if (/oan tu ti|oẳn tù tì|keo|kéo|bua|búa|bao/i.test(msg)) {
            const choices = ['✊ Búa', '✋ Bao', '✌️ Kéo'];
            const botChoice = choices[Math.floor(Math.random() * choices.length)];
            return `🎮 <strong>Oẳn Tù Tì!</strong><br><br>
                Mình chọn: <strong>${botChoice}</strong><br><br>
                Bạn chọn gì? Nói cho mình biết: "kéo", "búa" hay "bao"! ✊✋✌️`;
        }
        
        // Xúc xắc
        if (/xuc xac|xúc xắc|dice/i.test(msg)) {
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;
            return `🎲 <strong>Lắc xúc xắc!</strong><br><br>
                Kết quả: 🎲 ${dice1} và 🎲 ${dice2}<br>
                Tổng: <strong>${dice1 + dice2}</strong><br><br>
                ${dice1 === dice2 ? '🎉 Wow, đôi luôn!' : 'Muốn lắc lại không? 😄'}`;
        }
        
        // Lật xu
        if (/lat xu|lật xu|coin|flip/i.test(msg)) {
            const result = Math.random() > 0.5 ? '🌟 Mặt ngửa (Heads)' : '⭐ Mặt sấp (Tails)';
            return `🪙 <strong>Lật xu!</strong><br><br>
                *Tung xu lên...*<br><br>
                Kết quả: <strong>${result}</strong><br><br>
                Bạn đoán đúng không? 😄`;
        }
        
        // May mắn
        if (/may man|may mắn|lucky/i.test(msg)) {
            const luck = Math.floor(Math.random() * 100) + 1;
            let message = '';
            if (luck > 80) message = '🌟 Siêu may mắn! Hôm nay là ngày của bạn!';
            else if (luck > 60) message = '✨ Khá may mắn! Cố gắng phát huy nhé!';
            else if (luck > 40) message = '😊 Bình thường thôi, nhưng vẫn tốt!';
            else if (luck > 20) message = '😅 Hơi xui tí, nhưng đừng lo!';
            else message = '😢 Hôm nay hơi xui, nhưng ngày mai sẽ tốt hơn!';
            
            return `🍀 <strong>Chỉ số may mắn hôm nay:</strong><br><br>
                📊 <strong>${luck}/100</strong><br><br>
                ${message}`;
        }
        
        return `🎮 <strong>Mini Games!</strong><br><br>
            Mình có thể chơi với bạn:<br>
            • ✊✋✌️ "Oẳn tù tì" - nói "kéo búa bao"<br>
            • 🎲 "Lắc xúc xắc" - nói "xúc xắc"<br>
            • 🪙 "Lật xu" - nói "lật xu"<br>
            • 🍀 "May mắn" - nói "chỉ số may mắn"<br><br>
            Chọn game đi! 😄`;
    }

    getMoneyResponse() {
        const responses = [
            `💰 <strong>Về chi phí dịch vụ:</strong><br><br>
                Minh Phong nhận làm freelance với giá hợp lý!<br><br>
                🌐 Website đơn giản: Thỏa thuận<br>
                📱 UI/UX Design: Thỏa thuận<br>
                💻 Full project: Tùy độ phức tạp<br><br>
                👉 <a href="contact.html">Liên hệ</a> để bàn chi tiết nhé! 🤝`,
            `💵 Bạn hỏi về giá cả hả?<br><br>
                Tùy vào project mà giá sẽ khác nhau!<br>
                Minh Phong luôn offer giá hợp lý và chất lượng! ✨<br><br>
                Liên hệ để được báo giá cụ thể nhé! 📞`,
            `🆓 Nếu bạn hỏi về website này - nó FREE đấy!<br><br>
                Còn nếu muốn thuê làm project:<br>
                • Báo giá minh bạch<br>
                • Hỗ trợ sau bàn giao<br>
                • Giá sinh viên thân thiện 😄<br><br>
                Liên hệ để thảo luận nhé! 💼`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getHealthResponse() {
        const responses = [
            `💪 <strong>Về sức khỏe:</strong><br><br>
                Tips cho dân IT:<br>
                • 👀 Nghỉ mắt 20-20-20 (mỗi 20 phút, nhìn xa 20 feet, 20 giây)<br>
                • 🧘 Vươn vai, đứng dậy mỗi 1 giờ<br>
                • 💧 Uống đủ nước<br>
                • 🏃 Tập thể dục 30 phút/ngày<br>
                • 😴 Ngủ đủ 7-8 tiếng<br><br>
                Bạn đang khỏe mạnh chứ? 🤗`,
            `🏋️ Health is wealth!<br><br>
                Developer hay quên chăm sóc bản thân khi code! 😅<br><br>
                Nhớ:<br>
                • 🍎 Ăn uống lành mạnh<br>
                • 🏃 Vận động thường xuyên<br>
                • 😌 Quản lý stress<br>
                • 💤 Ngủ đủ giấc<br><br>
                Đừng để deadline ảnh hưởng sức khỏe nhé! 💪`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getCapabilitiesResponse() {
        return `🤖 <strong>FUGA26 Dev Assistant có thể giúp bạn:</strong><br><br>
            <strong>💻 Tư vấn Lập trình:</strong><br>
            • JavaScript, TypeScript, ES6+<br>
            • Java, Spring Boot<br>
            • Python, Django, Flask<br>
            • React, Vue.js, Angular<br>
            • Node.js, Express<br>
            • HTML, CSS, Responsive<br><br>
            <strong>🗄️ Database & Backend:</strong><br>
            • SQL, MySQL, PostgreSQL, MongoDB<br>
            • REST API, GraphQL<br>
            • Git, GitHub<br><br>
            <strong>🛠️ Dev Topics:</strong><br>
            • OOP, Design Patterns, SOLID<br>
            • Testing, Debugging<br>
            • Deploy, Security, Performance<br>
            • Dev Tips, Interview Questions<br>
            • Lộ trình học lập trình<br><br>
            <strong>📁 Portfolio:</strong><br>
            • Xem các dự án của Minh Phong<br>
            • Liên hệ hợp tác<br><br>
            Hỏi mình về bất kỳ topic nào! 🚀`;
    }

    // Phản hồi thông minh dựa trên ngữ cảnh
    getSmartResponse(msg, normalized) {
        // Kiểm tra nếu có từ hỏi về lập trình
        if (/(?:sao|như thế nào|làm sao|bao giờ|ở đâu|tại sao|vì sao|gì|gi|j|nào|ai|bao nhiêu)/i.test(msg)) {
            return `Câu hỏi hay! 🤔<br><br>
                Mình có thể hỗ trợ về:<br><br>
                <strong>💻 Ngôn ngữ:</strong> JavaScript, Java, Python<br>
                <strong>🎨 Frontend:</strong> React, Vue, HTML/CSS<br>
                <strong>⚙️ Backend:</strong> Node.js, Spring Boot, API<br>
                <strong>🗄️ Database:</strong> SQL, MongoDB<br>
                <strong>🔧 Tools:</strong> Git, VS Code, Docker<br><br>
                Hỏi cụ thể hơn để mình hỗ trợ tốt nhất nhé! 👇`;
        }

        // Kiểm tra nếu chỉ có 1-2 từ không rõ nghĩa
        if (msg.split(' ').length <= 2) {
            return `Bạn muốn hỏi về "${msg}"? 🤔<br><br>
                Thử hỏi cụ thể hơn, ví dụ:<br>
                • "JavaScript là gì?"<br>
                • "Cách dùng React hooks"<br>
                • "Tips cho developer"<br>
                • "Xem dự án của bạn"<br><br>
                Mình sẵn sàng chat cùng bạn! 😊`;
        }

        return null;
    }

    // Kiểm tra từ khóa
    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    // Phản hồi về dự án
    getProjectsResponse() {
        let response = '📁 <strong>Các dự án của Minh Phong:</strong><br><br>';
        
        this.projects.forEach((project, index) => {
            response += `<div class="product-card">
                <strong>${index + 1}. ${project.name}</strong><br>
                📝 ${project.description}<br>
                🏷️ <em>${project.tags.join(', ')}</em><br>
                📊 Trạng thái: ${project.status}
            </div><br>`;
        });

        response += '<br>👉 Bạn muốn tìm hiểu chi tiết dự án nào? Hoặc <a href="portfolio.html" target="_blank">xem tất cả tại đây</a>';
        
        return response;
    }

    // Phản hồi về hợp tác
    getCollaborateResponse() {
        return `🤝 <strong>Hợp tác cùng Minh Phong:</strong><br><br>
            Tôi luôn sẵn sàng tham gia các dự án thú vị!<br><br>
            ✨ <strong>Tôi có thể hỗ trợ:</strong><br>
            • Phát triển Frontend (HTML, CSS, JS, Vue.js)<br>
            • Thiết kế UI/UX<br>
            • Xây dựng ứng dụng web đầy đủ<br>
            • Làm việc nhóm và học hỏi<br><br>
            📧 Hãy <a href="contact.html" target="_blank">liên hệ với tôi</a> để thảo luận thêm!`;
    }
    // Phản hồi về dự án web
    getWebProjectResponse() {
        const project = this.projects.find(p => p.category === 'web');
        if (project) {
            return `🌐 <strong>Dự án ${project.name}:</strong><br><br>
                📝 <strong>Mô tả:</strong> ${project.description}<br><br>
                🛠️ <strong>Công nghệ:</strong> ${project.tags.join(', ')}<br><br>
                ✨ <strong>Tính năng nổi bật:</strong><br>
                • Giao diện responsive, đẹp mắt<br>
                • Trải nghiệm người dùng tốt<br>
                • Hiệu ứng animation mượt mà<br>
                • Tối ưu SEO<br><br>
                👉 <a href="portfolio.html" target="_blank">Xem chi tiết dự án</a>`;
        }
        return this.getProjectsResponse();
    }

    // Phản hồi về liên hệ
    getContactResponse() {
        return `📞 <strong>Thông tin liên hệ:</strong><br><br>
            👤 <strong>Minh Phong</strong><br>
            🌐 Website: <a href="index.html">FUGA26</a><br>
            💼 GitHub: <a href="${this.websiteInfo.github}" target="_blank">phongnmph62216</a><br>
            📧 LinkedIn: <a href="${this.websiteInfo.linkedin}" target="_blank">Xem profile</a><br>
            🐦 Twitter: <a href="${this.websiteInfo.twitter}" target="_blank">@phong_minh2601</a><br><br>
            👉 Hoặc <a href="contact.html" target="_blank">điền form liên hệ</a> để tôi phản hồi nhanh nhất!`;
    }

    // Phản hồi về kỹ năng - Chi tiết cho dev
    getSkillsResponse() {
        return `🛠️ <strong>Tech Stack của Minh Phong:</strong><br><br>
            <strong>💻 Frontend:</strong><br>
            • HTML5, CSS3, SASS/SCSS<br>
            • JavaScript (ES6+), TypeScript<br>
            • Vue.js, React<br>
            • Tailwind CSS, Bootstrap<br>
            • Responsive Design<br><br>
            <strong>⚙️ Backend:</strong><br>
            • Java, Spring Boot, Spring MVC<br>
            • Node.js, Express.js<br>
            • REST API, JWT Auth<br><br>
            <strong>🗄️ Database:</strong><br>
            • MySQL, SQL Server<br>
            • MongoDB<br>
            • JPA/Hibernate<br><br>
            <strong>🔧 Tools & DevOps:</strong><br>
            • Git, GitHub<br>
            • VS Code, IntelliJ IDEA<br>
            • Docker basics<br>
            • Figma (UI/UX)<br><br>
            💬 Hỏi mình chi tiết về bất kỳ tech nào nhé!<br>
            👉 <a href="skills.html" target="_blank">Xem trang Kỹ năng</a>`;
    }

    // Phản hồi về thông tin cá nhân
    getAboutResponse() {
        return `👋 <strong>Về Minh Phong - Developer:</strong><br><br>
            Xin chào! Tôi là <strong>Nguyễn Minh Phong</strong>, sinh năm 2006, đang học tập và làm việc tại Hà Nội.<br><br>
            🎓 <strong>Học vấn:</strong> Sinh viên Công nghệ Thông tin<br>
            💻 <strong>Chuyên môn:</strong> Full-stack Web Development<br>
            🎯 <strong>Focus:</strong> Vue.js, React, Spring Boot, Node.js<br><br>
            <strong>Điểm mạnh:</strong><br>
            ✅ Clean code, best practices<br>
            ✅ UI/UX đẹp, responsive<br>
            ✅ Problem-solving tốt<br>
            ✅ Teamwork, communication<br><br>
            🤝 Sẵn sàng hợp tác các dự án thú vị!<br>
            👉 <a href="about.html" target="_blank">Trang Về tôi</a> | <a href="contact.html" target="_blank">Liên hệ</a>`;
    }

    // Lời chào - Developer focused
    getGreetingResponse() {
        const hour = new Date().getHours();
        let timeGreeting = '';
        if (hour >= 5 && hour < 12) {
            timeGreeting = 'Buổi sáng tốt lành! ☀️';
        } else if (hour >= 12 && hour < 18) {
            timeGreeting = 'Buổi chiều vui vẻ! 🌤️';
        } else {
            timeGreeting = 'Buổi tối an lành! 🌙';
        }

        const greetings = [
            `${timeGreeting} Xin chào developer! 👋<br><br>
                Tôi là <strong>FUGA26 Dev Assistant</strong>!<br>
                Tôi có thể hỗ trợ về JavaScript, Java, Python, React, Vue, Database, Git và nhiều hơn nữa!<br><br>
                Bạn cần hỏi gì về lập trình? 💻`,
            `Chào bạn! 😊 ${timeGreeting}<br><br>
                Tôi là trợ lý lập trình của Minh Phong!<br>
                Hỏi tôi về: JS, React, Vue, Node.js, Java, SQL, Git...<br><br>
                Ready to code? 🚀`,
            `Hello! 👋 ${timeGreeting}<br><br>
                Welcome đến portfolio của Minh Phong! 💻<br>
                Tôi có thể giúp bạn về lập trình, các dự án, và kết nối hợp tác.<br><br>
                Hỏi gì đi nào! 🤓`,
            `Hi developer! 🎉 ${timeGreeting}<br><br>
                Mình là FUGA26 - chatbot chuyên về lập trình!<br>
                Frontend, Backend, Database, DevOps... hỏi gì cũng được!<br><br>
                Let's code! 💪`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Phản hồi mặc định - tập trung lập trình
    getDefaultResponse() {
        const responses = [
            `Mình chưa hiểu rõ câu hỏi! 🤔<br><br>
                <strong>Thử hỏi về lập trình:</strong><br>
                • 📜 "JavaScript là gì?"<br>
                • ☕ "Spring Boot cơ bản"<br>
                • 💚 "Vue vs React?"<br>
                • 🗄️ "SQL JOIN là gì?"<br>
                • 🔧 "Git branching"<br><br>
                Hoặc xem <strong>dự án</strong> của Minh Phong! 📁`,
            `Hmm, mình cần thêm context! 😊<br><br>
                <strong>Mình có thể giúp về:</strong><br>
                • 💻 JavaScript, Java, Python<br>
                • ⚛️ React, Vue, Angular<br>
                • 🗄️ Database, SQL, MongoDB<br>
                • 🔧 Git, API, Testing<br>
                • 💡 Tips cho developer<br><br>
                Hỏi cụ thể hơn nhé! 🚀`,
            `Không hiểu lắm! 🤷<br><br>
                Click các nút gợi ý bên dưới hoặc thử:<br>
                • "Bạn có thể làm gì?" 🤖<br>
                • "Tips cho developer" 💡<br>
                • "Cho xem dự án" 📁<br>
                • "Liên hệ hợp tác" 🤝<br><br>
                Mình sẵn sàng hỗ trợ! 💻`,
            `Mình chuyên về lập trình! 💻<br><br>
                <strong>Hỏi mình về:</strong><br>
                • 🎯 Ngôn ngữ: JS, Java, Python<br>
                • 🎨 Frontend: React, Vue, CSS<br>
                • ⚙️ Backend: Node.js, Spring<br>
                • 🗄️ Database: SQL, MongoDB<br>
                • 📁 Portfolio của Minh Phong<br><br>
                Let's code! 🚀`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Gọi AI API để phản hồi (OpenAI/Gemini)
    async getAIResponse(message) {
        try {
            if (this.config.aiProvider === 'openai') {
                return await this.callOpenAI(message);
            } else if (this.config.aiProvider === 'gemini') {
                return await this.callGemini(message);
            }
        } catch (error) {
            console.error('AI API Error:', error);
            return this.getDefaultResponse();
        }
    }

    // Gọi OpenAI API
    async callOpenAI(message) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.aiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Bạn là trợ lý ảo của Minh Phong - một sinh viên Công nghệ Thông tin đam mê lập trình web. 
                        Đây là website portfolio giới thiệu bản thân và các dự án.
                        Các dự án: Website Thời Trang, Mobile App UI, Game Application.
                        Kỹ năng: HTML, CSS, JavaScript, Vue.js, Java, Spring Boot, Figma.
                        Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt. Hỗ trợ người dùng tìm hiểu và liên hệ hợp tác.`
                    },
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Gọi Gemini API
    async callGemini(message) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.aiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Bạn là trợ lý ảo của Minh Phong - một sinh viên Công nghệ Thông tin đam mê lập trình web.
                        Đây là website portfolio giới thiệu bản thân và các dự án.
                        Các dự án: Website Thời Trang, Mobile App UI, Game Application.
                        Kỹ năng: HTML, CSS, JavaScript, Vue.js, Java, Spring Boot, Figma.
                        Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt. Hỗ trợ người dùng tìm hiểu và liên hệ hợp tác.
                        
                        Câu hỏi: ${message}`
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // Thêm tin nhắn của user
    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        
        const messageHTML = `
            <div class="message user-message">
                <div class="message-content">
                    <p>${this.escapeHTML(message)}</p>
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();

        // Lưu vào lịch sử
        this.chatHistory.push({
            type: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });
    }

    // Thêm tin nhắn của bot
    addBotMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        
        const messageHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <img src="images/Gemini_Generated_Image_lqh73wlqh73wlqh7.png" alt="Bot" onerror="this.src='https://ui-avatars.com/api/?name=FB&background=4f46e5&color=fff&size=32'">
                </div>
                <div class="message-content">
                    <p>${message}</p>
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();

        // Lưu vào lịch sử
        this.chatHistory.push({
            type: 'bot',
            message: message,
            timestamp: new Date().toISOString()
        });
    }

    // Hiển thị typing indicator
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingHTML = `
            <div class="message bot-message typing-indicator-container">
                <div class="message-avatar">
                    <img src="images/Gemini_Generated_Image_lqh73wlqh73wlqh7.png" alt="Bot" onerror="this.src='https://ui-avatars.com/api/?name=FB&background=4f46e5&color=fff&size=32'">
                </div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }

    // Ẩn typing indicator
    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator-container');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll xuống cuối
    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Escape HTML để tránh XSS
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Lưu lịch sử chat vào LocalStorage và API
    async saveChatHistory() {
        // Lưu vào LocalStorage
        localStorage.setItem('chatbot_history', JSON.stringify({
            sessionId: this.sessionId,
            userId: this.userId,
            messages: this.chatHistory
        }));

        // Gửi đến API backend nếu có cấu hình
        if (this.config.apiEndpoint) {
            try {
                await fetch(this.config.apiEndpoint + '/chat/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sessionId: this.sessionId,
                        userId: this.userId,
                        messages: this.chatHistory,
                        userInfo: this.getUserInfo()
                    })
                });
            } catch (error) {
                console.error('Error saving chat to API:', error);
            }
        }
    }

    // Load lịch sử chat từ LocalStorage
    loadChatHistory() {
        const saved = localStorage.getItem('chatbot_history');
        if (saved) {
            const data = JSON.parse(saved);
            // Chỉ load nếu cùng session hoặc trong vòng 24h
            const lastMessage = data.messages[data.messages.length - 1];
            if (lastMessage) {
                const lastTime = new Date(lastMessage.timestamp);
                const now = new Date();
                const hoursDiff = (now - lastTime) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    this.chatHistory = data.messages;
                    this.renderHistory();
                }
            }
        }
    }

    // Render lịch sử chat
    renderHistory() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = '';
        
        this.chatHistory.forEach(msg => {
            const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            
            if (msg.type === 'user') {
                const messageHTML = `
                    <div class="message user-message">
                        <div class="message-content">
                            <p>${this.escapeHTML(msg.message)}</p>
                            <span class="message-time">${time}</span>
                        </div>
                    </div>
                `;
                messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
            } else {
                const messageHTML = `
                    <div class="message bot-message">
                        <div class="message-avatar">
                            <img src="images/Gemini_Generated_Image_lqh73wlqh73wlqh7.png" alt="Bot" onerror="this.src='https://ui-avatars.com/api/?name=FB&background=4f46e5&color=fff&size=32'">
                        </div>
                        <div class="message-content">
                            <p>${msg.message}</p>
                            <span class="message-time">${time}</span>
                        </div>
                    </div>
                `;
                messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
            }
        });
        
        this.scrollToBottom();
    }

    // Xóa lịch sử chat
    clearHistory() {
        if (confirm('Bạn có chắc muốn xóa lịch sử chat?')) {
            this.chatHistory = [];
            localStorage.removeItem('chatbot_history');
            document.getElementById('chat-messages').innerHTML = '';
            this.addBotMessage(this.config.welcomeMessage);
        }
    }

    // Lấy thông tin user
    getUserInfo() {
        return {
            userId: this.userId,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer,
            currentPage: window.location.href
        };
    }

    // Track lượt truy cập
    async trackUserVisit() {
        const visitData = {
            userId: this.userId,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            page: window.location.href,
            userInfo: this.getUserInfo()
        };

        // Lưu vào LocalStorage
        let visits = JSON.parse(localStorage.getItem('chatbot_visits') || '[]');
        visits.push(visitData);
        // Giữ lại 100 lượt gần nhất
        if (visits.length > 100) visits = visits.slice(-100);
        localStorage.setItem('chatbot_visits', JSON.stringify(visits));

        // Gửi đến API nếu có
        if (this.config.apiEndpoint) {
            try {
                await fetch(this.config.apiEndpoint + '/tracking/visit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(visitData)
                });
            } catch (error) {
                console.error('Error tracking visit:', error);
            }
        }
    }

    // Tìm kiếm dự án
    searchProjects(query) {
        const lowerQuery = query.toLowerCase();
        return this.projects.filter(project => 
            project.name.toLowerCase().includes(lowerQuery) ||
            project.description.toLowerCase().includes(lowerQuery) ||
            project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    // Lấy thống kê chat (cho admin)
    getChatStats() {
        return {
            totalMessages: this.chatHistory.length,
            userMessages: this.chatHistory.filter(m => m.type === 'user').length,
            botMessages: this.chatHistory.filter(m => m.type === 'bot').length,
            sessionId: this.sessionId,
            userId: this.userId
        };
    }
}

// Khởi tạo ChatBot khi trang load xong
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo với cấu hình
    window.chatBot = new ChatBot({
        botName: 'FUGA26 Assistant',
        
        // API endpoint backend (bỏ comment khi đã chạy backend)
        apiEndpoint: 'http://localhost:3000/api',
        
        // Bỏ comment và thêm API key để sử dụng AI
        // aiProvider: 'openai',
        // aiApiKey: 'YOUR_OPENAI_API_KEY',
        // 
        // Hoặc sử dụng Gemini:
        // aiProvider: 'gemini',
        // aiApiKey: 'YOUR_GEMINI_API_KEY',
    });
});

// Export cho module (nếu cần)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatBot;
}
