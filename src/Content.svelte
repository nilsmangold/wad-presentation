<script>
  export let long;
</script>

{#if long}
  <slot name="long" />
{:else}
  <slot name="short" />
{/if}
