<script>
  export let layers;
  export let currentLayerIndex;
  export let tilesh;
  export let tilesv;
  export let tilewidth;
  export let tileheight;
  export let zoom;
  export let showgrid;
  export let currentTile;
  export let currentTool;

  $: rows = Array.apply(null, Array(tilesv)).map((n, i) => i);
  $: cols = Array.apply(null, Array(tilesh)).map((n, i) => i);

  let swiping = false;

  function index(row, col) {
    return row * tilesh + col;
  }

  function setTile(row, col) {
    const i = index(row, col);
    layers[currentLayerIndex].map[i] = currentTile;
    layers = layers;
  }

  function beginSwipe(row, col) {
    if (currentTool === "edit") {
      swiping = true;
      setTile(row, col);
    } else if (currentTool === "fill") {
      layers[currentLayerIndex].map = Array.apply(
        null,
        Array(tilesh * tilesv)
      ).map(() => currentTile);
      layers = layers;
    }
  }

  function mouseover(row, col) {
    if (!swiping) return;
    setTile(row, col);
  }

  function endSwipe(row, col) {
    setTile(row, col);
    swiping = false;
  }

  function focus(row, col) {}
</script>

<div class="p-8 w-full h-full overflow-auto">
  <div class="relative">
    {#each rows as row}
      {#each cols as col}
        <div
          class="absolute border-blue-300 hover:ring hover:z-10 ring-blue-500"
          class:border-b={showgrid}
          class:border-r={showgrid}
          style={`top:${row * tileheight * zoom}px;left:${
            col * tilewidth * zoom
          }px;width:${tilewidth * zoom}px;height:${tileheight * zoom}px`}
          on:mousedown|preventDefault={() => beginSwipe(row, col)}
          on:mouseover={() => mouseover(row, col)}
          on:mouseup|preventDefault={() => endSwipe(row, col)}
          on:focus={() => focus(row, col)}
        >
          {#each layers as layer, l (l)}
            {#if layer.visible && layer.map[index(row, col)] && layer.tiles[layer.map[index(row, col)]]}
              {#if layer.type === "image"}
                <img
                  class="absolute"
                  src={layer.tiles[layer.map[index(row, col)]]}
                  width={tilewidth * zoom}
                  alt={`layer_${l}_map_${index(row, col)}`}
                />
              {:else}
                <div
                  class="absolute w-full h-full opacity-70"
                  style={`background-color:${
                    layer.tiles[layer.map[index(row, col)]].color
                  };`}
                />
              {/if}
            {/if}
          {/each}
          {#if layers.every((l) => !l.visible || !l.map[index(row, col)] || !l.tiles[l.map[index(row, col)]])}
            <svg width={tilewidth * zoom} height={tileheight * zoom}>
              <line
                x1={0}
                y1={tileheight * zoom}
                x2={tilewidth * zoom}
                y2={0}
                stroke="red"
              />
            </svg>
          {/if}
        </div>
      {/each}
    {/each}
    <div
      class="absolute border border-black z-20 pointer-events-none"
      style={`width:${tilewidth * tilesh * zoom}px;height:${
        tileheight * tilesv * zoom
      }px`}
    />
  </div>
</div>
