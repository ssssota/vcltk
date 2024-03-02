import { assertEquals } from "https://deno.land/std@0.217.0/assert/mod.ts";
import { parseNumber } from "./parse_number.ts";

Deno.test("parse decimal", () => {
  assertEquals(parseNumber("123"), 123n);
  assertEquals(parseNumber("-123"), -123n);
});

Deno.test("parse hex", () => {
  assertEquals(parseNumber("0x123"), 0x123n);
  assertEquals(parseNumber("-0x123"), -0x123n);
  assertEquals(parseNumber("0xDeadBeef"), 0xDeadBeefn);
});

Deno.test("parse exponent", () => {
  assertEquals(parseNumber("123e4"), 123 * 10_000);
  assertEquals(parseNumber("123e-4"), 123 / 10_000);
});

Deno.test("parse float", () => {
  assertEquals(parseNumber("123.456"), 123.456);
  assertEquals(parseNumber("-123.456"), -123.456);
});

Deno.test("parse hex float", () => {
  // 0xA.B;     = 10.6875
  // 0xA.Bp3;   = 10.6875 * (2^3) = 85.5
  // -0xA.Bp-3; = -10.6875 / (2^3) = -1.3359375
  // 0xAp3;     = 10 * (2^3) = 80
  assertEquals(parseNumber("0xA.B"), 10.6875);
  assertEquals(parseNumber("0xA.Bp3"), 85.5);
  assertEquals(parseNumber("-0xA.Bp-3"), -1.3359375);
  assertEquals(parseNumber("0xAp3"), 80);
});
