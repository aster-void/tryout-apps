<script lang="ts">
  import { useChat } from "^/api/chat.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
  const chat = useChat("aster-void", data.messages);

  let input = $state("");
</script>

<h1>Welcome to SvelteKit</h1>
<ul>
  {#each chat.messages as message}
    <li>{message.content}</li>
  {/each}
</ul>

<form
  onsubmit={async (ev) => {
    ev.preventDefault();
    await chat.push(input);
    input = "";
  }}
>
  <input bind:value={input} required />
  <button type="submit"> Post </button>
</form>
