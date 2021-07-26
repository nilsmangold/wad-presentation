<script>
  import ComponentsInner from "./ComponentsInner.svelte";

  let notes = [
    { text: "foo", starred: false },
    { text: "bar", starred: true },
    { text: "baz", starred: false },
  ];

  function remove(text) {
    notes = notes.filter((note) => note.text != text);
  }

  let text = "";
</script>

<div>
  {#each notes as { text, starred }}
    <ComponentsInner {text} bind:starred remove={() => remove(text)} />
  {/each}
  <input bind:value={text} />
  <button
    on:click={() => {
      notes = [...notes, { text, starred: false }];
      text = "";
    }}>+</button
  >
</div>
