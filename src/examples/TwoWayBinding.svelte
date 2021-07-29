<script>
  let name = "";
</script>

<input bind:value={name} />
<p>
  {#if name}
    Hallo, {name}!
  {:else}
    Bitte gib deinen Namen ein.
  {/if}
</p>
