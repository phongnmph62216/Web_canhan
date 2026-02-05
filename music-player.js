// =====================================================
// BACKGROUND MUSIC PLAYER - FUGA26
// =====================================================

(function() {
    'use strict';

    // Tạo HTML cho music player
    const musicPlayerHTML = `
    <!-- Background Music Player -->
    <div class="music-player" id="musicPlayer">
        <audio id="bgMusic" loop>
            <!-- Nhạc nền - Thịnh Suy -->
            <source src="images/(459) Thịnh Suy - 20 Năm Ở Thế Giới - YouTube.mp3" type="audio/mpeg">
        </audio>
        <button class="music-toggle" id="musicToggle" title="Bật/Tắt nhạc nền">
            <i class="fas fa-music" id="musicIcon"></i>
            <div class="music-waves" id="musicWaves">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>
        <div class="volume-slider" id="volumeSlider">
            <i class="fas fa-volume-down"></i>
            <input type="range" id="volumeControl" min="0" max="100" value="30">
            <i class="fas fa-volume-up"></i>
        </div>
    </div>
    `;

    // Tạo CSS cho music player
    const musicPlayerCSS = `
    <style id="musicPlayerStyles">
        /* Music Player Styles */
        .music-player {
            position: fixed;
            bottom: 100px;
            right: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .music-toggle {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .music-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
        }

        .music-toggle i {
            color: white;
            font-size: 1.3rem;
            transition: all 0.3s ease;
        }

        .music-toggle.playing i {
            opacity: 0;
        }

        /* Music Waves Animation */
        .music-waves {
            position: absolute;
            display: flex;
            align-items: flex-end;
            gap: 3px;
            height: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .music-toggle.playing .music-waves {
            opacity: 1;
        }

        .music-waves span {
            width: 4px;
            background: white;
            border-radius: 2px;
            animation: musicWave 0.5s ease-in-out infinite;
        }

        .music-waves span:nth-child(1) {
            height: 8px;
            animation-delay: 0s;
        }

        .music-waves span:nth-child(2) {
            height: 16px;
            animation-delay: 0.1s;
        }

        .music-waves span:nth-child(3) {
            height: 12px;
            animation-delay: 0.2s;
        }

        .music-waves span:nth-child(4) {
            height: 8px;
            animation-delay: 0.3s;
        }

        @keyframes musicWave {
            0%, 100% {
                transform: scaleY(0.5);
            }
            50% {
                transform: scaleY(1);
            }
        }

        /* Volume Slider */
        .volume-slider {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(15, 15, 35, 0.95);
            padding: 8px 15px;
            border-radius: 25px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s ease;
            border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .music-player:hover .volume-slider {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .volume-slider i {
            color: #818cf8;
            font-size: 0.8rem;
        }

        .volume-slider input[type="range"] {
            width: 80px;
            height: 4px;
            border-radius: 2px;
            background: linear-gradient(to right, #667eea 0%, #667eea 30%, #334155 30%, #334155 100%);
            outline: none;
            -webkit-appearance: none;
            cursor: pointer;
        }

        .volume-slider input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(102, 126, 234, 0.5);
        }

        .volume-slider input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(102, 126, 234, 0.5);
        }

        /* Pulse animation when first loaded */
        .music-toggle.pulse {
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% {
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            }
            50% {
                box-shadow: 0 4px 30px rgba(102, 126, 234, 0.8), 0 0 0 10px rgba(102, 126, 234, 0.1);
            }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            .music-player {
                bottom: 80px;
                right: 15px;
            }

            .music-toggle {
                width: 48px;
                height: 48px;
            }

            .volume-slider {
                display: none;
            }
        }

        /* Print - hide music player */
        @media print {
            .music-player {
                display: none !important;
            }
        }
    </style>
    `;

    // Chờ DOM load xong
    document.addEventListener('DOMContentLoaded', function() {
        // Thêm CSS vào head
        document.head.insertAdjacentHTML('beforeend', musicPlayerCSS);
        
        // Thêm HTML vào body
        document.body.insertAdjacentHTML('beforeend', musicPlayerHTML);

        // Khởi tạo music controller
        initMusicController();
    });

    function initMusicController() {
        const bgMusic = document.getElementById('bgMusic');
        const musicToggle = document.getElementById('musicToggle');
        const volumeControl = document.getElementById('volumeControl');
        
        if (!bgMusic || !musicToggle || !volumeControl) return;

        let isPlaying = false;
        
        // Lấy trạng thái từ localStorage (đồng bộ giữa các trang)
        const savedVolume = localStorage.getItem('fuga26_musicVolume') || 30;
        const savedPlaying = localStorage.getItem('fuga26_musicPlaying') === 'true';
        
        // Set initial volume
        bgMusic.volume = savedVolume / 100;
        volumeControl.value = savedVolume;
        updateVolumeSlider(savedVolume);
        
        // Add pulse animation initially
        musicToggle.classList.add('pulse');
        
        // Tự động phát nếu trước đó đang phát (và user đã tương tác)
        if (savedPlaying) {
            // Thử phát nhạc
            playMusic();
        }

        // Toggle music play/pause
        musicToggle.addEventListener('click', function() {
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });
        
        function playMusic() {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                musicToggle.classList.remove('pulse');
                isPlaying = true;
                localStorage.setItem('fuga26_musicPlaying', 'true');
            }).catch(err => {
                console.log('Autoplay blocked - cần click để bật nhạc');
                musicToggle.classList.add('pulse');
            });
        }
        
        function pauseMusic() {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.classList.add('pulse');
            isPlaying = false;
            localStorage.setItem('fuga26_musicPlaying', 'false');
        }
        
        // Volume control
        volumeControl.addEventListener('input', function() {
            const volume = this.value;
            bgMusic.volume = volume / 100;
            updateVolumeSlider(volume);
        });
        
        volumeControl.addEventListener('change', function() {
            localStorage.setItem('fuga26_musicVolume', this.value);
        });
        
        function updateVolumeSlider(value) {
            volumeControl.style.background = `linear-gradient(to right, #667eea 0%, #667eea ${value}%, #334155 ${value}%, #334155 100%)`;
        }
        
        // Sync với các tab khác
        window.addEventListener('storage', function(e) {
            if (e.key === 'fuga26_musicVolume') {
                const newVolume = e.newValue;
                volumeControl.value = newVolume;
                bgMusic.volume = newVolume / 100;
                updateVolumeSlider(newVolume);
            }
        });
    }
})();
