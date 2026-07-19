class pageDashboard extends HTMLElement {
        connectedCallback() {
                this.innerHTML = `Dashboard`;
        }
}

customElements.define('page-dashboard', pageDashboard);