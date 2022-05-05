<script>
  import { nanoid } from "nanoid";
  import TextInput from "./TextInput.svelte";
  import { addToSortableList } from "../extensions/sortable-list.js";
  import getRandomColor from "../extensions/random-color";

  export let layer;

  let label = "";

  function addIndex() {
    const color = getRandomColor();
    addToSortableList(layer.tiles, [nanoid(), { color, label }]);
    layer = layer;
    label = "";
  }
</script>

<div class="flex space-x-2 items-center mb-2">
  <div>Add index</div>
  <TextInput bind:value={label} width={24} />
  <button
    class="p-1 rounded hover:bg-gray-300 border border-gray-300"
    on:click={addIndex}>+</button
  >
</div>
