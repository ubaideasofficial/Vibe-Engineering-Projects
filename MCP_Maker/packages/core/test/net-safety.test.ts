import assert from "node:assert/strict";
import { test } from "node:test";
import { assertPublicHostname, isPrivateAddress, isPrivateHostnameLiteral } from "../src/net-safety.js";

test("isPrivateAddress flags loopback, RFC1918, link-local, and metadata ranges", () => {
  assert.equal(isPrivateAddress("127.0.0.1"), true);
  assert.equal(isPrivateAddress("10.1.2.3"), true);
  assert.equal(isPrivateAddress("172.16.5.5"), true);
  assert.equal(isPrivateAddress("192.168.1.1"), true);
  assert.equal(isPrivateAddress("169.254.169.254"), true); // cloud metadata
  assert.equal(isPrivateAddress("100.64.0.1"), true); // CGNAT
  assert.equal(isPrivateAddress("::1"), true);
  assert.equal(isPrivateAddress("fe80::1"), true);
  assert.equal(isPrivateAddress("fc00::1"), true);
  assert.equal(isPrivateAddress("::ffff:127.0.0.1"), true);
});

test("isPrivateAddress allows ordinary public addresses", () => {
  assert.equal(isPrivateAddress("8.8.8.8"), false);
  assert.equal(isPrivateAddress("93.184.216.34"), false);
  assert.equal(isPrivateAddress("2606:4700:4700::1111"), false);
});

test("isPrivateHostnameLiteral catches localhost and .local without DNS", () => {
  assert.equal(isPrivateHostnameLiteral("localhost"), true);
  assert.equal(isPrivateHostnameLiteral("printer.local"), true);
  assert.equal(isPrivateHostnameLiteral("127.0.0.1"), true);
  assert.equal(isPrivateHostnameLiteral("example.com"), false);
});

test("assertPublicHostname rejects a hostname that resolves to a private address", async () => {
  await assert.rejects(() => assertPublicHostname("localhost"));
});
