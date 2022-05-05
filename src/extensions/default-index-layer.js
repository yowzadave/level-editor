import { sortableList } from "../extensions/sortable-list.js";

function defaultIndexLayer(name, w, h) {
  return {
    type: "index",
    name,
    visible: true,
    map: Array.apply(null, Array(w * h)).map(() => null),
    tiles: sortableList([]),
    currentTile: null,
  };
}

export default defaultIndexLayer;
