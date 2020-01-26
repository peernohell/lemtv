
const callbackToPromise = (fn) => (...args) => new Promise((resolve, reject) => {
  fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
});

class AwsAccount extends EventTarget {
  state = 'disconnected';
  accounts = [];

  constructor(accessKeyId, secretAccessKey, region) {
    super();

    console.log('AwsAccount', accessKeyId, secretAccessKey, region);

    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      accessKeyId,
      secretAccessKey,
      region,
    });

    ['getSignedUrl', 'listObjects'].forEach((property) => {
      this[property] = callbackToPromise(this.s3[property].bind(this.s3));
    });

    localStorage.setItem('accessKeyId', accessKeyId);
    localStorage.setItem('secretAccessKey', secretAccessKey);
  }

  listObjectsUrl({ Delimiter, Prefix }) { return this.getSignedUrl('listObjects', { Delimiter, Prefix }); }

  getObjectUrl(bucket, key) { return this.getSignedUrl('getObject', { Bucket: bucket, Key: key }); }

}

export default AwsAccount;
