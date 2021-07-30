<script>
  import { HighlightSvelte } from "svelte-highlight";
  import github from "svelte-highlight/src/styles/github";
  export let code;
</script>

<svelte:head>
  {@html github}
</svelte:head>

<div class="code">
  <HighlightSvelte {code} />
  <div>
    <slot />
  </div>
</div>

<style>
  div.code{
    display: flex;
  }
</style>
