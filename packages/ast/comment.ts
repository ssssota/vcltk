import type { Node } from "./base.js";

export namespace Comment {
	export type Line = Node<"comment_line", { text: string }>;
	export type Block = Node<"comment_block", { text: string }>;
	export type Hash = Node<"comment_hash", { text: string }>;
}
export type Comment = Comment.Line | Comment.Block | Comment.Hash;
