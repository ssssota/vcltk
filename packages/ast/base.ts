export type LOC = { line: number; column: number; index: number };
export type Span = { start: LOC; end: LOC };
export type Node<
	Kind extends string,
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	kind: Kind;
	span: Span;
} & T;
