import { assert, test } from "vitest";
import { getSpan } from "./span.js";

test("getSpan", () => {
	const text = "foo\nbar\nbaz";
	const span = getSpan(text, 4, 7);
	assert.deepEqual(span, {
		start: { line: 1, column: 0, index: 4 },
		end: { line: 1, column: 3, index: 7 },
	});
});
