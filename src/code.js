export const counterCode = `<script>
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


<div>
  <button on:click={() => count++}>I was clicked {count} times</button>
</div>`

export const templatesCode = `
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
`

export const twowaybinding = `
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
`

export const motion = `
<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  const value = tweened(0, { duration: 400, easing: cubicOut });
</script>

<progress value={$value} max="5">{value}</progress>
<p>{$value}</p>
<div>
  <button disabled={$value >= 5} on:click={() => value.set($value + 1)}
    >Work</button
  >
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
`

export const components = `
// outer component
<script>
  import ComponentsInner from "./ComponentsInner.svelte";

  let notes = [
    { text: "foo", starred: false },
    { text: "bar", starred: true },
    { text: "baz", starred: false },
  ];
</script>

<div>
  {#each notes as {text, starred }}
    <ComponentsInner {text} bind:starred />
  {/each}
</div>


// inner component 
<script>
  export let text;
  export let starred;

</script>

<div class="note">
  <button on:click={() => starred = !starred}>{#if starred}🌟{:else}⭐{/if}</button>
  <p>{text}</p>
</div>

<style>
  .note {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    width: 500px;
  }
</style>
`
