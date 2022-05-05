<script>
  export let value;
  export let parser = (v) => v;
  export let validator = (v) => true;
  export let width = 12;

  let inputValue = value;

  $: valid = validate(inputValue);

  function validate(v) {
    try {
      return validator(v);
    } catch (err) {
      return false;
    }
  }

  function handleInput() {
    let val = inputValue;

    try {
      val = parser(val);
      inputValue = val;

      if (valid && inputValue !== value) {
        value = inputValue;
      }
    } catch (err) {}
  }

  function keydown(e) {
    if (e.key === "Enter") {
      handleInput();
    }
  }

  function blur() {
    handleInput();
  }
</script>

<input
  class="p-1 bg-transparent rounded border border-gray-300"
  style={`width:${width / 4}rem;`}
  bind:value={inputValue}
  on:keydown={keydown}
  on:blur={blur}
  on:input
/>
