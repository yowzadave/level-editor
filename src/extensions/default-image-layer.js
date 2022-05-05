import { sortableList } from "../extensions/sortable-list.js";

function defaultImageLayer(name, w, h) {
  return {
    type: "image",
    name,
    visible: true,
    map: Array.apply(null, Array(w * h)).map(() => null),
    tiles: sortableList([]),
    currentTile: null,
  };
}

export default defaultImageLayer;
