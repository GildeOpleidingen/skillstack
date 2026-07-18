class CodeContent extends HTMLElement {
        connectedCallback() {
                //if (this.childNodes.length) return;

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

        currentRoute() {
                const path = window.location.pathname;
                return path.replace('/', '') || 'journey';
        }

        render(route) {

                this.innetHTML = ``;

                const map = {
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