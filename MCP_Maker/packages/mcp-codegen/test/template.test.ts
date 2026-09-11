import assert from "node:assert/strict";
import { test } from "node:test";
import { applyTemplate } from "../src/index.js";

test("a whole-pattern placeholder is substituted verbatim, not URL-encoded", () => {
  const result = applyTemplate("{{url}}", { url: "https://example.com/merge_pdf?x=1" });
  assert.equal(result, "https://example.com/merge_pdf?x=1");
  assert.doesNotThrow(() => new URL(result));
});

test("a placeholder embedded in a larger template is still URL-encoded", () => {
  const result = applyTemplate("https://example.com/?s={{query}}", { query: "a b/c" });
  assert.equal(result, "https://example.com/?s=a%20b%2Fc");
});

test("missing arguments substitute to an empty string", () => {
  assert.equal(applyTemplate("https://example.com/?s={{query}}", {}), "https://example.com/?s=");
});
