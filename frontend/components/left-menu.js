class LeftMenu extends HTMLElement {
        connectedCallback() {
               if (this.childNodes.length) return;

                this.innerHTML = `
                        <h1>SkillStack</h1>
                        <nav>
                                <a href="#"> <i class="fa-duotone fa-solid fa-route"></i> Journey</a>
                                <a href="#"> <i class="fa-solid fa-brain"></i> Practice </a>
                                <a href="#"> <i class="fa-brands fa-product-hunt"></i> Projects </a>
                                <a href="#"> <i class="fa-solid fa-trophy"></i> Leaderboard </a>
                                <a href="#"> <i class="fa-brands fa-hackerrank"></i> Challenges </a>
                                <a href="#"> <i class="fa-solid fa-image-portrait"></i> Profile </a>
                                <a href="#"> <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout </a>
                        </nav>
                `;
        }
}

customElements.define('left-menu', LeftMenu);