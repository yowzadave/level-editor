<script>
  import { createEventDispatcher } from "svelte";
  import { fromEvent } from "file-selector";
  import UploadIcon from "../../assets/upload-lg.svg";
  import SpinnerIcon from "../../assets/spinner-lg.svg";
  import { isEvtWithFiles } from "./utils.js";

  export let accept = null;
  export let text = "Drag and drop or click to upload";
  export let readAs = "dataurl";

  const dispatch = createEventDispatcher();

  let fileInput;
  let dragcount = 0;
  let loading = false;

  export const stopLoading = () => {
    loading = false;
  };

  $: hovering = dragcount > 0;

  function clickUploader() {
    fileInput.click();
  }

  function handleFileSelected(evt) {
    loading = true;
    const file = evt.target.files[0];
    const reader = new FileReader();
    if (readAs === "dataurl") {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
    reader.onload = async (e) => {
      dispatch("drop", { file, data: e.target.result });
    };
  }

  function handleDragenter() {
    dragcount++;
  }

  function handleDragover(evt) {
    evt.preventDefault();
  }

  function handleDragleave() {
    dragcount--;
  }

  async function handleDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    dragcount = 0;

    if (isEvtWithFiles(evt)) {
      loading = true;
      const files = await fromEvent(evt);

      const file = files[0];
      const reader = new FileReader();
      if (readAs === "dataurl") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
      reader.onload = async (e) => {
        dispatch("drop", { file, data: e.target.result });
      };
    }
  }
</script>

<div
  class="w-full h-24 rounded border border-gray-300 border-dashed flex items-center cursor-pointer"
  class:bg-gray-100={hovering}
  on:click={clickUploader}
  on:dragenter={handleDragenter}
  on:dragover={handleDragover}
  on:dragleave={handleDragleave}
  on:drop={handleDrop}
>
  <div class="text-gray-400 w-full flex flex-col items-center">
    {#if loading}
      <div class="animate-spin">
        <SpinnerIcon />
      </div>
    {:else}
      <div class="mb-2">{text}</div>
      <div>
        <UploadIcon />
      </div>
    {/if}
    <input
      class="hidden"
      type="file"
      {accept}
      bind:this={fileInput}
      on:change={handleFileSelected}
    />
  </div>
</div>
