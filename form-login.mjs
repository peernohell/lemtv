import AwsAccount from './aws-account.mjs';


async function onSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const {
    accessKeyId, secretAccessKey, bucketName, region,
  } = form;

  const awsAccount = new AwsAccount(accessKeyId.value, secretAccessKey.value, region.value);
  awsAccount.bucketName = bucketName.value;
  console.log(awsAccount);
  const head = await awsAccount.headBucket({ Bucket: awsAccount.bucketName });
  console.log('head', head);

  const layoutMain = document.querySelector('layout-main');
  const bucketList = layoutMain.shadowRoot.querySelector('bucket-list');
  bucketList.setAwsAccount(awsAccount);
  layoutMain.setAttribute('template', 'main-screen');
}

class FormLogin extends HTMLElement {
  /** login constructor */
  constructor() {
    super();

    const template = document.getElementById('form-login');
    const templateContent = template.content;

    const clone = templateContent.cloneNode(true);

    const form = clone.querySelector('form');
    form.addEventListener('submit', onSubmit.bind(this));

    this.attachShadow({ mode: 'open' }).appendChild(clone);
  }
}

customElements.define('form-login', FormLogin);
