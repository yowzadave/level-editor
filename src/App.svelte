<script>
  import TextInput from "./lib/TextInput.svelte";
  import SelectInput from "./lib/SelectInput.svelte";
  import BooleanInput from "./lib/BooleanInput.svelte";
  import ResizablePanes from "./lib/ResizablePanes.svelte";
  import EditIcon from "./assets/edit.svg";
  import FillIcon from "./assets/fill.svg";
  import ExportIcon from "./assets/export.svg";
  import ImportIcon from "./assets/import.svg";
  import ZoomInIcon from "./assets/zoom.svg";
  import ZoomOutIcon from "./assets/zoom-out.svg";
  import UploadIcon from "./assets/upload.svg";
  import Tilemap from "./lib/Tilemap.svelte";
  import Tilelist from "./lib/Tilelist.svelte";
  import CurrentTile from "./lib/CurrentTile.svelte";
  import Dropzone from "./lib/dropzone/Dropzone.svelte";
  import IndexAdder from "./lib/IndexAdder.svelte";
  import Modal from "./lib/Modal.svelte";
  import slicePng from "./extensions/slice-png.js";
  import { addToSortableList } from "./extensions/sortable-list.js";
  import defaultImageLayer from "./extensions/default-image-layer.js";
  import defaultIndexLayer from "./extensions/default-index-layer.js";
  import downloadJson from "./extensions/download-json.js";
  import downloadObjectAsJson from "./extensions/download-json.js";

  const intParser = (v) => parseInt(v);
  const dValidator = (v) => v > 0;

  // variables that could be in localStorage
  let tilewidth;
  let tileheight;
  let tilesh;
  let tilesv;
  let showgrid;
  let zoom;
  let layers;

  // other variables
  let uploadModal;
  let dropzone;
  let importDataModal;
  let importDropzone;
  let currentTool = "edit";
  let currentLayerIndex = 0;

  const ld = localStorage.getItem("data");
  if (ld) {
    load(JSON.parse(ld));
  } else {
    reset();
  }

  let prevTilesh = tilesh;
  let prevTilesv = tilesv;

  $: currentLayer = layers[currentLayerIndex];
  $: currentTile = currentLayer && currentLayer.currentTile;
  $: resize(tilesh, tilesv);

  function load(data) {
    try {
      tilewidth = data.tilewidth;
      tileheight = data.tileheight;
      tilesh = data.tilesh;
      tilesv = data.tilesv;
      showgrid = data.showgrid;
      zoom = data.zoom;
      layers = data.layers;
    } catch {
      reset();
    }
  }

  function reset() {
    tilewidth = 16;
    tileheight = 16;
    tilesh = 25;
    tilesv = 15;
    showgrid = true;
    layers = [
      defaultImageLayer("background", tilesh, tilesv),
      defaultIndexLayer("walls", tilesh, tilesv),
      defaultImageLayer("sprites", tilesh, tilesv),
    ];
    zoom = 1;
  }

  function createData() {
    return {
      tilewidth,
      tileheight,
      tilesh,
      tilesv,
      showgrid,
      zoom,
      layers,
    };
  }

  function save() {
    const data = JSON.stringify(createData());
    localStorage.setItem("data", data);
  }

  function exportData() {
    downloadObjectAsJson(createData(), "levelfile");
  }

  function importData(evt) {
    const { data } = evt.detail;
    load(JSON.parse(data));

    importDropzone.stopLoading();
    importDataModal.close();
  }

  function resize(tilesh, tilesv) {
    layers.forEach((layer) => {
      let newMap = Array.apply(null, Array(tilesh * tilesv)).map(() => null);
      for (let i = 0; i < Math.min(prevTilesv, tilesv); i++) {
        for (let j = 0; j < Math.min(prevTilesh, tilesh); j++) {
          const oldIndex = i * prevTilesh + j;
          const newIndex = i * tilesh + j;
          const ov = layer.map[oldIndex];
          newMap[newIndex] = ov;
        }
      }

      layer.map = newMap;
    });

    layers = layers;
    prevTilesh = tilesh;
    prevTilesv = tilesv;
  }

  function zoomin() {
    if (zoom < 8) zoom *= 2;
  }

  function zoomout() {
    if (zoom > 1) zoom /= 2;
  }

  async function uploadFiles(evt) {
    const { data } = evt.detail;
    const slices = await slicePng(data, tilewidth, tileheight);

    addToSortableList(currentLayer.tiles, ...Object.entries(slices));

    layers = layers;

    dropzone.stopLoading();
    uploadModal.close();
  }

  function changeLayerType(e) {
    const value = e.target.value;

    const type = {
      image: defaultImageLayer,
      index: defaultIndexLayer,
    };

    layers[currentLayerIndex] = type[value](currentLayer.name, tilesh, tilesv);
  }
</script>

