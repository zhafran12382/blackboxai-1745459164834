// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize router
    Router.init();

    // Check if user is authenticated
    const auth = Store.getItem('auth');
    if (auth?.isLoggedIn) {
        // Update user display
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = auth.username;
        }

        // Show welcome message
        const welcomeTemplate = document.getElementById('welcomeMessage');
        if (welcomeTemplate) {
            const welcomeMessage = welcomeTemplate.content.cloneNode(true);
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.appendChild(welcomeMessage);
            }
        }

        // Show system message that user has joined
        const systemTemplate = document.getElementById('systemMessage');
        if (systemTemplate) {
            const systemMessage = systemTemplate.content.cloneNode(true);
            const messageDiv = systemMessage.querySelector('div > div');
            if (messageDiv) {
                messageDiv.textContent = `${auth.username} bergabung dalam chat`;
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    chatMessages.appendChild(systemMessage);
                }
            }
        }
    }

    // Handle errors
    window.addEventListener('error', (event) => {
        console.error('Application error:', event.error);
        // You could show a user-friendly error message here
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        // You could show a user-friendly error message here
    });
});

// Optional: Add some helper functions
const Helpers = {
    formatDate(date) {
        return new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },

    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    scrollToBottom(element) {
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }
};
