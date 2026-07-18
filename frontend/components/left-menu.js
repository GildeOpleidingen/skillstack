class LeftMenu extends HTMLElement {
        connectedCallback() {
               if (this.childNodes.length) return;

                this.innerHTML = `
                        <h1>SkillStack</h1>
                        <nav>
                                <a href="/journey" data-route="journey"> <i class="fa-duotone fa-solid fa-route"></i> Journey</a>
                                <a href="/practice" data-route="practice"> <i class="fa-solid fa-brain"></i> Practice </a>
                                <a href="/projects" data-route="projects"> <i class="fa-brands fa-product-hunt"></i> Projects </a>
                                <a href="/leaderboard"> <i class="fa-solid fa-trophy"></i> Leaderboard </a>
                                <a href="/challenges"> <i class="fa-brands fa-hackerrank"></i> Challenges </a>
                                <a href="/profile"> <i class="fa-solid fa-image-portrait"></i> Profile </a>
                                <a href="/logout"> <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout </a>
                        </nav>
                `;

                // Add a click event
                this.addEventListener('click', e => {

                        // Check for the data-route
                        const a = e.target.closest('a[data-route]');
                        if (!a) return;

                        // Prevent default
                        e.preventDefault();

                        // Get route
                        const route = a.dataset.route;

                        // Update URL and browser history
                        history.pushState({route}, null, `/${route}`);

                        window.dispatchEvent(new CustomEvent('route-change', {detail: route}));

                })
        }
}

customElements.define('left-menu', LeftMenu);
