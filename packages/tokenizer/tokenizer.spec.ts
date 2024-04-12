import type { Token } from "@vcltk/token";
import { assert, test } from "vitest";
import { tokenize } from "./tokenizer.js";

test("If input is blank, return only eof token", () => {
	assert.deepEqual(tokenize(""), [
		{ kind: "eof", start: 0, end: 0 },
	] satisfies Token[]);
});

test("Tokenize special tokens", () => {
	assert.deepEqual(tokenize("\n"), [
		{ kind: "lf", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(" "), [
		{ kind: "ws", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
});

test("Tokenize conditional operators", () => {
	assert.deepEqual(tokenize("=="), [
		{ kind: "==", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("!="), [
		{ kind: "!=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("~"), [
		{ kind: "~", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("!~"), [
		{ kind: "!~", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(">"), [
		{ kind: ">", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("<"), [
		{ kind: "<", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(">="), [
		{ kind: ">=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("<="), [
		{ kind: "<=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
});

test("Tokenize assignment operators", () => {
	assert.deepEqual(tokenize("="), [
		{ kind: "=", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("+="), [
		{ kind: "+=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("-="), [
		{ kind: "-=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("*="), [
		{ kind: "*=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("/="), [
		{ kind: "/=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("%="), [
		{ kind: "%=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("|="), [
		{ kind: "|=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("&="), [
		{ kind: "&=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("^="), [
		{ kind: "^=", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("<<="), [
		{ kind: "<<=", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(">>="), [
		{ kind: ">>=", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("rol="), [
		{ kind: "rol=", start: 0, end: 4 },
		{ kind: "eof", start: 4, end: 4 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("ror="), [
		{ kind: "ror=", start: 0, end: 4 },
		{ kind: "eof", start: 4, end: 4 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("&&="), [
		{ kind: "&&=", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("||="), [
		{ kind: "||=", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
});

test("Tokenize special punctuation", () => {
	assert.deepEqual(tokenize("("), [
		{ kind: "(", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(")"), [
		{ kind: ")", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("{"), [
		{ kind: "{", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("}"), [
		{ kind: "}", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("["), [
		{ kind: "[", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("]"), [
		{ kind: "]", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(","), [
		{ kind: ",", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("."), [
		{ kind: ".", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(";"), [
		{ kind: ";", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(":"), [
		{ kind: ":", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("/"), [
		{ kind: "/", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("!"), [
		{ kind: "!", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("+"), [
		{ kind: "+", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("-"), [
		{ kind: "-", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("*"), [
		{ kind: "*", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("%"), [
		{ kind: "%", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("|"), [
		{ kind: "|", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("&"), [
		{ kind: "&", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("<<"), [
		{ kind: "<<", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(">>"), [
		{ kind: ">>", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("++"), [
		{ kind: "++", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("--"), [
		{ kind: "--", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
});

test("Tokenize special keywords", () => {
	assert.deepEqual(tokenize("acl"), [
		{ kind: "keyword", value: "acl", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("backend"), [
		{ kind: "keyword", value: "backend", start: 0, end: 7 },
		{ kind: "eof", start: 7, end: 7 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("declare"), [
		{ kind: "keyword", value: "declare", start: 0, end: 7 },
		{ kind: "eof", start: 7, end: 7 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("director"), [
		{ kind: "keyword", value: "director", start: 0, end: 8 },
		{ kind: "eof", start: 8, end: 8 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("import"), [
		{ kind: "keyword", value: "import", start: 0, end: 6 },
		{ kind: "eof", start: 6, end: 6 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("include"), [
		{ kind: "keyword", value: "include", start: 0, end: 7 },
		{ kind: "eof", start: 7, end: 7 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("table"), [
		{ kind: "keyword", value: "table", start: 0, end: 5 },
		{ kind: "eof", start: 5, end: 5 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("add"), [
		{ kind: "keyword", value: "add", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("call"), [
		{ kind: "keyword", value: "call", start: 0, end: 4 },
		{ kind: "eof", start: 4, end: 4 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("sub"), [
		{ kind: "keyword", value: "sub", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("error"), [
		{ kind: "keyword", value: "error", start: 0, end: 5 },
		{ kind: "eof", start: 5, end: 5 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("return"), [
		{ kind: "keyword", value: "return", start: 0, end: 6 },
		{ kind: "eof", start: 6, end: 6 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("set"), [
		{ kind: "keyword", value: "set", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("unset"), [
		{ kind: "keyword", value: "unset", start: 0, end: 5 },
		{ kind: "eof", start: 5, end: 5 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("log"), [
		{ kind: "keyword", value: "log", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("esi"), [
		{ kind: "keyword", value: "esi", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("synthetic"), [
		{ kind: "keyword", value: "synthetic", start: 0, end: 9 },
		{ kind: "eof", start: 9, end: 9 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("if"), [
		{ kind: "keyword", value: "if", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("else"), [
		{ kind: "keyword", value: "else", start: 0, end: 4 },
		{ kind: "eof", start: 4, end: 4 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("elsif"), [
		{ kind: "keyword", value: "elsif", start: 0, end: 5 },
		{ kind: "eof", start: 5, end: 5 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("elseif"), [
		{ kind: "keyword", value: "elseif", start: 0, end: 6 },
		{ kind: "eof", start: 6, end: 6 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("penaltybox"), [
		{ kind: "keyword", value: "penaltybox", start: 0, end: 10 },
		{ kind: "eof", start: 10, end: 10 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("ratecounter"), [
		{ kind: "keyword", value: "ratecounter", start: 0, end: 11 },
		{ kind: "eof", start: 11, end: 11 },
	] satisfies Token[]);
});

test("Tokenize identities", () => {
	assert.deepEqual(tokenize("ident"), [
		{ kind: "keyword", value: "ident", start: 0, end: 5 },
		{ kind: "eof", start: 5, end: 5 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("ident123"), [
		{ kind: "keyword", value: "ident123", start: 0, end: 8 },
		{ kind: "eof", start: 8, end: 8 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("ide.nt_12:3-"), [
		{ kind: "keyword", value: "ide.nt_12:3-", start: 0, end: 12 },
		{ kind: "eof", start: 12, end: 12 },
	] satisfies Token[]);
});

test("Tokenize literals (numbers)", () => {
	assert.deepEqual(tokenize("200"), [
		{ kind: "number", start: 0, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("0xDeadBeef"), [
		{ kind: "number", start: 0, end: 10 },
		{ kind: "eof", start: 10, end: 10 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("-134"), [
		{ kind: "number", start: 0, end: 4 },
		{ kind: "eof", start: 4, end: 4 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("0.2e3"), [
		{ kind: "number", start: 0, end: 5 },
		{ kind: "eof", start: 5, end: 5 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("01.5e-10"), [
		{ kind: "number", start: 0, end: 8 },
		{ kind: "eof", start: 8, end: 8 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("0x101.ABCp2"), [
		{ kind: "number", start: 0, end: 11 },
		{ kind: "eof", start: 11, end: 11 },
	] satisfies Token[]);
});

test("Tokenize literals (number+units)", () => {
	assert.deepEqual(tokenize("200 ms"), [
		{ kind: "number", start: 0, end: 3 },
		{ kind: "ws", start: 3, end: 4 },
		{ kind: "keyword", value: "ms", start: 4, end: 6 },
		{ kind: "eof", start: 6, end: 6 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("20%"), [
		{ kind: "number", start: 0, end: 2 },
		{ kind: "%", start: 2, end: 3 },
		{ kind: "eof", start: 3, end: 3 },
	] satisfies Token[]);
});

test("Tokenize literals (strings)", () => {
	assert.deepEqual(tokenize(`""`), [
		{ kind: "string", start: 0, end: 2 },
		{ kind: "eof", start: 2, end: 2 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(`"string"`), [
		{ kind: "string", start: 0, end: 8 },
		{ kind: "eof", start: 8, end: 8 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(`{""}`), [
		{ kind: "string", start: 0, end: 4 },
		{ kind: "eof", start: 4, end: 4 },
	] satisfies Token[]);
	assert.deepEqual(tokenize(`{a"a"a}`), [
		{ kind: "string", start: 0, end: 7 },
		{ kind: "eof", start: 7, end: 7 },
	] satisfies Token[]);
});

test("Tokenize comments", () => {
	assert.deepEqual(tokenize("// comment"), [
		{ kind: "comment", start: 0, end: 10 },
		{ kind: "eof", start: 10, end: 10 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("// comment\n"), [
		{ kind: "comment", start: 0, end: 10 },
		{ kind: "lf", start: 10, end: 11 },
		{ kind: "eof", start: 11, end: 11 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("/*\n  comment\n */\n"), [
		{ kind: "comment", start: 0, end: 16 },
		{ kind: "lf", start: 16, end: 17 },
		{ kind: "eof", start: 17, end: 17 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("#"), [
		{ kind: "comment", start: 0, end: 1 },
		{ kind: "eof", start: 1, end: 1 },
	] satisfies Token[]);
	assert.deepEqual(tokenize("# comment\n"), [
		{ kind: "comment", start: 0, end: 9 },
		{ kind: "lf", start: 9, end: 10 },
		{ kind: "eof", start: 10, end: 10 },
	] satisfies Token[]);
});
