<script>
  let joke = fetchJoke();
  function fetchJoke() {
    return fetch("https://api.icndb.com/jokes/random").then((r) => r.json());
  }
</script>

{#await joke}
  <p>Loading...</p>
{:then data}
  <p>{data.value.joke}</p>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}
<button on:click={() => (joke = fetchJoke())}>New joke</button>
