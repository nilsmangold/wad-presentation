<script>
  import { HighlightSvelte } from "svelte-highlight";
  import github from "svelte-highlight/src/styles/github";
  export let code;
</script>

<svelte:head>
  {@html github}
</svelte:head>

<div>
  <HighlightSvelte {code} />
  <slot />
</div>

<style>
  div {
    display: flex;
  }
</style>
