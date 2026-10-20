import {test,expect,type Page} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

async function settled(page:Page,scene:number){
  await expect(page.locator(`.film-scene-${scene}`)).toHaveCSS("opacity","1");
  await expect(page.locator(`.film-scene-${scene}`)).toHaveCSS("filter","blur(0px)");
}
async function noPageScroll(page:Page){
  expect(await page.evaluate(()=>({x:document.documentElement.scrollWidth<=innerWidth,y:document.documentElement.scrollHeight<=innerHeight}))).toEqual({x:true,y:true});
  await page.mouse.wheel(0,700);
  expect(await page.evaluate(()=>scrollY)).toBe(0);
  expect(await page.locator(".love-film").evaluate(e=>e.scrollTop)).toBe(0);
  await expect(page.locator(".film-header")).toBeInViewport({ratio:1});
}
test("five cinematic scenes, flowers, all photos, both quiz reactions, letter and finale",async({page},info)=>{
  test.setTimeout(90000);
  const errors:string[]=[],missing:string[]=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("response",r=>{if(r.status()>=400)missing.push(`${r.status()} ${r.url()}`);});
  await page.goto("/");
  await page.evaluate(()=>document.fonts.ready);
  await settled(page,0);
  await page.screenshot({path:`artifacts/v3-${info.project.name}-opening.png`});
  await noPageScroll(page);
  await page.getByRole("button",{name:"Bật nhạc",exact:true}).click();
  await expect(page.getByRole("button",{name:"Tắt nhạc",exact:true})).toHaveAttribute("aria-pressed","true");
  await page.getByRole("button",{name:"Tắt nhạc",exact:true}).click();
  for(let i=1;i<=6;i++){
    await page.getByRole("button",{name:"Chạm bó hoa để nhận lời chúc"}).click();
    await expect(page.locator(".flower-options")).toContainText(`lời thương ${i} / 6`);
  }
  await page.getByRole("button",{name:"Chọn bó hoa pastel",exact:true}).click();
  await expect(page.locator(".hero-bouquet img")).toHaveAttribute("src","/images/bouquet-pastel.webp");
  await page.screenshot({path:`artifacts/v3-${info.project.name}-flowers.png`});
  await page.getByRole("button",{name:"Đi cùng anh",exact:true}).click();
  await settled(page,1);
  await page.getByRole("button",{name:"Dừng ảnh tự chuyển",exact:true}).click();
  await page.screenshot({path:`artifacts/v3-${info.project.name}-memories.png`});
  for(let i=0;i<15;i++){await page.getByRole("button",{name:"Ảnh tiếp",exact:true}).click();}
  await expect(page.locator(".memory-controls>span")).toContainText("01");
  await page.locator(".memory-window.in-focus").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button",{name:"Ảnh tiếp trong ảnh lớn"}).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await noPageScroll(page);
  await page.getByRole("button",{name:"Hẹn bé một hôm nha",exact:true}).click();
  await settled(page,2);
  await page.getByRole("button",{name:/Đi ăn ngon, rồi dạo một vòng/}).click();
  await expect(page.getByAltText("Anh cười tít mắt")).toBeVisible();
  await page.getByRole("button",{name:"Còn một câu nữa thôi"}).click();
  await page.getByRole("button",{name:/Chụp hình cho bé tới khi ưng/}).click();
  await expect(page.getByAltText("Anh giả vờ phụng phịu")).toBeVisible();
  await page.screenshot({path:`artifacts/v3-${info.project.name}-reaction.png`});
  await page.getByRole("button",{name:"Mở cái hẹn của tụi mình"}).click();
  await expect(page.getByRole("heading",{name:"Vậy là mình có một cái hẹn."})).toBeVisible();
  await expect(page.locator(".date-plan")).toContainText("Ăn một bữa ngon");
  await expect(page.locator(".date-plan")).toContainText("Nhớ có một tấm chung");
  await page.screenshot({path:`artifacts/v3-${info.project.name}-invitation.png`});
  await page.getByRole("button",{name:"Anh còn mấy lời này"}).click();
  await settled(page,3);
  await page.screenshot({path:`artifacts/v3-${info.project.name}-letter.png`});
  for(let i=0;i<2;i++){await page.getByRole("button",{name:"Đọc tiếp nè"}).click();await expect(page.getByRole("button",{name:`Đọc đoạn thư ${i+2}`})).toHaveAttribute("aria-pressed","true");}
  await page.getByRole("button",{name:"Lại đây anh ôm"}).click();
  await settled(page,4);
  await expect(page.getByRole("heading",{name:"Chúc mừng 20/10, bé yêu của anh."})).toBeVisible();
  await page.getByRole("button",{name:"Nhận một cái ôm",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Ôm bé một cái, thật lâu."})).toBeVisible();
  await page.screenshot({path:`artifacts/v3-${info.project.name}-ending.png`});
  await noPageScroll(page);
  await page.getByRole("button",{name:"Xem lại câu chuyện"}).click();
  await settled(page,0);
  await expect(page.locator(".flower-options")).toContainText("hai bó hoa");
  expect(errors).toEqual([]);expect(missing).toEqual([]);
});

test("every scene fits small phone and landscape; reduced motion and accessibility",async({page},info)=>{
  test.setTimeout(150000);
  await page.emulateMedia({reducedMotion:"reduce"});
  const findings:unknown[]=[];
  for(const size of [{width:320,height:568},{width:844,height:390}]){
    await page.setViewportSize(size);
    await page.goto("/");
    await page.evaluate(()=>document.fonts.ready);
    for(let i=0;i<5;i++){
      if(i>0){await page.getByRole("button",{name:new RegExp(`^Cảnh 0${i+1}:`)}).click();}
      await settled(page,i);
      await page.waitForTimeout(900);
      await noPageScroll(page);
      await page.screenshot({path:`artifacts/v3-${info.project.name}-${size.width}-scene-${i}.png`});
      const outside=await page.locator(".film-scene button,.film-scene h1,.film-scene h2,.film-footer button").evaluateAll(elements=>elements.filter(e=>{
        const r=e.getBoundingClientRect();const style=getComputedStyle(e);
        if(style.visibility==="hidden"||style.display==="none"||!r.width||e.closest(".memory-universe"))return false;
        return r.top<0||r.bottom>innerHeight+1;
      }).map(e=>({text:e.textContent,rect:e.getBoundingClientRect().toJSON()})));
      expect(outside).toEqual([]);
      const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
      findings.push({size,scene:i,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
    }
  }
  await fs.writeFile(`artifacts/v3-audit-${info.project.name}.json`,JSON.stringify(findings,null,2));
  expect(findings.filter((f:any)=>f.violations.length)).toEqual([]);
  await expect(page.locator(".flower-canvas")).toBeHidden();
});

test("the other answers are remembered; hold and keyboard hugs work; replay resets",async({page})=>{
  await page.goto("/");
  await settled(page,0);
  await page.getByRole("button",{name:/^Cảnh 03:/}).click();
  await settled(page,2);
  await page.getByRole("button",{name:/Ngồi cạnh nhau, nói đủ thứ chuyện/}).click();
  await expect(page.locator(".reaction-scene")).toContainText("Tìm một góc yên yên");
  await page.getByRole("button",{name:"Còn một câu nữa thôi"}).click();
  await page.getByRole("button",{name:/Nắm tay bé, không được buông/}).click();
  await page.getByRole("button",{name:"Mở cái hẹn của tụi mình"}).click();
  await expect(page.locator(".date-plan")).toContainText("Một góc yên yên");
  await expect(page.locator(".date-plan")).toContainText("Nắm tay bé suốt buổi hẹn");
  await page.getByRole("button",{name:/^Cảnh 05:/}).click();
  await settled(page,4);
  const hug=page.getByRole("button",{name:"Nhận một cái ôm",exact:true});
  await hug.hover();
  await page.mouse.down();
  await expect(page.getByRole("heading",{name:"Ôm bé một cái, thật lâu."})).toBeVisible();
  await page.mouse.up();
  await page.getByRole("button",{name:"Ôm thêm cái nữa",exact:true}).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".hug-caption")).toContainText("giữ bé thêm chút");
  await page.getByRole("button",{name:"Xem lại câu chuyện"}).click();
  await settled(page,0);
  await page.waitForTimeout(900);
  await page.getByRole("button",{name:/^Cảnh 03:/}).click();
  await settled(page,2);
  await expect(page.locator(".story-answers button")).toHaveCount(2);
  await expect(page.locator(".teasing-scene>.scene-eyebrow")).toContainText("1/2");
});

test("Vietnamese accents render in their actual web font, without system fallback",async({page},info)=>{
  await page.goto("/");
  // Probe every Vietnamese vowel and tone, including decomposed combining marks.
  const sample="Ăă Ââ Đđ Êê Ôô Ơơ Ưư ÁÀẢÃẠ áàảãạ ẤẦẨẪẬ ấầẩẫậ ẮẰẲẴẶ ắằẳẵặ ÉÈẺẼẸ éèẻẽẹ ẾỀỂỄỆ ếềểễệ ÍÌỈĨỊ íìỉĩị ÓÒỎÕỌ óòỏõọ ỐỒỔỖỘ ốồổỗộ ỚỜỞỠỢ ớờởỡợ ÚÙỦŨỤ úùủũụ ỨỪỬỮỰ ứừửữự ÝỲỶỸỴ ýỳỷỹỵ";
  const fonts=[
    {family:"Nunito",weight:400,style:"normal"},
    {family:"Nunito",weight:600,style:"normal"},
    {family:"Nunito",weight:700,style:"normal"},
    {family:"Nunito",weight:800,style:"normal"},
    {family:"Patrick Hand",weight:400,style:"normal"},
    {family:"Cormorant Garamond",weight:500,style:"normal"},
    {family:"Cormorant Garamond",weight:500,style:"italic"},
  ];
  await page.evaluate(({fonts,sample})=>{
    const surface=document.createElement("div");surface.id="font-audit";
    Object.assign(surface.style,{position:"fixed",inset:"0",zIndex:"100",background:"#fff8fb",overflow:"auto",padding:"20px"});
    fonts.forEach((f,i)=>{
      const text=document.createElement("p");text.id=`font-probe-${i}`;
      text.textContent=sample+" "+sample.normalize("NFD");
      Object.assign(text.style,{fontFamily:`"${f.family}"`,fontWeight:String(f.weight),fontStyle:f.style,fontSize:"22px",lineHeight:"1.6",marginBottom:"16px"});
      surface.append(text);
    });document.body.append(surface);
  },{fonts,sample});
  await page.evaluate(async({fonts,sample})=>{
    await Promise.all(fonts.map(f=>document.fonts.load(`${f.style} ${f.weight} 22px "${f.family}"`,sample+" "+sample.normalize("NFD"))));
  },{fonts,sample});
  await page.evaluate(()=>document.fonts.ready);
  const cdp=await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");await cdp.send("CSS.enable");
  const {root}=await cdp.send("DOM.getDocument");
  const result=[];
  for(let i=0;i<fonts.length;i++){
    const {nodeId}=await cdp.send("DOM.querySelector",{nodeId:root.nodeId,selector:`#font-probe-${i}`});
    const actual=await cdp.send("CSS.getPlatformFontsForNode",{nodeId});
    result.push({expected:fonts[i],actual:actual.fonts});
    expect(actual.fonts.length).toBeGreaterThan(0);
    for(const face of actual.fonts){
      expect.soft(face.isCustomFont,`${fonts[i].family}: unexpected ${face.familyName}`).toBe(true);
      expect.soft(face.familyName.replaceAll(" ","").toLowerCase()).toContain(fonts[i].family.replaceAll(" ","").toLowerCase());
    }
  }
  await fs.writeFile(`artifacts/v3-fonts-${info.project.name}.json`,JSON.stringify(result,null,2));
  await page.screenshot({path:`artifacts/v3-${info.project.name}-font-proof.png`});
  await cdp.detach();
});
