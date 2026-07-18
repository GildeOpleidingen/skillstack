class pageJourney extends HTMLElement {
        connectedCallback() {
                this.innerHTML = `
                      <h1>Journey</h1>
                      <p>Main journey content goes here...</p>
                    `;
        }
}

customElements.define('page-journey', pageJourney);

