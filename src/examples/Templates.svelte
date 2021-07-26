<script>
  let value = 0;

  function increment() {
    value++;
  }
  function reset() {
    value = 0;
  }
</script>

<progress {value} max="5">{value}</progress>
<div>
  <button disabled={value >= 5} on:click={increment}>Work</button>
  {#if value == 0}
    Start clicking!
  {:else if value < 5}
    Keep clicking...
  {:else}
    Done!
    <button on:click={reset}>reset</button>
  {/if}
</div>
