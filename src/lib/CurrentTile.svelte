<script>
  import TextInput from "./TextInput.svelte";

  export let layer;

  let color = "";

  $: tile = layer.currentTile !== null && layer.tiles[layer.currentTile];
  $: getColor(tile);

  function getColor(tile) {
    color = tile.color;
  }

  function updateTileColor() {
    layer.tiles[layer.currentTile].color = color;
  }
</script>

<div class="p-8">
  <div class="w-full">
    {#if tile}
      {#if layer.type === "image"}
        <img class="w-56" src={tile} alt="current tile" />
      {:else}
        <div class="w-56 h-48 mb-2" style={`background-color:${tile.color};`} />
        <div class="flex items-center space-x-2">
          <div>Color</div>
          <TextInput bind:value={color} width={28} />
          <button
            class="rounded border border-gray-300 p-1"
            on:click={updateTileColor}>Update</button
          >
        </div>
      {/if}
    {/if}
  </div>
</div>
