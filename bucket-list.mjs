import AwsAccount from './aws-account.mjs';

// web components
// TODO: check this to have two source so sound loading will note create blank between song.
function switchToFormLogin() {
  document.querySelector('layout-main').setAttribute('template', 'form-login');
}


customElements.define('bucket-list', class MusicPlayer extends HTMLElement {
  static get observedAttributes() { return ['aws-account']; }

  connecting = false;

  constructor() {
    super();
    console.log('bucket-list constructor');

    const accessKeyId = localStorage.getItem('accessKeyId');
    const secretAccessKey = localStorage.getItem('secretAccessKey');
    const region = localStorage.getItem('region');
    const bucketName = localStorage.getItem('bucketName');

    console.log('bucket-list constructor', accessKeyId, secretAccessKey, region, bucketName);

    this.connectAwsAccount(accessKeyId, secretAccessKey, region, bucketName).finally(this.updateLayout.bind(this));
  }

  connectedCallback() {
    this.updateLayout();
    this.addEventListener('click', this.click2);
    this.addEventListener('click', this.click1);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.click1);
    this.removeEventListener('click', this.click2);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('MusicPlayer: attributeChangedCallback', name, oldValue, newValue);
    if (oldValue !== newValue) this.updateLayout();
  }

  async connectAwsAccount(accessKeyId, secretAccessKey, region, bucketName) {
    this.connecting = true;

    const awsAccount = new AwsAccount(accessKeyId, secretAccessKey, region);
    awsAccount.bucketName = bucketName;
    console.log('bucket-list.connectAwsAccount: awsAccount', awsAccount, bucketName);

    // test connection
    try {
      const head = await awsAccount.headBucket({ Bucket: awsAccount.bucketName });
      console.log('bucket-list.connectAwsAccount: head', head);

      this.awsAccount = awsAccount;
    } catch (err) {
      console.log('bucket-list.connectAwsAccount: head failed!', { err, awsAccount, bucketName, awsBucketName: awsAccount.bucketName });
    } finally {
      this.connecting = false;
    }

    this.setAttribute('aws-account', !!awsAccount);

    localStorage.setItem('accessKeyId', awsAccount.s3.config.accessKeyId);
    localStorage.setItem('secretAccessKey', awsAccount.s3.config.secretAccessKey);
    localStorage.setItem('region', awsAccount.s3.config.region);
    localStorage.setItem('bucketName', awsAccount.bucketName);
  }

  async updateLayout() {
    if (this.connecting) {
      this.innerHTML = `Connecting...`;
      return;
    }

    if (!this.awsAccount) {
      this.innerHTML = '<button class="js-aws-connect">Connect an account</button>';
      this.querySelector('.js-aws-connect').addEventListener('click', switchToFormLogin);
      return;
    }

    if (this.querySelector('.js-aws-connect')) this.querySelector('.js-aws-connect').removeEventListener('click', switchToFormLogin);

    const list = await this.awsAccount.listObjects({ Bucket: this.awsAccount.bucketName, Delimiter: '/' });
    this.innerHTML = `
<ul>
  ${list.Contents.map(object => `<li class="js-s3-object" data-bucket="${this.awsAccount.bucketName}" data-key="${object.Key}">${object.Key} <span class="js-delete" data-bucket="${this.awsAccount.bucketName}" data-key="${object.Key}">X</span></li>`).join('')}
</ul>
<label><input type="file" name='file'></label>
`;

    this.querySelector('input[type=file]').addEventListener('change', this.upload.bind(this));
  }

  async click1(event) {
    console.log('click1', event);
    if (!event.target.classList.contains('js-s3-object')) return;

    const layoutMain = document.querySelector('layout-main');
    const musicPlayer = layoutMain.shadowRoot.querySelector('music-player');

    const { bucket, key } = event.target.dataset;
    const url = await this.awsAccount.getObjectUrl(bucket, key);
    musicPlayer.setAttribute('music', JSON.stringify({ key, url }));
  }

  async click2(event) {
    if (!event.target.classList.contains('js-delete')) return;

    console.log('delete', event);
    const { bucket, key } = event.target.dataset;
    const url = await this.awsAccount.deleteObject({ Bucket: bucket, Key: key });
  }

  async upload({ target }) {
    console.log('upload started');
    const { files } = target;
    if (!files.length) return alert('Please choose a file to upload first.');

    const file = files[0];
    const fileName = file.name;
    // const albumPhotosKey = encodeURIComponent(albumName) + "//";

    // const photoKey = albumPhotosKey + fileName;
    const photoKey = fileName;

    const upload = this.awsAccount.s3.upload({ Bucket: this.awsAccount.bucketName, Key: fileName, Body: file });
    console.log('upload: ', { upload });

    upload.on('httpUploadProgress', ({ lengthComputable, loaded, total, type }) => {
      console.log('upload: httpUploadProgress', { type, lengthComputable, loaded, total });
    });

    const res = await upload.promise();
    target.files = null;
  }
});
