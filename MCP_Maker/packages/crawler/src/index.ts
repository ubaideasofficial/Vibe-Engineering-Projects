export type CrawlResult = {
  url: string;
  name: string;
  robotsTxt: string;
  disallowedPaths: string[];
  sitemapUrls: string[];
  links: string[];
  searchPage?: string;
  detailPages: string[];
};

function sameOrigin(candidate: string, base: URL): boolean {
  try { return new URL(candidate).origin === base.origin; } catch { return false; }
}

function parseLinks(html: string, base: URL): string[] {
  const links = new Set<string>();
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    try {
      const link = new URL(match[1], base).toString();
      if (sameOrigin(link, base) && !/[#?]/.test(link)) links.add(link);
    } catch { /* ignore malformed links */ }
  }
  return [...links].slice(0, 40);
}

function parseRobots(text: string): string[] {
  return text.split(/\r?\n/).filter((line) => /^disallow:/i.test(line)).map((line) => line.split(":").slice(1).join(":").trim()).filter(Boolean);
}

export function isDisallowed(pathname: string, rules: string[]): boolean {
  return rules.some((rule) => rule !== "/" && pathname.startsWith(rule));
}

export async function crawlSite(inputUrl: string): Promise<CrawlResult> {
  const base = new URL(inputUrl);
  const robotsResponse = await fetch(new URL("/robots.txt", base), { signal: AbortSignal.timeout(10000) }).catch(() => undefined);
  const robotsTxt = robotsResponse?.ok ? await robotsResponse.text() : "";
  const disallowedPaths = parseRobots(robotsTxt);
  const pageResponse = await fetch(base, { signal: AbortSignal.timeout(15000), headers: { "user-agent": "MCP-Forge/0.1 discovery" } });
  if (!pageResponse.ok) throw new Error(`Target returned HTTP ${pageResponse.status}`);
  const html = await pageResponse.text();
  const links = parseLinks(html, base).filter((link) => !isDisallowed(new URL(link).pathname, disallowedPaths));
  const searchPage = links.find((link) => /search|query|find/i.test(link));
  const detailPages = links.filter((link) => /product|article|post|news|item|detail|\d{2,}/i.test(link)).slice(0, 5);
  const title = html.match(/<title[^>]*>([^<]+)</i)?.[1]?.trim() ?? base.hostname;
  const sitemap = robotsTxt.match(/^sitemap:\s*(.+)$/im)?.[1]?.trim();
  return { url: base.toString(), name: title, robotsTxt, disallowedPaths, sitemapUrls: sitemap ? [sitemap] : [], links, searchPage, detailPages };
}