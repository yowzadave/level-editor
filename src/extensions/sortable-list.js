import { nanoid } from "nanoid";

function sortableList(arr) {
  return arr.reduce(
    (o, el) => {
      o.order.push(el.id);
      o[el.id] = el;
      return o;
    },
    { order: [], selected: {} }
  );
}

function orderedList(obj) {
  return obj.order.map((id) => obj[id]);
}

function addToSortableList(obj, ...items) {
  items.forEach(([key, item]) => {
    obj[key] = item;
    obj.order.push(key);
  });
}

function appendToList(obj, ...items) {
  items.forEach((item) => {
    const key = nanoid();
    obj.order.push(key);
    obj[key] = item;
  });
}

function replaceInOrder(obj, ...items) {
  items.forEach((item, i) => {
    const key = obj.order[i] || nanoid();
    obj.order[i] = key;
    obj[key] = item;
  });
}

function removeFromSortableList(obj, ...keys) {
  const keyHash = keys.reduce((h, key) => {
    h[key] = true;
    return h;
  }, {});

  obj.order = obj.order.filter((key) => !keyHash[key]);

  keys.forEach((key) => {
    delete obj[key];
    delete obj.selected[key];
  });
}

function deselect(obj, ...keys) {
  keys.forEach((key) => {
    delete obj.selected[key];
  });
}

function deselectAll(obj) {
  obj.selected = {};
}

function select(obj, ...keys) {
  keys.forEach((key) => {
    obj.selected[key] = true;
  });
}

function findSelected(obj) {
  const key = Object.keys(obj.selected)[0];
  return key && obj[key];
}

export {
  sortableList,
  orderedList,
  addToSortableList,
  replaceInOrder,
  appendToList,
  removeFromSortableList,
  select,
  deselect,
  deselectAll,
  findSelected,
};
