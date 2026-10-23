import { expect, test } from "@playwright/test";
import { createHmac } from "node:crypto";

test("renders the storefront and primary navigation", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { level: 1, name: /you always/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "COLLECTIONS" })).toBeVisible();
  await expect(page.getByRole("link", { name: "STORY" })).toBeVisible();
});

test("renders the product index and wishlist fallback", async ({ page }) => {
  await page.goto("/indexes/products");
  await expect(
    page.getByRole("heading", { level: 1, name: /the full line/i }),
  ).toBeVisible();

  await page.goto("/wishlist");
  await expect(page.getByText(/haven't saved anything yet/i)).toBeVisible();
});

test("sends production security headers", async ({ request }) => {
  const response = await request.get("/");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["x-powered-by"]).toBeUndefined();
  if (process.env.CI) {
    expect(response.headers()["strict-transport-security"]).toContain(
      "max-age=63072000",
    );
  }
});

test("rejects unsigned webhooks and accepts authentic signatures", async ({
  request,
}) => {
  const payload = JSON.stringify({ id: 123 });

  const unsigned = await request.post("/api/revalidate", {
    data: payload,
    headers: {
      "content-type": "application/json",
      "x-shopify-topic": "products/update",
    },
  });

  expect(unsigned.status()).toBe(401);

  const signature = createHmac("sha256", "playwright-webhook-secret")
    .update(payload)
    .digest("base64");
  const authentic = await request.post("/api/revalidate", {
    data: payload,
    headers: {
      "content-type": "application/json",
      "x-shopify-hmac-sha256": signature,
      "x-shopify-topic": "products/update",
    },
  });

  expect(authentic.ok()).toBe(true);
  expect(await authentic.json()).toMatchObject({ revalidated: true });
});
