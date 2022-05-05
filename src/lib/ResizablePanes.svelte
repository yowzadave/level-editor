<script>
  import { draggable } from "../extensions/draggable.js";
  export let startLeft = 300; // starting size of first pane, as a percentage
  export let startBottom = 300; // starting size of first pane, as a percentage
  export let direction = "vertical"; // panes can be horizontal or vertical

  export let showPane = true;
  let w;
  let h;
  let container;
  let sizeLeft = startLeft;
  let sizeBottom = startBottom;

  $: clampedSizeBottom = Math.min(Math.max(sizeBottom, 24), h - 24);
  $: clampedSizeLeft = Math.min(Math.max(sizeLeft, 24), w - 24);

  function dragHorizontal(evt) {
    const { x } = evt.detail;
    const rect = container.getBoundingClientRect();
    sizeLeft = x - rect.left;
  }

  function dragVertical(evt) {
    const { y } = evt.detail;
    const rect = container.getBoundingClientRect();
    sizeBottom = h - (y - rect.top);
  }
</script>

<div
  bind:offsetWidth={w}
  bind:offsetHeight={h}
  bind:this={container}
  class="w-full h-full relative overflow-hidden"
  class:flex={direction === "horizontal"}
  class:items-stretch={direction === "horizontal"}
>
  {#if direction === "vertical"}
    <div
      class="relative w-full overflow-hidden"
      style={`height:${showPane ? h - clampedSizeBottom : h}px;`}
    >
      <slot name="content" />
      <div
        class="absolute w-full bottom-0 h-2 cursor-row-resize z-10"
        use:draggable
        on:drag={dragVertical}
        on:dragend={dragVertical}
      />
    </div>

    {#if showPane}
      <div
        class="border-t border-gray-300 w-full relative overflow-hidden bg-gray-100"
        style={`height:${sizeBottom}px;`}
      >
        <slot name="pane" />
      </div>
    {/if}
  {:else}
    {#if showPane}
      <div
        class="relative h-full flex-none overflow-hidden bg-gray-100"
        style={`width:${clampedSizeLeft}px;`}
      >
        <slot name="pane" />
      </div>
    {/if}

    <div class="border-l border-gray-300 relative grow">
      <div
        class="absolute h-full w-2 -ml-1 cursor-col-resize z-10"
        use:draggable
        on:drag={dragHorizontal}
        on:dragend={dragHorizontal}
      />
      <slot name="content" />
    </div>
  {/if}
</div>
