// web components
// TODO: check this to have two source so sound loading will note create blank between song.
customElements.define('music-player', class MusicPlayer extends HTMLElement {
  /** music player constructor */
  constructor() {
    super();

    const template = document.getElementById('music-player');
    const templateContent = template.content;

    const clone = templateContent.cloneNode(true);
    this.attachShadow({mode: 'open'}).appendChild(clone);

    this.load();
  }

  async load(s3Key) {
    const template = document.getElementById('music-player');

    const url = await getObjectUrl(s3Key || template.dataset.s3Key);

    const shadow = this.shadowRoot;
    const audio = shadow.querySelector('audio');
    // const source = shadow.querySelector('source');

    audio.src = url;
    audio.load(); // load file
    // auto play TODO: check if music was already playing and continue
    // playing only if it was already the case.
    if (!audio.paused) audio.oncanplay = () => audio.play();
  }
});