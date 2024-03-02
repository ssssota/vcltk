import { assertEquals } from "https://deno.land/std@0.217.0/assert/mod.ts";
import { unescape } from "./unescape.ts";

Deno.test("2 hex patterns", () => {
  assertEquals(unescape("%20%21"), " !");
  assertEquals(unescape("%2"), "%2");
  assertEquals(unescape("20%"), "20%");
});

Deno.test("4 hex patterns", () => {
  assertEquals(unescape("%u0020%u0021"), " !");
  assertEquals(unescape("%u002"), "%u002");
  assertEquals(unescape("0020%u"), "0020%u");
});

Deno.test("6 hex patterns", () => {
  assertEquals(unescape("%u{20}%u{21}"), " !");
  assertEquals(unescape("%u{000020}%u{000021}"), " !");
  assertEquals(unescape("%u{0020"), "%u{0020");
  assertEquals(unescape("%u{}"), "%u{}");
});

Deno.test("null character", () => {
  assertEquals(unescape("a%00b"), "a");
  assertEquals(unescape("a%u0000b"), "a");
  assertEquals(unescape("a%u{0}b"), "a");
  assertEquals(unescape("%00"), "");
});
