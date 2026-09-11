import { chromium } from "playwright";

export type NetworkRecord = { url: string; method: string; status: number; contentType: string; responseBody?: unknown };

export async function sniffNetwork(url: string, searchPage = url): Promise<NetworkRecord[]> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const records: NetworkRecord[] = [];
    page.on("response", async (response) => {
      const type = response.headers()["content-type"] ?? "";
      if (!/json/i.test(type) || !["xhr", "fetch"].includes(response.request().resourceType())) return;
      let responseBody: unknown;
      try { responseBody = await response.json(); } catch { /* non-json body */ }
      records.push({ url: response.url(), method: response.request().method(), status: response.status(), contentType: type, responseBody });
    });
    await page.goto(searchPage, { waitUntil: "domcontentloaded", timeout: 30000 });
    const input = page.locator("input[type=search], input[name*=search i], input[placeholder*=search i]").first();
    if (await input.count()) { await input.fill("test"); await input.press("Enter").catch(() => undefined); }
    await page.waitForTimeout(1500);
    return records.slice(0, 50);
  } finally { await browser.close(); }
}