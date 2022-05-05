function isContainedBy(target, list = []) {
  return list.some((node) => {
    return node.contains(target);
  });
}

export function clickOutside(node, ignoreList) {
  const handleClick = (event) => {
    if (
      !node.contains(event.target) &&
      !isContainedBy(event.target, ignoreList)
    ) {
      node.dispatchEvent(new CustomEvent("outclick"));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
