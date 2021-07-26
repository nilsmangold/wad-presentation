<script>
  export let text;
  export let starred;

  export let remove;
</script>

<div class="note">
  <button on:click={() => (starred = !starred)}
    >{#if starred}🌟{:else}⭐{/if}</button
  >
  <button on:click={remove}>X</button>
  <p>{text}</p>
</div>

<style>
  .note {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    width: 500px;
  }
</style>
