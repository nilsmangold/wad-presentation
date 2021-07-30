<script>
  let value = 0;

  function increment() {
    value++;
  }
  function reset() {
    value = 0;
  }
</script>

<progress style="display: block;" {value} max="5">{value}</progress>
<div style="display: block;">
  <button style="display: block;" disabled={value >= 5} on:click={increment}>Klick</button>
  {#if value == 0}
    Fang an zu klicken!
  {:else if value < 5}
    Weiter so...
  {:else}
    Fertig!
    <button on:click={reset}>Zurücksetzen</button>
  {/if}
</div>

<style>
  
</style>