class CodeContent extends HTMLElement {
        connectedCallback() {
                if (this.childNodes.length) return;

                this.innerHTML = `
                        <h1 style="margin: 0 0 10px;">Learn to Code</h1>
                              <p style="margin: 0; color: var(--muted);">
                                Start with HTML, then build with CSS, then add JavaScript.
                              </p>
                        
                              <div style="margin-top: 16px;">
                                <pre style="
                                  margin: 0;
                                  padding: 14px;
                                  border-radius: 12px;
                                  border: 1px solid var(--border);
                                  background: rgba(255,255,255,0.03);
                                  overflow: auto;
                                "><code>
                        // Tip: replace this content with your lesson renderer
                        console.log("Hello, world!");
                                </code></pre>
                              </div>
                
                `;

        }
}

customElements.define('code-content', CodeContent);