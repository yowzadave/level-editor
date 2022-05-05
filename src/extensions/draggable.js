function draggable(node, { use = true } = {}) {
  if (!use) return;

  let x;
  let y;

  node.addEventListener("mousedown", handleMousedown);

  function handleMousedown(event) {
    event.preventDefault();
    x = event.clientX;
    y = event.clientY;
    node.classList.add("dragged");
    node.dispatchEvent(
      new CustomEvent("dragstart", { detail: { x, y, button: event.button } })
    );
    window.addEventListener("mousemove", handleMousemove);
    window.addEventListener("mouseup", handleMouseup);
  }

  function handleMousemove(event) {
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    x = event.clientX;
    y = event.clientY;

    node.dispatchEvent(
      new CustomEvent("drag", {
        detail: { x, y, dx, dy, button: event.button },
      })
    );
  }

  function handleMouseup(event) {
    node.classList.remove("dragged");
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    x = event.clientX;
    y = event.clientY;
    node.dispatchEvent(
      new CustomEvent("dragend", {
        detail: { x, y, dx, dy, button: event.button },
      })
    );
    window.removeEventListener("mousemove", handleMousemove);
    window.removeEventListener("mouseup", handleMouseup);
  }

  return {
    destroy() {
      node.removeEventListener("mousedown", handleMousedown);
    },
  };
}

export { draggable };
