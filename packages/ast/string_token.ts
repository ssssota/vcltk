import type { Node } from "./base.js";

export namespace StringToken {
	export type QuotedString = Node<
		"quoted-string",
		{ value: string; raw: string }
	>;
	export type HereDoc = Node<"heredoc", { value: string; raw: string }>;
}

export type StringToken = StringToken.QuotedString | StringToken.HereDoc;
