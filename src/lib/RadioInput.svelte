<script>
  export let options = [];
  export let value;
  export let name;
</script>

<div>
  {#each options as option}
    <div class="flex space-x-2 items-center">
      <input type="radio" {name} bind:group={value} value={option.value} />
      <div>{option.label}</div>
    </div>
  {/each}
</div>
