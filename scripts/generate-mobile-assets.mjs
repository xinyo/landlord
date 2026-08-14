import { resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "public/icon.png");
const assets = resolve(root, "apps/mobile/assets");

await sharp(source)
  .resize(1024, 1024)
  .png()
  .toFile(resolve(assets, "icon.png"));
await sharp({
  create: { width: 1284, height: 2778, channels: 4, background: "#fff" },
})
  .composite([
    {
      input: await sharp(source).resize(520, 520).png().toBuffer(),
      gravity: "centre",
    },
  ])
  .png()
  .toFile(resolve(assets, "splash.png"));

console.log("Generated Expo icon and splash assets from public/icon.png.");
