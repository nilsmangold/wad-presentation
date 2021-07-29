export const structureCode = `
<script>
  console.log("Hello, world!")
</script>

<div>
  <h2>Hier kommt HTML-code hin</h2>
</div>

<style>
  h2 {
    color: green;
  }
</style>
`
export const counterCode = `<script>
  let count = 0;
</script>

<div>
  <button on:click={() => count++}>
    Ich wurde {count} mal geklickt!
  </button>
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
  <button disabled={value >= 5} on:click={increment}>Klick</button>
  {#if value == 0}
    Fang an zu klicken!
  {:else if value < 5}
    Weiter so...
  {:else}
    Fertig!
    <button on:click={reset}>Zurücksetzen</button>
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
    Hallo, {name}!
  {:else}
    Bitte gib deinen Namen ein.
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
`

export const components = `
// Innere Komponente - Note.svelte
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




// Äußere Komponente
<script>
  import Note from "./Note.svelte";

  let notes = [
    { text: "foo", starred: false },
    { text: "bar", starred: true },
    { text: "baz", starred: false },
  ];
</script>

<div>
  {#each notes as {text, starred }}
    <Note {text} bind:starred />
  {/each}
</div>
`
