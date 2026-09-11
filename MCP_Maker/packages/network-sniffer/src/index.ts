import { chromium, type Page } from "playwright";
import { assertPublicHostname } from "@mcp-forge/core";
import { redactRecord, type NetworkRecord } from "./redact.js";

export type { NetworkRecord } from "./redact.js";

async function gotoPublic(page: Page, target: string): Promise<void> {
  await assertPublicHostname(new URL(target).hostname);
  await page.goto(target, { waitUntil: "domcontentloaded", timeout: 30000 });
  await assertPublicHostname(new URL(page.url()).hostname);
}

export async function sniffNetwork(url: string, searchPage = url, detailPage?: string): Promise<NetworkRecord[]> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const records: NetworkRecord[] = [];
    page.on("response", async (response) => {
      const type = response.headers()["content-type"] ?? "";
      if (!/json/i.test(type) || !["xhr", "fetch"].includes(response.request().resourceType())) return;
      let responseBody: unknown;
      try { responseBody = await response.json(); } catch { /* non-json body */ }
      const request = response.request();
      records.push(redactRecord({
        url: response.url(),
        method: request.method(),
        status: response.status(),
        contentType: type,
        requestHeaders: request.headers(),
        responseHeaders: response.headers(),
        requestBody: request.postData() ?? undefined,
        responseBody
      }));
    });
    await gotoPublic(page, searchPage);
    const input = page.locator("input[type=search], input[name*=search i], input[placeholder*=search i]").first();
    if (await input.count()) { await input.fill("test"); await input.press("Enter").catch(() => undefined); }
    await page.waitForTimeout(1500);
    if (detailPage && detailPage !== searchPage) {
      await gotoPublic(page, detailPage).catch(() => undefined);
      await page.waitForTimeout(1000);
    }
    return records.slice(0, 50);
  } finally { await browser.close(); }
}