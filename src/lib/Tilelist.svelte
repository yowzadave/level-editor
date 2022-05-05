<script>
  import isEmpty from "lodash/isEmpty";
  import partition from "lodash/partition";
  import { draggable } from "../extensions/draggable.js";
  import TrashIcon from "../assets/trash.svg";
  import {
    select,
    deselect,
    removeFromSortableList,
  } from "../extensions/sortable-list.js";

  export let layer;
  export let tilewidth;
  export let tileheight;
  export let zoom;

  let dragging = null;
  let container;

  function setCurrentToNull() {
    layer.currentTile = null;
    layer.tiles.selected = {};
  }

  function setCurrentTile(e, key) {
    layer.currentTile = key;

    if (e.shiftKey && !isEmpty(layer.tiles.selected)) {
      const indices = layer.tiles.order
        .map((key, i) => i)
        .filter((i) => {
          const k = layer.tiles.order[i];
          return k === key || layer.tiles.selected[k];
        });

      const min = Math.min(...indices);
      const max = Math.max(...indices);

      const keys = layer.tiles.order.slice(min, max + 1).reduce((h, k) => {
        h[k] = true;
        return h;
      }, {});

      layer.tiles.selected = keys;
    } else if (e.metaKey) {
      if (!layer.tiles.selected[key]) {
        select(layer.tiles, key);
      } else {
        deselect(layer.tiles, key);
      }

      layer.tiles = layer.tiles;
    } else {
      layer.tiles.selected = { [key]: true };
    }
  }

  function deleteSelected() {
    removeFromSortableList(layer.tiles, ...Object.keys(layer.tiles.selected));
    layer.tiles = layer.tiles;
  }

  function drag(key) {
    if (layer.currentTile !== key && !layer.tiles.selected[layer.currentTile]) {
      dragging = null;
    } else {
      dragging = key;
    }
  }

  function dragend() {
    dragging = null;
  }

  function drop(e) {
    if (!dragging || !layer.tiles.selected[dragging]) return;
    const div = e.target.closest("div");
    if (!div) return;
    if (!container.contains(div)) return;

    const dropKey = div.getAttribute("data-key");

    if (dragging === dropKey) return;

    const [keep, move] = partition(layer.tiles.order, (key) => {
      return !layer.tiles.selected[key];
    });

    const index = keep.indexOf(dropKey);

    keep.splice(index, 0, ...move);

    layer.tiles.order = keep;
  }
</script>

<div class="flex flex-wrap" bind:this={container}>
  <div
    class="border border-blue-200 hover:z-10 hover:ring ring-blue-500"
    on:click={setCurrentToNull}
    class:ring={!layer.currentTile}
    class:z-10={!layer.currentTile}
    style={`width:${tilewidth * zoom}px;height:${tileheight * zoom}px;`}
  >
    <svg width={tilewidth * zoom} height={tileheight * zoom}>
      <line
        x1={0}
        y1={tileheight * zoom}
        x2={tilewidth * zoom}
        y2={0}
        stroke="red"
      />
    </svg>
  </div>
  {#if layer.type === "index"}
    {#each layer.tiles.order as key, index}
      <div
        class="border border-blue-200 hover:z-10 hover:ring ring-blue-500"
        class:ring={layer.currentTile === key ||
          layer.tiles.selected[key] ||
          dragging === key}
        class:z-10={layer.currentTile === key}
        style={`width:${tilewidth * zoom}px;height:${
          tileheight * zoom
        }px;background-color:${layer.tiles[key].color};`}
        data-key={key}
        data-index={index}
        on:click={(e) => setCurrentTile(e, key)}
        use:draggable
        on:drag={() => drag(key)}
        on:dragend={dragend}
        on:mouseup={drop}
      />
    {/each}
  {:else}
    {#each layer.tiles.order as key, index}
      <div
        class="border border-blue-200 hover:z-10 hover:ring ring-blue-500"
        class:ring={layer.currentTile === key ||
          layer.tiles.selected[key] ||
          dragging === key}
        class:z-10={layer.currentTile === key}
        style={`width:${tilewidth * zoom}px;height:${tileheight * zoom}px;`}
        data-key={key}
        data-index={index}
        on:click={(e) => setCurrentTile(e, key)}
        use:draggable
        on:drag={() => drag(key)}
        on:dragend={dragend}
        on:mouseup={drop}
      >
        <img
          src={layer.tiles[key]}
          width={tilewidth * zoom}
          alt={`tile_${key}`}
        />
      </div>
    {/each}
  {/if}
</div>

<div class="flex flex-row">
  <div class="rounded p-2 hover:bg-gray-300" on:click={deleteSelected}>
    <TrashIcon />
  </div>
</div>
