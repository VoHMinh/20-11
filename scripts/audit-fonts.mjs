import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

const browser=await chromium.launch({channel:"chrome"});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
try {
  await page.goto("http://127.0.0.1:3000");
  const sample="Ăă Ââ Đđ Êê Ôô Ơơ Ưư ÁÀẢÃẠ áàảãạ ẤẦẨẪẬ ấầẩẫậ ẮẰẲẴẶ ắằẳẵặ ÉÈẺẼẸ éèẻẽẹ ẾỀỂỄỆ ếềểễệ ÍÌỈĨỊ íìỉĩị ÓÒỎÕỌ óòỏõọ ỐỒỔỖỘ ốồổỗộ ỚỜỞỠỢ ớờởỡợ ÚÙỦŨỤ úùủũụ ỨỪỬỮỰ ứừửữự ÝỲỶỸỴ ýỳỷỹỵ";
  const glyphs=[...new Set([...new Intl.Segmenter("vi",{granularity:"grapheme"}).segment(sample+" "+sample.normalize("NFD"))].map(v=>v.segment))];
  await page.evaluate(async(glyphs)=>{
    const probe=document.createElement("div");probe.id="audit-glyphs";
    for(let i=0;i<glyphs.length;i++){
      const span=document.createElement("span");span.id=`glyph-${i}`;span.textContent=glyphs[i];
      Object.assign(span.style,{fontFamily:"Nunito",fontSize:"24px",fontWeight:"400"});
      probe.append(span);
    }
    document.body.append(probe);
    await document.fonts.load('400 24px "Nunito"',glyphs.join(""));
    await document.fonts.ready;
  },glyphs);
  const cdp=await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");await cdp.send("CSS.enable");
  const {root}=await cdp.send("DOM.getDocument");
  const failures=[];
  for(let i=0;i<glyphs.length;i++){
    const {nodeId}=await cdp.send("DOM.querySelector",{nodeId:root.nodeId,selector:`#glyph-${i}`});
    const actual=await cdp.send("CSS.getPlatformFontsForNode",{nodeId});
    if(actual.fonts.some(f=>!f.isCustomFont)){
      failures.push({glyph:glyphs[i],codepoints:[...glyphs[i]].map(c=>c.codePointAt(0).toString(16)),fonts:actual.fonts});
    }
  }
  await fs.writeFile("artifacts/v3-glyph-diagnostics.json",JSON.stringify(failures,null,2));
  console.log(JSON.stringify({checked:glyphs.length,failures},null,2));
} finally {await browser.close();}
