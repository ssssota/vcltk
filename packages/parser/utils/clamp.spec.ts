import { assert, test } from "vitest";
import { clamp } from "./clamp.js";

test("clamp", () => {
	assert.equal(clamp(5, 0, 10), 5);
	assert.equal(clamp(5, 10, 20), 10);
	assert.equal(clamp(5, 0, 4), 4);
	assert.equal(clamp(5n, 0n, 10n), 5n);
	assert.equal(clamp(5n, 10n, 20n), 10n);
	assert.equal(clamp(5n, 0n, 4n), 4n);
});
