const Router = {
    async loadView(viewName) {
        try {
            const response = await fetch(`views/${viewName}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            document.getElementById('app').innerHTML = content;
            
            // Initialize view-specific JavaScript
            if (viewName === 'login') {
                Auth.init();
            } else if (viewName === 'chat') {
                Chat.init();
            }
        } catch (error) {
            console.error('Error loading view:', error);
            document.getElementById('app').innerHTML = `
                <div class="flex items-center justify-center h-screen">
                    <div class="text-red-500">Error loading view. Please try again later.</div>
                </div>
            `;
        }
    },

    init() {
        // Create views directory if it doesn't exist
        const isAuthenticated = Store.getItem('auth')?.isLoggedIn;
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const view = isAuthenticated ? 'chat' : 'login';
            this.loadView(view);
        });

        // Initial view load
        this.loadView(isAuthenticated ? 'chat' : 'login');
    },

    navigate(viewName) {
        history.pushState(null, '', `#${viewName}`);
        this.loadView(viewName);
    }
};

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
});
