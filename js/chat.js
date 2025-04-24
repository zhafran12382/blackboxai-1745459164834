const Chat = {
    mediaRecorder: null,
    audioChunks: [],
    isRecording: false,
    recordingTimer: null,
    recordingStartTime: null,
    MAX_FILE_SIZE: 25 * 1024 * 1024, // 25MB for video/audio
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB for images
    MAX_AUDIO_DURATION: 300, // 5 minutes in seconds

    init() {
        if (!Auth.isAuthenticated()) {
            Router.navigate('login');
            return;
        }

        this.bindEvents();
        this.loadMessages();
        this.setupAutoScroll();
        this.showWelcomeMessage();
        this.setupVoiceRecording();
    },

    bindEvents() {
        // Message form submission
        const messageForm = document.getElementById('messageForm');
        if (messageForm) {
            messageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleMessageSubmit(e.target);
            });
        }

        // Image upload
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageSelect(e));
        }

        // Voice recording
        const voiceButton = document.getElementById('voiceButton');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => {
                if (!this.isRecording) {
                    this.startRecording();
                } else {
                    this.stopRecording();
                }
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => Auth.logout());
        }

        // Handle Enter key for message sending
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    messageForm.dispatchEvent(new Event('submit'));
                }
            });
        }
    },

    handleMessageSubmit(form) {
        const messageInput = form.message;
        const message = messageInput.value.trim();
        const filePreview = document.getElementById('filePreview');
        
        if (!message && !filePreview.querySelector('img, video, audio') && !this.isRecording) return;

        const username = Auth.getCurrentUser();
        if (!username) {
            Auth.logout();
            return;
        }

        const newMessage = {
            id: Date.now(),
            sender: username,
            content: message,
            timestamp: new Date().toISOString(),
            type: 'text'
        };

        // Handle file attachments
        const previewImg = document.getElementById('previewImg');
        const previewVideo = document.getElementById('previewVideo');
        const previewAudio = document.getElementById('previewAudio');

        if (previewImg && previewImg.src) {
            newMessage.type = 'image';
            newMessage.fileUrl = previewImg.src;
        } else if (previewVideo && previewVideo.src) {
            newMessage.type = 'video';
            newMessage.fileUrl = previewVideo.src;
        } else if (previewAudio && previewAudio.src) {
            newMessage.type = 'audio';
            newMessage.fileUrl = previewAudio.src;
        }

        Store.saveMessage(newMessage);
        this.appendMessage(newMessage);
        
        // Clear input and preview
        messageInput.value = '';
        this.clearPreview();
        messageInput.focus();
        
        // Scroll to bottom
        this.scrollToBottom();
    },

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const previewContainer = document.getElementById('previewContainer');
        const filePreview = document.getElementById('filePreview');
        const imagePreview = document.getElementById('imagePreview');
        const videoPreview = document.getElementById('videoPreview');
        const audioPreview = document.getElementById('audioPreview');

        // Hide all previews initially
        imagePreview.classList.add('hidden');
        videoPreview.classList.add('hidden');
        audioPreview.classList.add('hidden');

        // Check file type and size
        if (file.type.startsWith('image/')) {
            if (file.size > this.MAX_IMAGE_SIZE) {
                alert('Ukuran gambar terlalu besar. Maksimal 5MB.');
                return;
            }
            this.handleImageFile(file, previewContainer, filePreview, imagePreview);
        } 
        else if (file.type.startsWith('video/')) {
            if (file.size > this.MAX_FILE_SIZE) {
                alert('Ukuran video terlalu besar. Maksimal 25MB.');
                return;
            }
            this.handleVideoFile(file, previewContainer, filePreview, videoPreview);
        } 
        else if (file.type.startsWith('audio/')) {
            if (file.size > this.MAX_FILE_SIZE) {
                alert('Ukuran audio terlalu besar. Maksimal 25MB.');
                return;
            }
            this.handleAudioFile(file, previewContainer, filePreview, audioPreview);
        } 
        else {
            alert('Format file tidak didukung. Mohon pilih file gambar, video, atau audio.');
            return;
        }
    },

    handleImageFile(file, previewContainer, filePreview, imagePreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById('previewImg');
            previewImg.src = e.target.result;
            
            previewContainer.classList.remove('hidden');
            filePreview.classList.remove('hidden');
            imagePreview.classList.remove('hidden');

            // Compress image if needed
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxDim = 1200;
                let width = img.width;
                let height = img.height;

                if (width > height && width > maxDim) {
                    height *= maxDim / width;
                    width = maxDim;
                } else if (height > maxDim) {
                    width *= maxDim / height;
                    height = maxDim;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to JPEG with 0.8 quality
                previewImg.src = canvas.toDataURL('image/jpeg', 0.8);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    handleVideoFile(file, previewContainer, filePreview, videoPreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewVideo = document.getElementById('previewVideo');
            previewVideo.src = e.target.result;
            
            previewContainer.classList.remove('hidden');
            filePreview.classList.remove('hidden');
            videoPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    },

    handleAudioFile(file, previewContainer, filePreview, audioPreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewAudio = document.getElementById('previewAudio');
            previewAudio.src = e.target.result;
            
            previewContainer.classList.remove('hidden');
            filePreview.classList.remove('hidden');
            audioPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    },

    clearPreview() {
        const previewContainer = document.getElementById('previewContainer');
        const filePreview = document.getElementById('filePreview');
        const imagePreview = document.getElementById('imagePreview');
        const videoPreview = document.getElementById('videoPreview');
        const audioPreview = document.getElementById('audioPreview');
        const fileInput = document.getElementById('fileInput');
        const voicePreview = document.getElementById('voicePreview');

        // Clear sources
        const previewImg = document.getElementById('previewImg');
        const previewVideo = document.getElementById('previewVideo');
        const previewAudio = document.getElementById('previewAudio');
        
        if (previewImg) previewImg.src = '';
        if (previewVideo) previewVideo.src = '';
        if (previewAudio) previewAudio.src = '';
        
        // Hide containers
        if (previewContainer) previewContainer.classList.add('hidden');
        if (filePreview) filePreview.classList.add('hidden');
        if (imagePreview) imagePreview.classList.add('hidden');
        if (videoPreview) videoPreview.classList.add('hidden');
        if (audioPreview) audioPreview.classList.add('hidden');
        if (voicePreview) voicePreview.classList.add('hidden');
        
        // Clear input
        if (fileInput) fileInput.value = '';
    },

    async setupVoiceRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                this.sendVoiceMessage(audioUrl);
                this.audioChunks = [];
            };

            const voiceButton = document.getElementById('voiceButton');
            if (voiceButton) {
                voiceButton.title = 'Tekan untuk merekam';
            }
        } catch (error) {
            console.error('Error accessing microphone:', error);
            const voiceButton = document.getElementById('voiceButton');
            if (voiceButton) {
                voiceButton.disabled = true;
                voiceButton.classList.add('opacity-50');
                voiceButton.title = 'Mikrofon tidak tersedia';
            }
        }
    },

    startRecording() {
        if (!this.mediaRecorder) return;

        this.isRecording = true;
        this.audioChunks = [];
        this.mediaRecorder.start();
        this.recordingStartTime = Date.now();

        const voiceButton = document.getElementById('voiceButton');
        const voicePreview = document.getElementById('voicePreview');
        const previewContainer = document.getElementById('previewContainer');

        voiceButton.classList.add('text-red-500');
        voiceButton.title = 'Tekan untuk berhenti';
        previewContainer.classList.remove('hidden');
        voicePreview.classList.remove('hidden');

        // Start recording timer
        this.updateRecordingTime();

        // Set maximum recording duration
        setTimeout(() => {
            if (this.isRecording) {
                this.stopRecording();
            }
        }, this.MAX_AUDIO_DURATION * 1000);
    },

    stopRecording() {
        if (!this.mediaRecorder || !this.isRecording) return;

        this.isRecording = false;
        this.mediaRecorder.stop();
        clearInterval(this.recordingTimer);

        const voiceButton = document.getElementById('voiceButton');
        voiceButton.classList.remove('text-red-500');
        voiceButton.title = 'Tekan untuk merekam';
    },

    updateRecordingTime() {
        const recordingTimeElement = document.getElementById('recordingTime');
        this.recordingTimer = setInterval(() => {
            const duration = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
            const seconds = (duration % 60).toString().padStart(2, '0');
            recordingTimeElement.textContent = `${minutes}:${seconds}`;

            // Stop recording if max duration is reached
            if (duration >= this.MAX_AUDIO_DURATION) {
                this.stopRecording();
            }
        }, 1000);
    },

    sendVoiceMessage(audioUrl) {
        const username = Auth.getCurrentUser();
        if (!username) return;

        const newMessage = {
            id: Date.now(),
            sender: username,
            timestamp: new Date().toISOString(),
            type: 'voice',
            audioUrl: audioUrl
        };

        Store.saveMessage(newMessage);
        this.appendMessage(newMessage);
        this.scrollToBottom();
    },

    loadMessages() {
        const messages = Store.getMessages();
        const chatContainer = document.getElementById('chatMessages');
        if (!chatContainer) return;

        chatContainer.innerHTML = ''; // Clear existing messages
        messages.forEach(message => this.appendMessage(message));
        this.scrollToBottom();
    },

    appendMessage(message) {
        const chatContainer = document.getElementById('chatMessages');
        if (!chatContainer) return;

        const currentUser = Auth.getCurrentUser();
        const isSentByMe = message.sender === currentUser;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message-wrapper ${isSentByMe ? 'flex justify-end' : 'flex justify-start'} mb-4 fade-in`;
        
        const formattedTime = this.formatTimestamp(message.timestamp);
        
        let messageContent = '';
        switch (message.type) {
            case 'image':
                messageContent = `
                    <div class="relative group">
                        <img src="${message.fileUrl}" class="max-w-sm rounded-lg cursor-pointer" alt="Shared image" onclick="window.open(this.src)">
                        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition-opacity rounded-lg"></div>
                    </div>`;
                break;
            case 'video':
                messageContent = `
                    <div class="relative group">
                        <video src="${message.fileUrl}" class="max-w-sm rounded-lg" controls></video>
                        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition-opacity rounded-lg"></div>
                    </div>`;
                break;
            case 'audio':
                messageContent = `
                    <div class="flex items-center space-x-2">
                        <audio controls class="max-w-[200px]">
                            <source src="${message.fileUrl}" type="audio/mpeg">
                            Browser Anda tidak mendukung pemutaran audio.
                        </audio>
                    </div>`;
                break;
            case 'voice':
                messageContent = `
                    <div class="flex items-center space-x-2">
                        <audio controls class="max-w-[200px]">
                            <source src="${message.audioUrl}" type="audio/wav">
                            Browser Anda tidak mendukung pemutaran audio.
                        </audio>
                    </div>`;
                break;
            default:
                messageContent = `<div class="message-content break-words">${this.escapeHtml(message.content)}</div>`;
        }

        messageElement.innerHTML = `
            <div class="chat-bubble ${isSentByMe ? 'chat-bubble-sent' : 'chat-bubble-received'} shadow-sm">
                ${!isSentByMe ? `<div class="text-xs text-gray-600 mb-1">${this.escapeHtml(message.sender)}</div>` : ''}
                ${messageContent}
                <div class="text-xs ${isSentByMe ? 'text-white/80' : 'text-gray-500'} mt-1">
                    ${formattedTime}
                </div>
            </div>
        `;

        chatContainer.appendChild(messageElement);
    },

    showWelcomeMessage() {
        const username = Auth.getCurrentUser();
        if (!username) return;

        const systemMessage = {
            id: Date.now(),
            sender: 'system',
            content: `${username} bergabung dalam chat`,
            timestamp: new Date().toISOString(),
            type: 'system'
        };

        const chatContainer = document.getElementById('chatMessages');
        if (!chatContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'flex justify-center mb-4 fade-in';
        messageElement.innerHTML = `
            <div class="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm">
                ${this.escapeHtml(systemMessage.content)}
            </div>
        `;

        chatContainer.appendChild(messageElement);
        this.scrollToBottom();
    },

    setupAutoScroll() {
        const chatContainer = document.getElementById('chatMessages');
        if (!chatContainer) return;

        const observer = new MutationObserver(() => {
            this.scrollToBottom();
        });

        observer.observe(chatContainer, {
            childList: true,
            subtree: true
        });
    },

    scrollToBottom() {
        const chatContainer = document.getElementById('chatMessages');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    },

    formatTimestamp(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting timestamp:', error);
            return '';
        }
    },

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '&#039;');
    }
};
