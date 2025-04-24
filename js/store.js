const Store = {
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },

    // Chat specific methods
    getMessages() {
        const messages = this.getItem('messages') || [];
        // Clean up old voice message URLs to prevent memory leaks
        return messages.map(message => {
            if (message.type === 'voice') {
                URL.revokeObjectURL(message.audioUrl);
            }
            return message;
        });
    },

    saveMessage(message) {
        const messages = this.getMessages();
        messages.push(message);
        
        // Keep only the last 100 messages to prevent localStorage from getting too full
        if (messages.length > 100) {
            const removedMessages = messages.splice(0, messages.length - 100);
            // Clean up old voice message URLs
            removedMessages.forEach(msg => {
                if (msg.type === 'voice') {
                    URL.revokeObjectURL(msg.audioUrl);
                }
            });
        }
        
        this.setItem('messages', messages);
    },

    clearMessages() {
        // Clean up voice message URLs before clearing
        const messages = this.getMessages();
        messages.forEach(message => {
            if (message.type === 'voice') {
                URL.revokeObjectURL(message.audioUrl);
            }
        });
        this.removeItem('messages');
    }
};
