import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit (memory fallback)", () => {
  it("limite le nombre d’appels pour une clé donnée", async () => {
    const results = await Promise.all([
      rateLimit({ key: "test", limit: 2, window: 60 }),
      rateLimit({ key: "test", limit: 2, window: 60 }),
      rateLimit({ key: "test", limit: 2, window: 60 }),
    ]);

    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(true);
    expect(results[2].success).toBe(false);
  });
});