<main class="flex flex-col h-full overflow-hidden">
  <div
    class="bg-gray-100 h-10 flex-none flex items-center text-xs border-b border-gray-200 px-2 justify-between"
  >
    <div class="flex items-center space-x-2">
      <div class="flex items-center space-x-2">
        <div>Tile Width</div>
        <TextInput
          bind:value={tilewidth}
          parser={intParser}
          validator={dValidator}
        />
      </div>
      <div class="flex items-center space-x-2">
        <div>Tile Height</div>
        <TextInput
          bind:value={tileheight}
          parser={intParser}
          validator={dValidator}
        />
      </div>
      <div class="flex items-center space-x-2">
        <div>Tiles (Vertical)</div>
        <TextInput
          bind:value={tilesv}
          parser={intParser}
          validator={dValidator}
        />
      </div>
      <div class="flex items-center space-x-2">
        <div>Tiles (Horizontal)</div>
        <TextInput
          bind:value={tilesh}
          parser={intParser}
          validator={dValidator}
        />
      </div>
      <div class="flex items-center space-x-2">
        <div>Show Grid</div>
        <BooleanInput bind:value={showgrid} />
      </div>
    </div>
    <div class="flex flex-row space-x-2">
      <button
        class="p-1 border border-gray-300 rounded hover:bg-gray-300"
        on:click={reset}>Reset</button
      >
      <button
        class="p-1 border border-gray-300 rounded hover:bg-gray-300"
        on:click={save}>Save</button
      >
    </div>
    <div class="flex flex-row space-x-2">
      <div
        class="rounded p-2 hover:bg-gray-300"
        class:bg-gray-300={currentTool === "edit"}
        on:click={() => (currentTool = "edit")}
      >
        <EditIcon />
      </div>
      <div
        class="rounded p-2 hover:bg-gray-300"
        class:bg-gray-300={currentTool === "fill"}
        on:click={() => (currentTool = "fill")}
      >
        <FillIcon />
      </div>
      <div class="rounded p-2 hover:bg-gray-300" on:click={zoomin}>
        <ZoomInIcon />
      </div>
      <div class="rounded p-2 hover:bg-gray-300" on:click={zoomout}>
        <ZoomOutIcon />
      </div>
      <div
        class="rounded p-2 hover:bg-gray-300"
        on:click={() => importDataModal.open()}
      >
        <ImportIcon />
      </div>
      <div class="rounded p-2 hover:bg-gray-300" on:click={exportData}>
        <ExportIcon />
      </div>
    </div>
  </div>
  <div class="flex-grow overflow-hidden">
    <ResizablePanes>
      <Tilemap
        slot="content"
        bind:layers
        {currentLayerIndex}
        {tilesh}
        {tilesv}
        {tilewidth}
        {tileheight}
        {zoom}
        {showgrid}
        {currentTile}
        {currentTool}
      />
      <div slot="pane" class="flex flex-row items-stretch h-full text-xs">
        <div class="flex-grow p-4">
          <div class="flex space-x-4">
            <div class="p-1">Layers</div>
            <div>
              {#each layers as layer, i}
                <div
                  class="flex space-x-2 items-center px-2 py-1 cursor-pointer"
                  class:bg-blue-500={i === currentLayerIndex}
                  class:text-white={i === currentLayerIndex}
                  on:click={() => (currentLayerIndex = i)}
                >
                  <BooleanInput
                    bind:value={layer.visible}
                    on:click={(e) => e.stopPropagation()}
                  />
                  <div>{layer.name}</div>
                </div>
              {/each}
            </div>
            {#if currentLayer}
              <div class="flex-grow">
                <div class="flex justify-between">
                  <div class="flex space-x-2 items-center mb-2">
                    {#key currentLayerIndex}
                      <div class="flex items-center space-x-2">
                        <div>Name</div>
                        <TextInput bind:value={currentLayer.name} width={24} />
                      </div>
                      <div class="flex items-center space-x-2">
                        <div>Type</div>
                        <SelectInput
                          value={currentLayer.type}
                          options={[
                            { label: "image", value: "image" },
                            { label: "index", value: "index" },
                          ]}
                          on:input={changeLayerType}
                        />
                      </div>
                    {/key}
                  </div>

                  {#if currentLayer.type === "image"}
                    <div>
                      <div
                        class="rounded p-2 hover:bg-gray-300"
                        on:click={() => uploadModal.open()}
                      >
                        <UploadIcon />
                      </div>
                    </div>
                  {/if}
                </div>

                {#key currentLayerIndex}
                  {#if currentLayer.type === "index"}
                    <IndexAdder bind:layer={currentLayer} />
                  {/if}
                  <Tilelist
                    bind:layer={currentLayer}
                    {tilewidth}
                    {tileheight}
                    {zoom}
                  />
                {/key}
              </div>
            {/if}
          </div>
        </div>
        <div class="flex-none w-72 border-l border-gray-300">
          {#if currentLayer}
            <CurrentTile bind:layer={currentLayer} />
          {/if}
        </div>
      </div>
    </ResizablePanes>
  </div>

  <Modal bind:this={uploadModal} closeable>
    <div slot="title">Upload</div>
    <div slot="content">
      <Dropzone on:drop={uploadFiles} bind:this={dropzone} accept="image/png" />
    </div>
  </Modal>

  <Modal bind:this={importDataModal} closeable>
    <div slot="title">Upload</div>
    <div slot="content">
      <Dropzone
        on:drop={importData}
        bind:this={importDropzone}
        readAs={"text"}
        accept="application/json"
      />
    </div>
  </Modal>
</main>

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  :global {
    body {
      height: 100vh;
      width: 100vw;
    }

    #app {
      width: 100%;
      height: 100%;
    }

    img {
      image-rendering: optimizeSpeed; /* STOP SMOOTHING, GIVE ME SPEED  */
      image-rendering: -moz-crisp-edges; /* Firefox */
      image-rendering: -o-crisp-edges; /* Opera */
      image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
      image-rendering: pixelated; /* Chrome */
      image-rendering: optimize-contrast; /* CSS3 Proposed */
      -ms-interpolation-mode: nearest-neighbor; /* IE8+ */
    }
  }
</style>
