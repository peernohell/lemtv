
import './form-login.mjs';
import './music-player.mjs';

/** layout class */
customElements.define('layout-main', class extends HTMLElement {

  static get observedAttributes() { return ['template']; }

  /** layout constructor */
  set template(template) {
    this.updateLayout(template);
  }

  constructor() {
    super();

    const template = document.getElementById('layout-main');
    const templateContent = template.content;

    const clone = templateContent.cloneNode(true);

    this.attachShadow({ mode: 'open' }).appendChild(clone);
  }

  updateLayout(template) {
    const main = this.shadowRoot.querySelector('#main');
    // debugger;
    Array.from(main.children).forEach((el) => {
      console.log('updateLayout', el, el.localName, template);
      el.style.display = (template === el.localName) ? '' : 'none';
    });
  }

  connectedCallback() {
    const template = this.getAttribute('template');
    console.log('connectedCallback', template);
    if (!template) this.setAttribute('template', 'h1');

    const accessKeyId = localStorage.getItem('aws.accessKeyId');
    const secretAccessKey = localStorage.getItem('aws.secretAccessKey');

    if (accessKeyId && secretAccessKey) {
      // TODO: test them.
      console.log('connectedCallback set template to music');
      this.setAttribute('template', 'music-player');
    } else {
      console.log('connectedCallback set template to form', template);
      this.setAttribute('template', 'form-login');
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name, oldValue, newValue);
    if (oldValue !== newValue) this.updateLayout(newValue);
  }
});
