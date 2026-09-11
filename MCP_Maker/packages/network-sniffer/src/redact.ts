export type JsonSchemaShape =
  | { type: "object"; properties: Record<string, JsonSchemaShape> }
  | { type: "array"; items: JsonSchemaShape }
  | { type: "string" | "number" | "boolean" | "null" | "unknown" };

export type NetworkRecord = {
  url: string;
  method: string;
  status: number;
  contentType: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: unknown;
  responseBody?: unknown;
  responseSchema?: JsonSchemaShape;
};

const SENSITIVE_HEADER_NAMES = new Set([
  "authorization",
  "proxy-authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "api-key",
  "x-auth-token",
  "x-access-token"
]);

const SENSITIVE_FIELD_PATTERN = /token|secret|password|passwd|apikey|api_key|authorization|auth_token|access_token|refresh_token|session|cookie|ssn|credit.?card/i;

const MAX_STRING_LENGTH = 500;
const MAX_ARRAY_ITEMS = 10;
const MAX_OBJECT_KEYS = 30;
const MAX_DEPTH = 5;

export function redactHeaders(headers: Record<string, string> | undefined): Record<string, string> | undefined {
  if (!headers) return headers;
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    result[key] = SENSITIVE_HEADER_NAMES.has(key.toLowerCase()) ? "[REDACTED]" : value;
  }
  return result;
}

function redactValue(value: unknown, depth: number): unknown {
  if (depth > MAX_DEPTH) return "[TRUNCATED]";
  if (typeof value === "string") return value.length > MAX_STRING_LENGTH ? `${value.slice(0, MAX_STRING_LENGTH)}…[TRUNCATED]` : value;
  if (Array.isArray(value)) return value.slice(0, MAX_ARRAY_ITEMS).map((item) => redactValue(item, depth + 1));
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).slice(0, MAX_OBJECT_KEYS);
    const result: Record<string, unknown> = {};
    for (const [key, nested] of entries) {
      result[key] = SENSITIVE_FIELD_PATTERN.test(key) ? "[REDACTED]" : redactValue(nested, depth + 1);
    }
    return result;
  }
  return value;
}

export function redactBody(body: unknown): unknown {
  if (body === undefined) return undefined;
  if (typeof body === "string") {
    try { return redactValue(JSON.parse(body), 0); } catch { return redactValue(body, 0); }
  }
  return redactValue(body, 0);
}

export function inferSchema(value: unknown, depth = 0): JsonSchemaShape {
  if (depth > MAX_DEPTH) return { type: "unknown" };
  if (value === null) return { type: "null" };
  if (Array.isArray(value)) return { type: "array", items: value.length ? inferSchema(value[0], depth + 1) : { type: "unknown" } };
  if (typeof value === "object") {
    const properties: Record<string, JsonSchemaShape> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>).slice(0, MAX_OBJECT_KEYS)) {
      properties[key] = inferSchema(nested, depth + 1);
    }
    return { type: "object", properties };
  }
  if (typeof value === "string") return { type: "string" };
  if (typeof value === "number") return { type: "number" };
  if (typeof value === "boolean") return { type: "boolean" };
  return { type: "unknown" };
}

export function redactRecord(record: NetworkRecord): NetworkRecord {
  const responseBody = redactBody(record.responseBody);
  return {
    ...record,
    requestHeaders: redactHeaders(record.requestHeaders),
    responseHeaders: redactHeaders(record.responseHeaders),
    requestBody: redactBody(record.requestBody),
    responseBody,
    responseSchema: responseBody === undefined ? undefined : inferSchema(responseBody)
  };
}
