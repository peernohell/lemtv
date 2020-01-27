// web components
// TODO: check this to have two source so sound loading will note create blank between song.
function switchToFormLogin() {
  document.querySelector('layout-main').setAttribute('template', 'form-login');
}


customElements.define('bucket-list', class MusicPlayer extends HTMLElement {
  static get observedAttributes() { return ['aws-account']; }

  constructor() {
    super();
    console.log('bucket-list constructor');
  }

  connectedCallback() {
    this.updateLayout();
    this.addEventListener('click', this.click);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.click);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('MusicPlayer: attributeChangedCallback', name, oldValue, newValue);
    if (oldValue !== newValue) this.updateLayout();
  }

  setAwsAccount(awsAccount) {
    this.awsAccount = awsAccount;
    this.setAttribute('aws-account', !!awsAccount);
  }

  async updateLayout() {
    if (!this.awsAccount) {
      this.innerHTML = '<button class="js-aws-connect">Connect an account</button>';
      this.querySelector('.js-aws-connect').addEventListener('click', switchToFormLogin);
      return;
    }

    if (this.querySelector('.js-aws-connect')) this.querySelector('.js-aws-connect').removeEventListener('click', switchToFormLogin);

    const list = await this.awsAccount.listObjects({ Bucket: this.awsAccount.bucketName, Delimiter: '/' });
    this.innerHTML = `<ul>${list.Contents.map((object) => {
      console.log('connectedCallback', object);
      return `<li class="js-s3-object" data-bucket="${this.awsAccount.bucketName}" data-key="${object.Key}">Object: ${object.Key}</li>`;
    })}</ul>`;
  }

  async click(event) {
    console.log(event);
    if (!event.target.classList.contains('js-s3-object')) return;

    const layoutMain = document.querySelector('layout-main');
    const musicPlayer = layoutMain.shadowRoot.querySelector('music-player');

    const { bucket, key } = event.target.dataset;
    const url = await this.awsAccount.getObjectUrl(bucket, key);
    musicPlayer.setAttribute('url', url);
  }
});
