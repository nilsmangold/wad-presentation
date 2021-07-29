<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  const value = tweened(0, { duration: 400, easing: cubicOut });
</script>

<progress value={$value} max="5"></progress>
<p>{$value}</p>
<div>
  <button disabled={$value >= 5} on:click={() => value.set($value + 1)}>Klick</button>
  {#if $value == 0}
    Fang an zu klicken!
  {:else if $value < 5}
    Weiter so...
  {:else}
    Fertig!
  {/if}
  {#if $value >= 5}
    <button transition:fade on:click={() => value.set(0)}>Zurücksetzen</button>
  {/if}
</div>
