import { assert, test } from "vitest";
import { parseNumber } from "./parse_number.js";

test("parse decimal", () => {
	assert.equal(parseNumber("123"), 123n);
	assert.equal(parseNumber("-123"), -123n);
});

test("parse hex", () => {
	assert.equal(parseNumber("0x123"), 0x123n);
	assert.equal(parseNumber("-0x123"), -0x123n);
	assert.equal(parseNumber("0xDeadBeef"), 0xdeadbeefn);
});

test("parse exponent", () => {
	assert.equal(parseNumber("123e4"), 123 * 10_000);
	assert.equal(parseNumber("123e-4"), 123 / 10_000);
});

test("parse float", () => {
	assert.equal(parseNumber("123.456"), 123.456);
	assert.equal(parseNumber("-123.456"), -123.456);
});

test("parse hex float", () => {
	// 0xA.B;     = 10.6875
	// 0xA.Bp3;   = 10.6875 * (2^3) = 85.5
	// -0xA.Bp-3; = -10.6875 / (2^3) = -1.3359375
	// 0xAp3;     = 10 * (2^3) = 80
	assert.equal(parseNumber("0xA.B"), 10.6875);
	assert.equal(parseNumber("0xA.Bp3"), 85.5);
	assert.equal(parseNumber("-0xA.Bp-3"), -1.3359375);
	assert.equal(parseNumber("0xAp3"), 80);
});
