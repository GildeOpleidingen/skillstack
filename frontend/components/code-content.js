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

                const pages = {
                        journey: {title: 'Journey', body: 'Your journey starts here...'},
                        practice: {title: 'Practice', body: 'Practice questions and drills...'},
                        projects: {title: 'Projects', body: 'Build real projects step-by-step...'},
                }
                const page = pages[route] ?? { title: 'Not found', body: 'This page does not exist.'};

                this.innerHTML = `
                       <h1>${page.title}</h1>
                       <p>${page.body}</p>
                `;
        }
}

customElements.define('code-content', CodeContent);