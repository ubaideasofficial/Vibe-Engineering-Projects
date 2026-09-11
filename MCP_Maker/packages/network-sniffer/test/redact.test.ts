import assert from "node:assert/strict";
import { test } from "node:test";
import { inferSchema, redactHeaders, redactRecord } from "../src/redact.js";

test("redactHeaders masks cookie and authorization values, keeps others", () => {
  const result = redactHeaders({ Authorization: "Bearer secret", Cookie: "session=abc", "Content-Type": "application/json" });
  assert.equal(result?.Authorization, "[REDACTED]");
  assert.equal(result?.Cookie, "[REDACTED]");
  assert.equal(result?.["Content-Type"], "application/json");
});

test("redactRecord redacts sensitive body fields and truncates long strings", () => {
  const record = redactRecord({
    url: "https://example.com/api/user",
    method: "GET",
    status: 200,
    contentType: "application/json",
    responseHeaders: { "set-cookie": "session=abc" },
    responseBody: { name: "Ada", accessToken: "eyJsecret", bio: "x".repeat(1000) }
  });
  const body = record.responseBody as Record<string, unknown>;
  assert.equal(body.name, "Ada");
  assert.equal(body.accessToken, "[REDACTED]");
  assert.equal(typeof body.bio, "string");
  assert.ok((body.bio as string).length < 1000);
  assert.equal(record.responseHeaders?.["set-cookie"], "[REDACTED]");
});

test("inferSchema infers object/array/primitive shapes", () => {
  const schema = inferSchema({ items: [{ title: "a", price: 1 }], total: 1 });
  assert.equal(schema.type, "object");
  if (schema.type === "object") {
    assert.equal(schema.properties.total.type, "number");
    assert.equal(schema.properties.items.type, "array");
  }
});
