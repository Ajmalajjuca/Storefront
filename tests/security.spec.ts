import { expect, test } from "@playwright/test";
import { sanitizeShopifyHtml } from "lib/sanitize-html";
import { verifyShopifyWebhook } from "lib/shopify/webhook";
import { createHmac } from "node:crypto";

test("sanitizes untrusted Shopify HTML", () => {
  const unsafe = [
    '<p class="copy" onclick="alert(1)">Safe</p>',
    '<script>alert("xss")</script>',
    '<img src="https://cdn.shopify.com/image.jpg" onerror="alert(1)">',
    '<a href="javascript:alert(1)" target="_blank">Bad link</a>',
  ].join("");

  const sanitized = sanitizeShopifyHtml(unsafe);

  expect(sanitized).toContain('<p class="copy">Safe</p>');
  expect(sanitized).toContain('loading="lazy"');
  expect(sanitized).toContain('rel="noopener noreferrer"');
  expect(sanitized).not.toContain("<script");
  expect(sanitized).not.toContain("onclick");
  expect(sanitized).not.toContain("onerror");
  expect(sanitized).not.toContain("javascript:");
});

test("verifies Shopify webhook signatures with constant-time comparison", () => {
  const payload = JSON.stringify({ id: 123, title: "Test product" });
  const secret = "test-secret";
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64");

  expect(verifyShopifyWebhook(payload, signature, secret)).toBe(true);
  expect(verifyShopifyWebhook(`${payload}tampered`, signature, secret)).toBe(
    false,
  );
  expect(verifyShopifyWebhook(payload, null, secret)).toBe(false);
});
