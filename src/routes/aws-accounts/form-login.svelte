<script>
  import awsAccount from "../../stores/aws-accounts";

  function handleSubmit(event) {
    const { form } = event.target;
    const { accessKeyId, secretAccessKey, bucketName, region } = form;

    console.log('on submit', { accessKeyId: accessKeyId.value, secretAccessKey: secretAccessKey.value, region: region.value, bucketName: bucketName.value });

    awsAccount.connect(
      accessKeyId.value,
      secretAccessKey.value,
      region.value,
      bucketName.value
    );

    // window.history.back();
    event.preventDefault();
    return false;
  }
</script>

<h2>Login</h2>
<form on:submit|preventDefault={handleSubmit}>
  <input type="text" placeholder="Access key id" name="accessKeyId" />
  <input type="text" placeholder="Secret access key" name="secretAccessKey" />
  <input type="text" placeholder="Regin" name="region" />
  <input type="text" placeholder="Bucket name" name="bucketName" />
  <button type="submit" on:click|preventDefault={handleSubmit}>Connect</button>
</form>
