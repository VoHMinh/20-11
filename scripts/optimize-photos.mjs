import sharp from "sharp";
import { access, copyFile } from "node:fs/promises";
for(let id=1;id<=15;id++) {
  const base=`public/images/photo-${String(id).padStart(2,"0")}`;
  const exists=await access(`${base}-full.webp`).then(()=>true).catch(()=>false);
  if(!exists) await copyFile(`${base}.webp`,`${base}-full.webp`);
  await sharp(`${base}-full.webp`).resize({width:640,withoutEnlargement:true}).webp({quality:80}).toFile(`${base}.webp`);
}
console.log("15 responsive display photos optimized; full-size lightbox copies preserved.");
