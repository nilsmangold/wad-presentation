<script>
  let name = "";
</script>

<input bind:value={name} />
<p>
  {#if name}
    Hello, {name}
  {:else}
    Please enter your name!
  {/if}
</p>
