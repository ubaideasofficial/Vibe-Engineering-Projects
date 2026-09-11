import type { NetworkRecord } from "@mcp-forge/network-sniffer";

export type Classification = { search?: NetworkRecord; detail?: NetworkRecord; strategy: "api-call" | "browser-automation" };

export function classifyEndpoints(records: NetworkRecord[]): Classification {
  const json = records.filter((record) => record.status >= 200 && record.status < 300);
  const search = json.find((record) => /search|query|\bq=|graphql/i.test(record.url));
  const detail = json.find((record) => /detail|product|article|post|item|\/\d{2,}/i.test(record.url) && record !== search);
  return { search, detail, strategy: search || detail ? "api-call" : "browser-automation" };
}