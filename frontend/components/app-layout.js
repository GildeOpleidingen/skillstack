class AppLayout extends HTMLElement {
        constructor() {
                super();
        }

        connectedCallback() {
                if(!this.hasChildNodes()) {
                        this.innerHTML = `
                                <left-menu></left-menu>
                                <code-contnet></code-contnet>
                                <right-info></right-info>`;
                }
        }
}

customElements.define('app-layout', AppLayout);