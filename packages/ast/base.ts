export type LOC = { line: number; column: number; index: number };
export type Span = { start: LOC; end: LOC };
export type Node<
	Kind extends string,
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	kind: Kind;
	span: Span;
} & T;

export type VisitorKey<T extends Node<string>> = Exclude<
	keyof T,
	"kind" | "span"
> extends infer K
	? K extends keyof T
		? T[K] extends Node<string>
			? K
			: T[K] extends Node<string>[]
				? K
				: never
		: never
	: never;
