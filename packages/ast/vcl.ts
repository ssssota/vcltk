import type { Node } from "./base.js";
import type { Comment } from "./comment.js";
import type { Declaration } from "./declaration.js";

export type VCL = Node<
	"vcl",
	{ declarations: Declaration[]; comments: Comment[] }
>;
