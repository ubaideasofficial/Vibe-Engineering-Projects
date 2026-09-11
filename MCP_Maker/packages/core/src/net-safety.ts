import { promises as dns } from "node:dns";
import net from "node:net";

function ipv4ToInt(parts: number[]): number {
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function ipv4InCidr(address: string, cidr: string): boolean {
  const [range, bitsText] = cidr.split("/");
  const bits = Number(bitsText);
  const addressParts = address.split(".").map(Number);
  const rangeParts = range.split(".").map(Number);
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ipv4ToInt(addressParts) & mask) === (ipv4ToInt(rangeParts) & mask);
}

const BLOCKED_IPV4_CIDRS = [
  "0.0.0.0/8",
  "10.0.0.0/8",
  "100.64.0.0/10",
  "127.0.0.0/8",
  "169.254.0.0/16",
  "172.16.0.0/12",
  "192.0.0.0/24",
  "192.0.2.0/24",
  "192.168.0.0/16",
  "198.18.0.0/15",
  "198.51.100.0/24",
  "203.0.113.0/24",
  "224.0.0.0/4",
  "240.0.0.0/4",
  "255.255.255.255/32"
];

function isPrivateIpv4(address: string): boolean {
  return BLOCKED_IPV4_CIDRS.some((cidr) => ipv4InCidr(address, cidr));
}

function isPrivateIpv6(address: string): boolean {
  const normalized = address.toLowerCase();
  if (normalized === "::1" || normalized === "::") return true;
  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIpv4(mapped[1]);
  const firstGroup = normalized.split(":")[0];
  const firstHextet = parseInt(firstGroup || "0", 16);
  if ((firstHextet & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
  if ((firstHextet & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  return false;
}

export function isPrivateAddress(address: string): boolean {
  const family = net.isIP(address);
  if (family === 4) return isPrivateIpv4(address);
  if (family === 6) return isPrivateIpv6(address);
  return true; // not a literal IP -> treat unresolved input as unsafe by default
}

export function isPrivateHostnameLiteral(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host === "::1" || host.endsWith(".local")) return true;
  if (net.isIP(host)) return isPrivateAddress(host);
  return false;
}

export async function assertPublicHostname(hostname: string): Promise<void> {
  if (isPrivateHostnameLiteral(hostname)) throw new Error(`Refusing to contact private host: ${hostname}`);
  const records = await dns.lookup(hostname, { all: true, verbatim: true }).catch(() => {
    throw new Error(`Could not resolve host: ${hostname}`);
  });
  if (records.length === 0) throw new Error(`Could not resolve host: ${hostname}`);
  for (const record of records) {
    if (isPrivateAddress(record.address)) throw new Error(`Refusing to contact private address ${record.address} for host ${hostname}`);
  }
}

export type SafeFetchOptions = { maxRedirects?: number };

export async function safeFetch(input: string | URL, init: RequestInit = {}, options: SafeFetchOptions = {}): Promise<Response> {
  const maxRedirects = options.maxRedirects ?? 5;
  let current = new URL(input);
  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    if (current.protocol !== "http:" && current.protocol !== "https:") throw new Error(`Unsupported protocol: ${current.protocol}`);
    await assertPublicHostname(current.hostname);
    const response = await fetch(current, { ...init, redirect: "manual" });
    if (response.status >= 300 && response.status < 400 && response.headers.has("location")) {
      current = new URL(response.headers.get("location")!, current);
      continue;
    }
    return response;
  }
  throw new Error("Too many redirects");
}
