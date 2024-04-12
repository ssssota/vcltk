import { assert, test } from "vitest";
import { unescapeString } from "./unescape.js";

test("2 hex patterns", () => {
	assert.equal(unescapeString("%20%21"), " !");
	assert.equal(unescapeString("%2"), "%2");
	assert.equal(unescapeString("20%"), "20%");
});

test("4 hex patterns", () => {
	assert.equal(unescapeString("%u0020%u0021"), " !");
	assert.equal(unescapeString("%u002"), "%u002");
	assert.equal(unescapeString("0020%u"), "0020%u");
});

test("6 hex patterns", () => {
	assert.equal(unescapeString("%u{20}%u{21}"), " !");
	assert.equal(unescapeString("%u{000020}%u{000021}"), " !");
	assert.equal(unescapeString("%u{0020"), "%u{0020");
	assert.equal(unescapeString("%u{}"), "%u{}");
});

test("null character", () => {
	assert.equal(unescapeString("a%00b"), "a");
	assert.equal(unescapeString("a%u0000b"), "a");
	assert.equal(unescapeString("a%u{0}b"), "a");
	assert.equal(unescapeString("%00"), "");
});
