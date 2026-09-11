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

function parseSitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim()).filter(Boolean).slice(0, 100);
}

export function isDisallowed(pathname: string, rules: string[]): boolean {
  return rules.some((rule) => rule !== "/" && pathname.startsWith(rule));
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { "user-agent": "MCP-Forge/0.1 discovery" } });
  if (!response.ok) throw new Error(`Target returned HTTP ${response.status}`);
  return response.text();
}

async function discoverLinks(base: URL, seedLinks: string[], rules: string[]): Promise<string[]> {
  const discovered = new Set(seedLinks);
  const queue = seedLinks.slice(0, 12).map((url) => ({ url, depth: 1 }));
  while (queue.length) {
    const current = queue.shift();
    if (!current || current.depth > 2 || discovered.size >= 40) continue;
    const html = await fetchPage(current.url).catch(() => "");
    for (const link of parseLinks(html, base)) {
      const pathname = new URL(link).pathname;
      if (isDisallowed(pathname, rules) || discovered.has(link)) continue;
      discovered.add(link);
      if (current.depth < 2) queue.push({ url: link, depth: current.depth + 1 });
      if (discovered.size >= 40) break;
    }
  }
  return [...discovered];
}

export async function crawlSite(inputUrl: string): Promise<CrawlResult> {
  const base = new URL(inputUrl);
  const robotsResponse = await fetch(new URL("/robots.txt", base), { signal: AbortSignal.timeout(10000) }).catch(() => undefined);
  const robotsTxt = robotsResponse?.ok ? await robotsResponse.text() : "";
  const disallowedPaths = parseRobots(robotsTxt);
  const html = await fetchPage(base.toString());
  const homepageLinks = parseLinks(html, base).filter((link) => !isDisallowed(new URL(link).pathname, disallowedPaths));
  const robotsSitemap = robotsTxt.match(/^sitemap:\s*(.+)$/im)?.[1]?.trim();
  const sitemapCandidates = [robotsSitemap, new URL("/sitemap.xml", base).toString()].filter((value): value is string => Boolean(value));
  const sitemapUrls = new Set<string>();
  for (const sitemapUrl of sitemapCandidates) {
    const xml = await fetchPage(sitemapUrl).catch(() => "");
    parseSitemapUrls(xml).forEach((url) => { if (sameOrigin(url, base) && !isDisallowed(new URL(url).pathname, disallowedPaths)) sitemapUrls.add(url); });
  }
  const links = await discoverLinks(base, [...new Set([...sitemapUrls, ...homepageLinks])], disallowedPaths);
  const searchPage = links.find((link) => /search|query|find/i.test(link));
  const detailPages = links.filter((link) => /product|article|post|news|item|detail|\d{2,}/i.test(link)).slice(0, 5);
  const title = html.match(/<title[^>]*>([^<]+)</i)?.[1]?.trim() ?? base.hostname;
  return { url: base.toString(), name: title, robotsTxt, disallowedPaths, sitemapUrls: [...sitemapUrls], links, searchPage, detailPages };
}
