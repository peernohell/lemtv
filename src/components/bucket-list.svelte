<script>
  import AwsAccount from "../aws-account.js";
  import player from "../lib/player";

  let awsAccount;

  let connectAwsAccount = async () => {};

  if(process.browser) {
      connectAwsAccount = async (accessKeyId, secretAccessKey, region, bucketName) => {

      const testAwsAccount = new AwsAccount(accessKeyId, secretAccessKey, region);
      testAwsAccount.bucketName = bucketName;
      console.log(
        "bucket-list connectAwsAccount: awsAccount",
        testAwsAccount,
        bucketName
      );

      // test connection
      try {
        const head = await await testAwsAccount.test();
        console.log("bucket-list connectAwsAccount: head", head);
        awsAccount = testAwsAccount;
      } catch (err) {
        console.error("bucket-list connectAwsAccount: head failed!", { err, testAwsAccount, awsAccount, bucketName, awsBucketName: testAwsAccount.bucketName });
        return;
      }

      localStorage.setItem("awsAccount", awsAccount);
      localStorage.setItem("accessKeyId", awsAccount.config.accessKeyId);
      localStorage.setItem("secretAccessKey", awsAccount.config.secretAccessKey);
      localStorage.setItem("region", awsAccount.config.region);
      localStorage.setItem("bucketName", awsAccount.bucketName);


      // get the list
      const list = await awsAccount.listObjects({ delimiter: "/" });
      console.log('list', { Contents: list.Contents, list });
      return list;
    };
  }
  

  console.log("bucket-list starting");

  let accessKeyId = localStorage.getItem("accessKeyId");
  let secretAccessKey = localStorage.getItem("secretAccessKey");
  let region = localStorage.getItem("region");
  let bucketName = localStorage.getItem("bucketName");

  console.log( "bucket-list awsAccount localStorage data", accessKeyId, secretAccessKey, region, bucketName );
  const connecting = connectAwsAccount(accessKeyId, secretAccessKey, region, bucketName).finally(() => {
    console.log("bucket-list connectAwsAccount finally");
  });

  async function play(event, content) {
    const url = await awsAccount.getSignedUrl(content.Key);
    player.set({ key: content.Key, url });
  }

  async function upload({ target }) {
    window.target = target;
    const [file] = target.files;
    awsAccount.putObject(file.name, file);
  }

</script>
<style>

  .iconfont {
    font-family: iconfont !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .icon-list:before {
    content: "\e603";
  }
</style>
{#await connecting}
  Conneting ...
{:then list}
  {#if list}
    <h1><span class="iconfont icon-list" /> Bucket {list.Name}</h1>
    <ul>
      {#each list.Contents as content (content.Key)}
        <li class="js-s3-object" data-bucket={awsAccount.bucketName} data-key="${content.Key}" on:click={event => play(event, content)}>
          ${content.Key}
          <span on:click={() => awsAccount.deleteObject(content.Key)}> X </span>
        </li>
      {/each}
    </ul>
    <label><input type="file" name="file" on:change={upload}/></label>
  {:else}
    <a href="/aws-accounts/form-login">Connect an account</a>
  {/if}
{/await}
