<script>
import player from '../lib/player';
  // const albumBucketName = '1.lem.tv';

  // AWS.config.region = 'eu-west-1'; // Region
  // AWS.config.credentials = new AWS.Credentials(localStorage.getItem('aws.accessKeyId'), localStorage.getItem('aws.secretAccessKey'));

  // web components
  // TODO: check this to have two source so sound loading will note create blank between song.

  // const url = await aws.s3.getObjectUrl(s3Key || template.dataset.s3Key);

  let name = "---";
  let singer = "---";
  let audio;
  let paused = true;
  let isFavor = false;
  let time;
  let duration;
  let showControls = true;
  let showControlsTimeout;


  const clickPlayPause = () => {
    // isPlaying = audio.paused;
    if (audio.paused) audio.play();
    else if (!paused) audio.pause();
  };

  const clickNext = () => {
    console.log("TODO: get the following song on the playlist");
    audio.src = "another audio source";
  };

  function timeupdateAudio(e) {
    const { target } = e;
    console.log("timeupdateAudio", this.currentTime, this.duration, this, target);
    shadow.querySelector(".progress").style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  }

  export async function load({ key, url }) {
    if (!audio) return;
    name = key;
    // const source = shadow.querySelector('source');

    audio.src = url;
    audio.load(); // load file
    // auto play TODO: check if music was already playing and continue
    // playing only if it was already the case.
    if (!audio.paused) audio.oncanplay = () => audio.play();
  }

  // load music when play is updated
  player.subscribe(load);

  const format = seconds => {
    if (isNaN(seconds)) return '...';

    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = '0' + seconds;

    return `${minutes}:${seconds}`;
  }

  function handleMousemove(e) {
    if (!(e.buttons & 1)) return; // mouse not down
    if (!duration) return; // video not loaded yet

    const { left, right } = this.getBoundingClientRect();
    time = duration * (e.clientX - left) / (right - left);
  }

  function handleMousedown(e) {
    function handleMouseup() {
      handleMousemove.call(this, e);
      cancel();
    }

    function cancel() {
      e.target.removeEventListener('mouseup', handleMouseup);
    }

    e.target.addEventListener('mouseup', handleMouseup);

    setTimeout(cancel, 200);
  }

</script>

<style>
  @font-face {
    font-family: iconfont;
    src: url("//static0.qianqian.com/web/st/font/iconfont-4e6.woff")
      format("woff");
  }
  .player {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    border-radius: 2px;
  }

  .controls {
    display: flex;
  }

  .player img {
    width: 60px;
    height: 50px;
  }

  .player .info {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    width: 50%;
    padding: 0 16px;
  }

  .player .info .name {
    font-size: 15px;
    font-weight: 700;
  }

  .player .info .singer { font-size: 12px; }

  .player .btns {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
  }

  .player .btns div:nth-child(1) { font-size: 30px; }
  .player .btns div:nth-child(2), .player .btns div:nth-child(3) { font-size: 18px; }

  .player progress {
    width: 100%;
    transition: .2s all ease;
    height: 5px;
    padding-bottom: 5px;
    -webkit-appearance: none;
    appearance: none;
  }
  .player progress::-webkit-progress-bar {
    background-color: rgba(0,0,0,0.2);
  }

  .player progress::-webkit-progress-value {
    background-color: rgba(255,255,255,0.6);
  }

  .player progress:hover {
    height: 10px;
    padding-bottom: 0;
  }

  .iconfont {
    font-family: iconfont !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon-favor:before { content: "\e608"; }
  .icon-next:before { content: "\e60a"; }
  .icon-favor1:before { content: "\e618"; }
  .icon-play:before { content: "\e616"; }
  .icon-stop:before { content: "\e617"; }

  /* unused icon
  .icon-listen:before { content: "\e609"; }
  .icon-loop:before { content: "\e606"; }
  .icon-loop-single:before { content: "\e604"; }
  .icon-search:before { content: "\e60c"; }
  .icon-zhanwei1:before { content: "\e610"; } /* three dot * /
  .icon-random:before { content: "\e619"; }
  .icon-arrow-down:before { content: "\e61d"; }
  .icon-arrow-left:before { content: "\e61e"; }
  .icon-arrow-up:before { content: "\e61f"; }
  .icon-information:before { content: "\e60f"; }
  .icon-information-:before { content: "\e613"; }
  .icon-word:before { content: "\e61c"; }

  .icon-arrow-right:before { content: "\e605"; }
  .icon-prev:before { content: "\e607"; }
  .icon-download:before { content: "\e60b"; }
  .icon-mv:before { content: "\e61b"; }
  .icon-round:before { content: "\e60d"; }
  .icon-triangle:before { content: "\e60e"; }
  .icon-i:before { content: "\e612"; }
  .icon-bubble-filled-icon:before { content: "\e614"; }
  .icon-round-right:before { content: "\e615"; }
  .icon-vip:before { content: "\e61a"; }
  */

</style>

<!-- <audio controls="controls" preload="auto" id="audio_player">
  Your browser does not support the audio format.
</audio> -->
<audio
  bind:this={audio}
  bind:currentTime={time}
  bind:duration
  bind:paused
  preload="auto"
></audio>

<div class="player">
  <progress value="{(time / duration) || 0}"   on:mousemove={handleMousemove} on:mousedown={handleMousedown}/>
  <div class="controls">
    <img src="https://upload.wikimedia.org/wikipedia/en/a/a2/Covert_Coup.jpg" alt="Music cover" />
    <div class="info">
      <div class="name">{name}</div>
      <div class="singer">{singer}</div>
    </div>
    <div class="btns">
      <div class="iconfont" class:icon-play={paused} class:icon-stop={!paused} on:click={clickPlayPause} />
      <div class="iconfont" class:icon-favor1={isFavor} class:icon-favor={!isFavor} on:click={() => { isFavor = !isFavor; }} />
      <div class="iconfont next icon-next" />
    </div>
    {format(time)}
  </div>
</div>
