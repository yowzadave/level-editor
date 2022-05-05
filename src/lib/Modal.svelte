<script>
  import { createEventDispatcher } from "svelte";
  import XIcon from "../assets/x.svg";

  export let isOpen = false;
  export let closeable = false;
  export let buttons = [];
  export let width = "24rem";
  export let height = null;

  const dispatch = createEventDispatcher();

  $: containerStyles = `width:${width};` + (height ? `height:${height};` : "");

  export const open = () => {
    isOpen = true;
    dispatch("open");
  };

  export const close = () => {
    isOpen = false;
    dispatch("close");
  };

  function handleClick(button) {
    if (button.type === "confirm") {
      dispatch("confirm");
    }
    close();
  }
</script>

{#if isOpen}
  <div
    class="fixed modal-container top-0 right-0 bottom-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-900/25"
    on:click|stopPropagation={close}
    on:mousedown|stopPropagation
  >
    <div
      class="bg-white rounded shadow-lg text-sm max-h-full relative flex flex-col"
      style={containerStyles}
      on:click|stopPropagation
    >
      <div class="w-full px-4 py-2 border-b text-gray-500 flex-none">
        {#if closeable}
          <div class="flex justify-between items-center">
            <div>
              <slot name="title" />
            </div>
            <div
              class="p-1 rounded hover:bg-gray-100 cursor-pointer"
              on:click={close}
            >
              <XIcon />
            </div>
          </div>
        {:else}
          <slot name="title" />
        {/if}
      </div>

      <div class="w-full text-left p-4 grow overflow-hidden flex flex-col">
        <slot name="content" />
      </div>

      {#if buttons.length > 0}
        <div
          class="w-full px-4 mb-4 flex space-x-2 items-center justify-end flex-none"
        >
          {#each buttons as button}
            <button
              class="btn"
              class:btn-danger-minimal={button.style === "danger"}
              class:btn-primary={button.style === "primary"}
              on:click={() => handleClick(button)}>{button.label}</button
            >
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-container {
    z-index: 200;
  }
</style>
