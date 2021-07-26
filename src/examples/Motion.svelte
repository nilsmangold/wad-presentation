<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  const value = tweened(0, { duration: 400, easing: cubicOut });
</script>

<progress value={$value} max="5">{value}</progress>
<p>{$value}</p>
<div>
  <button disabled={$value >= 5} on:click={() => value.set($value + 1)}>Work</button>
  {#if $value == 0}
    Start clicking!
  {:else if $value < 5}
    Keep clicking...
  {:else}
    Done!
  {/if}
  {#if $value >= 5}
    <button transition:fade on:click={() => value.set(0)}>reset</button>
  {/if}
</div>
