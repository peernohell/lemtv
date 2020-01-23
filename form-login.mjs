
/** login class */
customElements.define('form-login', class extends HTMLElement {
  /** login constructor */
  constructor() {
    super();
    const template = document.getElementById('form-login');
    const templateContent = template.content;

    const clone = templateContent.cloneNode(true);
    this.attachShadow({mode: 'open'}).appendChild(clone);
  }
  /** connect */
  connectedCallback() {
    // connect event on form submit.
  }
});
