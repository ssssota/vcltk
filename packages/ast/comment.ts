import type { Node } from "./base.js";

export namespace Comment {
	export type Line = Node<"comment_line", { value: string }>;
	export type Block = Node<"comment_block", { value: string }>;
	export type Hash = Node<"comment_hash", { value: string }>;
}
export type Comment = Comment.Line | Comment.Block | Comment.Hash;
