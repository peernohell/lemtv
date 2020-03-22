// import AWS from 'aws-sdk';
import { AwsClient, AwsV4Signer } from './lib/aws4fetch';
import xmlStrToJson from './lib/xml-to-json';

class AwsAccount {
  constructor(accessKeyId, secretAccessKey, region) {
    this.state = 'disconnected';
    this.accounts = [];
    this.AwsV4Signer = AwsV4Signer;

    const config = {
      accessKeyId,
      secretAccessKey,
      region,
      service: 's3',
    };
    this.config = config;
    this.s3 = new AwsClient(config);

    localStorage.setItem('accessKeyId', accessKeyId);
    localStorage.setItem('secretAccessKey', secretAccessKey);
  }

  async getSignedUrl(path, options) {
    const signer = new AwsV4Signer({ url: `http://${this.bucketName}.s3.${this.s3.region}.amazonaws.com/${path}`, ...this.config, signQuery: true });

    const response = await signer.sign();
    return response.url.href;
  }

  test() {
    return this.s3.fetch(`http://${this.bucketName}.s3.amazonaws.com/`, { method: 'HEAD' });
  }

  listObjects({ delimiter }) {
    return this.s3.fetch(`http://${this.bucketName}.s3.${this.s3.region}.amazonaws.com/?delimiter=${delimiter}`).then(res => res.text()).then(text => xmlStrToJson(text).ListBucketResult);
  }

  deleteObject(key) {
    return this.s3.fetch(`http://${this.bucketName}.s3.${this.s3.region}.amazonaws.com/${key}`, { method: 'DELETE' }).then(res => res.text());
  }

  putObject(key, file) {
     return this.s3.fetch(`http://${this.bucketName}.s3.${this.s3.region}.amazonaws.com/${key}`, { method: 'PUT', body: file });
  }

  listObjectsUrl({ Delimiter, Prefix }) { return this.getSignedUrl('listObjects', { Delimiter, Prefix }); }

  getObjectUrl(key) { return this.getSignedUrl(`getObject/${key}`); }
}

export default AwsAccount;
