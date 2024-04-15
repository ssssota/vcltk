import type { VisitorKeyMap } from "@vcltk/ast";

/**
 * UnionToIntersection<{ foo: string } | { bar: string }> =
 *  { foo: string } & { bar: string }.
 */
type UnionToIntersection<U> = (
	U extends unknown
		? (arg: U) => 0
		: never
) extends (arg: infer I) => 0
	? I
	: never;
/**
 * LastInUnion<1 | 2> = 2.
 */
type LastInUnion<U> = UnionToIntersection<
	U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
	? L
	: never;
/**
 * UnionToTuple<1 | 2> = [1, 2].
 */
type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
	? []
	: [...UnionToTuple<Exclude<U, Last>>, Last];

type VisitorKeyKey = {
	[K in keyof VisitorKeyMap]: VisitorKeyMap[K] extends never ? never : K;
}[keyof VisitorKeyMap];
type VisitorKeys = {
	[K in VisitorKeyKey]: UnionToTuple<VisitorKeyMap[K]>;
} & {
	[K in Exclude<keyof VisitorKeyMap, VisitorKeyKey>]?: [];
};

export const visitorKeys: VisitorKeys = {
	"acl-entry": ["address"],
	"function-call": ["target", "arguments"],
	"object-property": ["value"],
	"table-entry": ["value", "key"],
	acl: ["entries"],
	add: ["value", "target"],
	backend: ["properties"],
	binary: ["lhs", "operator", "rhs"],
	call: ["target"],
	block: ["body"],
	case: ["expr"],
	declare: ["target", "type"],
	director: ["properties", "directions"],
	if: ["body", "condition"],
	include: ["path"],
	log: ["message"],
	object: ["properties"],
	parenthesized: ["expr"],
	set: ["value", "target", "operator"],
	string: ["tokens"],
	sub: ["body"],
	table: ["entries"],
	unary: ["operator", "rhs"],
	string_concat: ["tokens"],
	synthetic: ["value"],
	unset: ["target"],
	vcl: ["declarations", "comments"],
};
