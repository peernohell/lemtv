import { writable } from 'svelte/store';
import AwsAccount from '../aws-account';

function createAwsAccount() {
  const { subscribe, set, update } = writable();

  return {
    subscribe,
    increment() { return update(n => n + 1); },
    decrement() { return update(n => n - 1); },
    reset() { return set(0); },

    async connect(accessKeyId, secretAccessKey, region, bucketName) {
      this.connecting = true;

      const awsAccount = new AwsAccount(accessKeyId, secretAccessKey, region);
      awsAccount.bucketName = bucketName;
      console.log('bucket-list.connectAwsAccount: awsAccount', awsAccount, bucketName);

      // test connection
      try {
        const head = await awsAccount.test();
        console.log('bucket-list.connectAwsAccount: head', head);

        set(awsAccount);
      } catch (err) {
        set(undefined);
        console.log('bucket-list.connectAwsAccount: head failed!', { err, awsAccount, bucketName, awsBucketName: awsAccount.bucketName });
      } finally {
        this.connecting = false;
      }

      localStorage.setItem('accessKeyId', awsAccount.config.accessKeyId);
      localStorage.setItem('secretAccessKey', awsAccount.config.secretAccessKey);
      localStorage.setItem('region', awsAccount.config.region);
      localStorage.setItem('bucketName', awsAccount.bucketName);
    },
  };
}


const awsAccount = createAwsAccount();
export default awsAccount;
