export type Span = [number, number];
export type Node<
	Kind extends string,
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	kind: Kind;
	span: Span;
} & T;
