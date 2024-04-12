import type { Node } from "./base.js";
import type { Declaration } from "./declaration.js";

export type VCL = Node<"vcl", { declarations: Declaration[] }>;
