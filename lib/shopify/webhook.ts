import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyShopifyWebhook(
  payload: string,
  receivedHmac: string | null,
  secret: string,
): boolean {
  if (!receivedHmac || !secret) return false;

  const expected = createHmac("sha256", secret).update(payload).digest();
  const received = Buffer.from(receivedHmac, "base64");

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}
