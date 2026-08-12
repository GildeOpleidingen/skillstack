class CodeContent extends HTMLElement {
        connectedCallback() {

                // Initial render
                this.render(this.currentRoute());

                // Render on navigation
                window.addEventListener('route-change', (e) =>{
                        this.render(e.detail);
                })

                // Back/forward buttons
                window.addEventListener('popstate', () => {
                        this.render(this.currentRoute());
                });
        }

        // Get current route (without the /)
        // @TODO enhance in future for more complexity
        currentRoute() {
                const path = window.location.pathname;
                return path.replace('/', '') || 'dashboard';
        }

        render(route) {

                // Map with routes (elements..)
                const map = {
                        dashboard: 'page-dashboard',
                        journey: 'page-journey',
                        practice: 'page-practice',
                        projects: 'page-projects',
                }

                const tag = map[route] || 'page-not-found';

                const el = document.createElement(tag);
                this.replaceChildren(el);

        }
}

customElements.define('code-content', CodeContent);