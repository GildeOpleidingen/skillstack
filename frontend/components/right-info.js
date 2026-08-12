class RightInfo extends HTMLElement {
        connectedCallback() {
                if(this.childNodes.length) return;

                this.innerHTML = `
                        <div class="info-card">
                        <h2 style="margin: 0 0 8px;">Notes</h2>
                        <p>Keep your lessons small and practice often.</p>
                      </div>
                `;

        }
}

customElements.define('right-info', RightInfo);