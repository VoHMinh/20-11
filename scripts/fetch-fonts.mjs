import fs from "node:fs/promises";
const base="https://raw.githubusercontent.com/google/fonts/main/ofl/";
const files=[
  ["nunito/Nunito[wght].ttf","nunito.ttf"],
  ["patrickhand/PatrickHand-Regular.ttf","patrick-hand.ttf"],
  ["cormorantgaramond/CormorantGaramond[wght].ttf","cormorant-garamond.ttf"],
  ["cormorantgaramond/CormorantGaramond-Italic[wght].ttf","cormorant-garamond-italic.ttf"],
  ["nunito/OFL.txt","nunito-OFL.txt"],
  ["patrickhand/OFL.txt","patrick-hand-OFL.txt"],
  ["cormorantgaramond/OFL.txt","cormorant-garamond-OFL.txt"],
];
await fs.mkdir("artifacts/font-originals",{recursive:true});
for(const [source,name] of files){
  const response=await fetch(base+source,{signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error(`${name}: ${response.status}`);
  const data=Buffer.from(await response.arrayBuffer());
  await fs.writeFile(`artifacts/font-originals/${name}`,data);
  console.log(`${name}: ${data.length} bytes`);
}
