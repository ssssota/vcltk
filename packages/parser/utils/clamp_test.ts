import { assertEquals } from "https://deno.land/std@0.217.0/assert/mod.ts";
import { clamp } from "./clamp.ts";

Deno.test("clamp", () => {
  assertEquals(clamp(5, 0, 10), 5);
  assertEquals(clamp(5, 10, 20), 10);
  assertEquals(clamp(5, 0, 4), 4);
  assertEquals(clamp(5n, 0n, 10n), 5n);
  assertEquals(clamp(5n, 10n, 20n), 10n);
  assertEquals(clamp(5n, 0n, 4n), 4n);
});
