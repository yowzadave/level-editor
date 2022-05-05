import { nanoid } from "nanoid";
import hashString from "./hash-string.js";

async function slicePng(stream, tilewidth, tileheight) {
  // get dimensions of image
  const image = new Image();
  image.src = stream;

  const { width, height } = await new Promise((resolve) => {
    image.onload = () => {
      const width = image.width;
      const height = image.height;
      image.style.width = `${tilewidth}px`;
      image.style.height = `${tileheight}px`;
      resolve({ width, height });
    };
  });

  const hslices = Math.ceil(width / tilewidth);
  const vslices = Math.ceil(height / tileheight);

  const tw = tilewidth;
  const th = tileheight;

  const slices = {};
  for (let x = 0; x < hslices; x++) {
    for (let y = 0; y < vslices; y++) {
      const canvas = document.createElement("canvas");
      canvas.width = tw;
      canvas.height = th;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, x * tw, y * th, tw, th, 0, 0, tw, th);

      const base64str = canvas.toDataURL();

      // We don't want to import multiple copies of the same image
      const hash = hashString(base64str);

      slices[hash] = base64str;
    }
  }

  return Object.values(slices).reduce((h, v) => {
    h[nanoid()] = v;
    return h;
  }, {});
}

export default slicePng;
