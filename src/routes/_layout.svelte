<script>
  import Nav from "../components/nav.svelte";
  import MusicPlayer from "../components/music-player.svelte";

  export let segment;
</script>

<style>
  main {
    flex: 1;
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  :global(body) {
    display: flex;
    width: 100%;
    height: 100vh;
  }

  :global(#sapper) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
  }

  :global(*) {
    box-sizing: content-box;
  }
</style>

<Nav {segment} />

<main>
  <slot />
</main>
<MusicPlayer />
