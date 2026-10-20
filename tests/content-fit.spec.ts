import { test, expect, type Page } from "@playwright/test";

async function fits(page: Page) {
  const clipped = await page.locator(".film-scene h2,.film-scene p,.date-postscript,.letter-last-line,.story-answers button").evaluateAll(nodes => {
    const stage = document.querySelector(".film-stage")!.getBoundingClientRect();
    return nodes.filter(node => {
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return false;
      return box.top < stage.top - 1 || box.bottom > stage.bottom + 1 || box.left < 0 || box.right > innerWidth;
    }).map(node => ({ text: node.textContent, box: node.getBoundingClientRect().toJSON() }));
  });
  expect(clipped).toEqual([]);
}

test("long Vietnamese replies, the date and every letter remain inside the stage", async ({page}, info) => {
  test.setTimeout(90000);
  await page.emulateMedia({reducedMotion:"reduce"});
  for (const size of [{width:320,height:568},{width:844,height:390}]) {
    await page.setViewportSize(size);
    await page.goto("/");
    await page.getByRole("button",{name:/^Cảnh 03:/}).click();
    await page.getByRole("button",{name:/Đi ăn ngon, rồi dạo một vòng/}).click();
    await page.waitForTimeout(500);
    await fits(page);
    await page.getByRole("button",{name:"Còn một câu nữa thôi"}).click();
    await page.getByRole("button",{name:/Chụp hình cho bé tới khi ưng/}).click();
    await page.waitForTimeout(500);
    await fits(page);
    await page.getByRole("button",{name:"Mở cái hẹn của tụi mình"}).click();
    await expect(page.locator(".date-keepsake")).toBeVisible();
    await page.waitForTimeout(600);
    await fits(page);
    await page.screenshot({path:`artifacts/v3-${info.project.name}-${size.width}-invitation.png`});
    await page.getByRole("button",{name:"Anh còn mấy lời này"}).click();
    for(let i=1;i<=3;i++){
      await page.getByRole("button",{name:`Đọc đoạn thư ${i}`,exact:true}).click();
      await page.waitForTimeout(1100);
      await fits(page);
      await page.screenshot({path:`artifacts/v3-${info.project.name}-${size.width}-letter-${i}.png`});
    }
  }
});
