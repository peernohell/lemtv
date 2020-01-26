
import './form-login.mjs';
import './music-player.mjs';
import './bucket-list.mjs';

/** layout class */
customElements.define('layout-main', class extends HTMLElement {
  static get observedAttributes() { return ['template']; }

  /** layout constructor */
  set template(template) {
    this.setAttribute('template', template);
  }

  constructor() {
    super();

    const template = document.getElementById('layout-main');
    const templateContent = template.content;

    const clone = templateContent.cloneNode(true);

    clone.querySelector('.js-aws-connect');

    this.attachShadow({ mode: 'open' }).appendChild(clone);
  }

  updateLayout(template) {
    const main = this.shadowRoot.querySelector('#main');
    Array.from(main.children).forEach((el) => {
      el.style.display = (template === el.id) ? '' : 'none';
    });
  }

  connectedCallback() {
    const template = this.getAttribute('template');
    console.log('connectedCallback', template);
    if (!template) this.template = 'main-screen';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name, oldValue, newValue);
    if (oldValue !== newValue) this.updateLayout(newValue);
  }
});
