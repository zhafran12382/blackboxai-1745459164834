const Auth = {
    CORRECT_PASSWORD: 'Ratubagus',

    init() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        // Add input validation listeners
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (usernameInput && passwordInput) {
            [usernameInput, passwordInput].forEach(input => {
                input.addEventListener('input', () => {
                    this.validateInput(input);
                });
            });
        }
    },

    validateInput(input) {
        const errorElement = document.getElementById(`${input.id}Error`);
        if (!errorElement) return;

        if (!input.value.trim()) {
            errorElement.textContent = `${input.placeholder} tidak boleh kosong`;
            errorElement.classList.remove('hidden');
            return false;
        }

        errorElement.classList.add('hidden');
        return true;
    },

    handleLogin(form) {
        const username = form.username.value.trim();
        const password = form.password.value.trim();
        const errorElement = document.getElementById('loginError');

        // Validate inputs
        if (!username || !password) {
            this.showError(errorElement, 'Username dan password harus diisi');
            return;
        }

        // Check password
        if (password !== this.CORRECT_PASSWORD) {
            this.showError(errorElement, 'Password salah');
            form.password.value = ''; // Clear password field
            return;
        }

        // Save auth state
        Store.setItem('auth', {
            username,
            isLoggedIn: true,
            timestamp: Date.now()
        });

        // Show success message before redirecting
        const successElement = document.getElementById('loginSuccess');
        if (successElement) {
            successElement.classList.remove('hidden');
            successElement.textContent = 'Login berhasil! Mengalihkan...';
        }

        // Redirect to chat after a brief delay
        setTimeout(() => {
            Router.navigate('chat');
        }, 1000);
    },

    showError(element, message) {
        if (!element) return;
        
        element.textContent = message;
        element.classList.remove('hidden');
        element.classList.add('fade-in');

        // Hide error after 3 seconds
        setTimeout(() => {
            element.classList.add('hidden');
        }, 3000);
    },

    logout() {
        // Clear auth state
        Store.removeItem('auth');
        
        // Clear messages (optional - uncomment if you want to clear messages on logout)
        // Store.clearMessages();
        
        // Redirect to login
        Router.navigate('login');
    },

    // Helper method to check if user is authenticated
    isAuthenticated() {
        const auth = Store.getItem('auth');
        return auth?.isLoggedIn === true;
    },

    // Get current user's username
    getCurrentUser() {
        const auth = Store.getItem('auth');
        return auth?.username || null;
    }
};
