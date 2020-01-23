
// web components
customElements.define('my-paragraph',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('my-paragraph');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(
        templateContent.cloneNode(true)
      );
    }
  }
);

const slottedSpan = document.querySelector('my-paragraph span');

console.log(slottedSpan.assignedSlot);
console.log(slottedSpan.slot);

// TODO: check this to have two source so sound loading will note create blank between song.
customElements.define('music-player',
  class extends HTMLElement {
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
      if (!audio.paused) audio.oncanplay = () => audio.play(); // auto play TODO: check if music was already playing and continue playing only if it was already the case.
    }
  }
);