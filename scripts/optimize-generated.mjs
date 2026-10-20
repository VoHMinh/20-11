import sharp from "sharp";
import path from "node:path";
const root = path.resolve("public/images");
const sources = path.resolve("artifacts/generated");
for (const name of ["bouquet", "bouquet-pastel"]) {
  await sharp(path.join(sources, `${name}.png`)).resize({ height: 1100, withoutEnlargement: true }).webp({ quality: 88 }).toFile(path.join(root, `${name}.webp`));
}
await sharp(path.join(sources, "flower.png")).resize(256,256).webp({quality:88}).toFile(path.join(root, "flower.webp"));
console.log("Optimized transparent flowers.");
