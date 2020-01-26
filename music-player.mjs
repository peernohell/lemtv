// const albumBucketName = '1.lem.tv';

// AWS.config.region = 'eu-west-1'; // Region
// AWS.config.credentials = new AWS.Credentials(localStorage.getItem('aws.accessKeyId'), localStorage.getItem('aws.secretAccessKey'));

// web components
// TODO: check this to have two source so sound loading will note create blank between song.

// const url = await aws.s3.getObjectUrl(s3Key || template.dataset.s3Key);


customElements.define('music-player', class MusicPlayer extends HTMLElement {
  static get observedAttributes() { return ['url']; }

  constructor() {
    super();

    const template = document.getElementById('music-player');
    const templateContent = template.content;

    const clone = templateContent.cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(clone);

    this.load();
  }

  async load(url) {
    const template = document.getElementById('music-player');

    const shadow = this.shadowRoot;
    const audio = shadow.querySelector('audio');
    // const source = shadow.querySelector('source');

    audio.src = url;
    audio.load(); // load file
    // auto play TODO: check if music was already playing and continue
    // playing only if it was already the case.
    if (!audio.paused) audio.oncanplay = () => audio.play();
  }


  attributeChangedCallback(name, oldValue, newValue) {
    console.log('music-player: attributeChangedCallback', name, oldValue, newValue);
    if (oldValue !== newValue) this.load(newValue);
  }
});
