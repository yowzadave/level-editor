<script>
  export let value;
  export let options = [];
</script>

<select bind:value class="border border-gray-300 p-1 bg-transparent" on:input>
  {#each options as option}
    <option value={option.value}>
      {option.label}
    </option>
  {/each}
</select>
